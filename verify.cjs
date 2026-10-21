/* Runtime verification harness using Chrome DevTools Protocol (no extra deps). */
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.env.TARGET_URL || 'http://localhost:4200/';
const PORT = Number(process.env.CDP_PORT || 9222);

const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDataDir}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch (_) { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('Chrome did not expose a debugging endpoint');
}

function connect(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.onopen = () => resolve();
    ws.onerror = (e) => reject(e);
  });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
  return { ws, send, ready };
}

const results = {};
const consoleErrors = [];

(async () => {
  const wsUrl = await getWsUrl();
  const browser = connect(wsUrl);
  await browser.ready;

  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params = {}) => browser.send(method, params, sessionId);

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  browser.ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push('EXCEPTION: ' + (msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text));
    }
    if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) {
      consoleErrors.push(msg.params.type.toUpperCase() + ': ' +
        msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      consoleErrors.push('LOG: ' + msg.params.entry.text + ' @ ' + (msg.params.entry.url || ''));
    }
  });

  await send('Page.navigate', { url: URL });
  await sleep(3500);

  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      throw new Error('Eval failed for: ' + expr + ' => ' + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    }
    return r.result.value;
  };

  results.title = await evaluate('document.title');
  results.heroHeading = await evaluate("document.querySelector('#hero h1')?.innerText.replace(/\\n/g,' ')");
  results.navLinks = await evaluate("Array.from(document.querySelectorAll('.nav-links a')).map(a=>a.textContent.trim())");
  results.sections = await evaluate("Array.from(document.querySelectorAll('section[id]')).map(s=>s.id)");
  results.projectTitles = await evaluate("Array.from(document.querySelectorAll('.proj-title')).map(e=>e.textContent.trim())");
  results.projectClients = await evaluate("Array.from(document.querySelectorAll('.proj-client')).map(e=>e.textContent.trim())");
  results.expRoles = await evaluate("Array.from(document.querySelectorAll('.exp-role')).map(e=>e.textContent.trim())");
  results.expContexts = await evaluate("Array.from(document.querySelectorAll('.exp-context')).map(e=>e.textContent.trim())");
  results.expStackCounts = await evaluate("Array.from(document.querySelectorAll('.exp-stack')).map(e=>e.querySelectorAll('.tag').length)");
  results.skillCards = await evaluate("Array.from(document.querySelectorAll('.skill-card-title')).map(e=>e.textContent.trim())");
  results.contactLinks = await evaluate("Array.from(document.querySelectorAll('.contact-link')).map(a=>({label:a.querySelector('.contact-link-label').textContent.trim(), href:a.getAttribute('href'), target:a.getAttribute('target'), rel:a.getAttribute('rel')}))");
  results.buttonsHaveType = await evaluate("Array.from(document.querySelectorAll('button')).every(b=>b.getAttribute('type')==='button')");
  results.h1Count = await evaluate("document.querySelectorAll('h1').length");
  results.h2List = await evaluate("Array.from(document.querySelectorAll('h2')).map(e=>e.textContent.trim())");
  results.h3Count = await evaluate("document.querySelectorAll('h3').length");
  results.mainLandmark = await evaluate("!!document.querySelector('main#main')");
  results.landmarkCount = await evaluate("document.querySelectorAll('main, nav, footer').length");
  results.navAriaInitial = await evaluate("document.querySelector('.nav-toggle')?.getAttribute('aria-expanded')");
  results.mutedColor = await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--muted').trim()");
  results.techHighlights = await evaluate("Array.from(document.querySelectorAll('.proj-card')).map(c=>Array.from(c.querySelectorAll('.proj-tech .tag')).map(t=>t.classList.contains('highlight')))");

  // --- Expand a project card ---
  results.detailBefore = await evaluate("document.querySelectorAll('.proj-detail').length");
  await evaluate("document.querySelectorAll('.proj-toggle')[0].click()");
  await sleep(400);
  results.detailAfterExpand = await evaluate("document.querySelectorAll('.proj-detail').length");
  results.expandedCardCount = await evaluate("document.querySelectorAll('.proj-card.expanded').length");
  results.expandedHeadings = await evaluate("Array.from(document.querySelectorAll('.proj-card.expanded .detail-heading')).map(e=>e.textContent.trim())");
  results.expandedAria = await evaluate("document.querySelectorAll('.proj-toggle')[0].getAttribute('aria-expanded')");
  results.toggleLabel = await evaluate("document.querySelectorAll('.proj-toggle')[0].innerText.replace(/\\n/g,' ')");
  results.expandedCardSpansFullRow = await evaluate("getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnStart + '/' + getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnEnd");

  // --- Expand a second card; first should collapse ---
  await evaluate("document.querySelectorAll('.proj-toggle')[2].click()");
  await sleep(400);
  results.detailCountAfterSecond = await evaluate("document.querySelectorAll('.proj-detail').length");
  results.expandedIndexAfterSecond = await evaluate("Array.from(document.querySelectorAll('.proj-card')).findIndex(c=>c.classList.contains('expanded'))");

  // --- Collapse the same card again ---
  await evaluate("document.querySelectorAll('.proj-toggle')[2].click()");
  await sleep(400);
  results.detailCountAfterCollapse = await evaluate("document.querySelectorAll('.proj-detail').length");

  // --- Project links only render when present ---
  results.projLinkCount = await evaluate("document.querySelectorAll('.proj-link').length");
  results.confidentialBadges = await evaluate("document.querySelectorAll('.proj-badge-muted').length");
  results.detailNotes = await evaluate("document.querySelectorAll('.detail-note').length");

  // --- Nav toggle behaviour ---
  results.navOpenBefore = await evaluate("document.querySelector('.nav-links').classList.contains('open')");
  await evaluate("document.querySelector('.nav-toggle').click()");
  await sleep(300);
  results.navOpenAfter = await evaluate("document.querySelector('.nav-links').classList.contains('open')");
  results.navAriaAfter = await evaluate("document.querySelector('.nav-toggle').getAttribute('aria-expanded')");

  // --- Clicking a nav link closes the menu and scrolls ---
  await evaluate("document.querySelectorAll('.nav-links a')[3].click()");
  await sleep(1200);
  results.navOpenAfterLinkClick = await evaluate("document.querySelector('.nav-links').classList.contains('open')");
  results.scrolled = await evaluate("window.scrollY > 0");

  // --- Keyboard: first Tab should land on the skip link ---
  await send('Page.navigate', { url: URL });
  await sleep(2500);
  await evaluate("window.scrollTo(0,0);");
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await sleep(400);
  results.firstTabTarget = await evaluate("(document.activeElement?.className||'') + '|' + (document.activeElement?.textContent||'').trim()");
  results.skipLinkReachable = await evaluate("document.activeElement?.classList.contains('skip-link')");
  results.skipLinkVisibleOnFocus = await evaluate("document.activeElement ? getComputedStyle(document.activeElement).left : 'n/a'");
  // Tab again should reach the nav logo
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await sleep(300);
  results.secondTabTarget = await evaluate("(document.activeElement?.className||'') + '|' + (document.activeElement?.textContent||'').trim().replace(/\\n/g,'')");
  // Shift+Tab should return to the skip link
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9, modifiers: 8 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9, modifiers: 8 });
  await sleep(300);
  results.shiftTabTarget = await evaluate("(document.activeElement?.className||'') + '|' + (document.activeElement?.textContent||'').trim()");
  // Enter on the project toggle should expand it (buttons activate on Enter keydown)
  await evaluate("document.querySelectorAll('.proj-toggle')[0].focus();");
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
  await sleep(500);
  results.keyboardExpanded = await evaluate("document.querySelectorAll('.proj-detail').length");
  results.keyboardExpandedAria = await evaluate("document.querySelectorAll('.proj-toggle')[0].getAttribute('aria-expanded')");
  // Space should collapse it again
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', text: ' ', unmodifiedText: ' ', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await sleep(400);
  results.keyboardCollapsed = await evaluate("document.querySelectorAll('.proj-detail').length");
  // Space again should re-expand it (leave a card open for the layout measurements)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', text: ' ', unmodifiedText: ' ', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await sleep(400);
  results.detailCountForLayout = await evaluate("document.querySelectorAll('.proj-detail').length");

  // --- Desktop viewport (1440) ---
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(700);
  results.desktopInnerWidth = await evaluate('window.innerWidth');
  results.desktopLinksDisplay = await evaluate("getComputedStyle(document.querySelector('.nav-links')).display");
  results.desktopToggleDisplay = await evaluate("getComputedStyle(document.querySelector('.nav-toggle')).display");
  results.desktopOverflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
  results.desktopMediaMatches768 = await evaluate("window.matchMedia('(max-width: 768px)').matches");
  results.desktopExpandedGridCol = await evaluate("getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnStart + '/' + getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnEnd");
  results.desktopProjGridCols = await evaluate("getComputedStyle(document.querySelector('.projects-grid')).gridTemplateColumns");
  results.desktopHeroBtnWidth = await evaluate("document.querySelector('.btn-primary').getBoundingClientRect().width.toFixed(0)");
  results.desktopExpandedWidth = await evaluate("document.querySelector('.proj-card.expanded').getBoundingClientRect().width.toFixed(0)");
  results.desktopSkillsCols = await evaluate("getComputedStyle(document.querySelector('.skills-grid')).gridTemplateColumns");

  // --- Mobile viewport (390) ---
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(800);
  results.mobileInnerWidth = await evaluate('window.innerWidth');
  results.mobileToggleDisplay = await evaluate("getComputedStyle(document.querySelector('.nav-toggle')).display");
  results.mobileLinksDisplay = await evaluate("getComputedStyle(document.querySelector('.nav-links')).display");
  await evaluate("document.querySelector('.nav-toggle').click()");
  await sleep(400);
  results.mobileLinksOpenDisplay = await evaluate("getComputedStyle(document.querySelector('.nav-links')).display");
  results.mobileNavOpenClass = await evaluate("document.querySelector('.nav-links').classList.contains('open')");
  results.mobileOverflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
  results.mobileProjGridCols = await evaluate("getComputedStyle(document.querySelector('.projects-grid')).gridTemplateColumns");
  results.mobileExpandedGridCol = await evaluate("getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnStart + '/' + getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnEnd");
  results.mobileExpandedWidth = await evaluate("document.querySelector('.proj-card.expanded').getBoundingClientRect().width.toFixed(0)");
  results.mobileNavLinksVisible = await evaluate("document.querySelector('.nav-links a').getBoundingClientRect().width > 0");
  await evaluate("document.querySelector('.nav-toggle').click()");
  await sleep(300);
  results.mobileNavClosed = await evaluate("!document.querySelector('.nav-links').classList.contains('open')");

  // --- Small mobile (360) ---
  await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 2, mobile: true });
  await sleep(700);
  results.smallMobileOverflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
  results.smallMobileHeroBtnWidth = await evaluate("document.querySelector('.btn-primary').getBoundingClientRect().width.toFixed(0)");
  results.smallMobileHeroBtnHeight = await evaluate("document.querySelector('.btn-primary').getBoundingClientRect().height.toFixed(0)");
  results.smallMobileContactLinkWidth = await evaluate("document.querySelector('.contact-link').getBoundingClientRect().width.toFixed(0)");
  results.smallMobileFooterPad = await evaluate("getComputedStyle(document.querySelector('footer')).paddingLeft");

  // --- Tablet (820) ---
  await send('Emulation.setDeviceMetricsOverride', { width: 820, height: 1180, deviceScaleFactor: 2, mobile: true });
  await sleep(700);
  results.tabletInnerWidth = await evaluate('window.innerWidth');
  results.tabletOverflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
  results.tabletExpandedGridCol = await evaluate("getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnStart + '/' + getComputedStyle(document.querySelector('.proj-card.expanded')).gridColumnEnd");
  results.tabletProjGridCols = await evaluate("getComputedStyle(document.querySelector('.projects-grid')).gridTemplateColumns");
  results.tabletNavToggleDisplay = await evaluate("getComputedStyle(document.querySelector('.nav-toggle')).display");

  await send('Emulation.clearDeviceMetricsOverride');
  await sleep(400);

  // ---- Screenshots (visual verification) ----
  const shotDir = path.join(__dirname, 'shots');
  fs.mkdirSync(shotDir, { recursive: true });
  const shoot = async (name) => {
    const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(shotDir, name + '.png'), Buffer.from(r.data, 'base64'));
  };
  const setViewport = async (width, height, mobile) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: !!mobile });
    await sleep(400);
  };
  await setViewport(1440, 1000, false);
  await evaluate("window.scrollTo(0,0)");
  await sleep(300);
  await shoot('desktop-hero');
  await evaluate("document.querySelector('#projects').scrollIntoView()");
  await sleep(500);
  await shoot('desktop-projects');
  await setViewport(390, 844, true);
  await evaluate("window.scrollTo(0,0)");
  await sleep(400);
  await shoot('mobile-hero');
  await evaluate("document.querySelector('.nav-toggle')?.click()");
  await sleep(400);
  await shoot('mobile-nav-open');
  await evaluate("document.querySelector('.nav-toggle')?.click()");
  await evaluate("document.querySelector('#projects').scrollIntoView()");
  await sleep(500);
  await shoot('mobile-projects');

  // ---- Overflow audit (catch clipped content hidden by body overflow-x) ----
  const auditOverflow = async () => {
    return await evaluate(`(() => {
      const vw = document.documentElement.clientWidth;
      const out = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (el.classList.contains('skip-link')) return; // intentionally off-screen until focused
        if (r.right > vw + 1 || r.left < -1) {
          out.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className && el.className.toString ? el.className.toString() : '').slice(0, 60),
            left: Math.round(r.left), right: Math.round(r.right), vw
          });
        }
      });
      return out.slice(0, 25);
    })()`);
  };
  await setViewport(390, 844, true);
  await sleep(500);
  results.mobileOverflowingElements = await auditOverflow();
  results.mobileH1Width = await evaluate("Math.round(document.querySelector('#hero h1').getBoundingClientRect().width)");
  results.mobileH1FontSize = await evaluate("getComputedStyle(document.querySelector('#hero h1')).fontSize");
  results.mobileH1ScrollWidth = await evaluate("document.querySelector('#hero h1').scrollWidth");
  results.mobileHeroContentWidth = await evaluate("Math.round(document.querySelector('#hero').clientWidth - 48)");
  results.mobileNavPanelBg = await evaluate("getComputedStyle(document.querySelector('.nav-links')).backgroundColor");

  // Small mobile (360) overflow audit
  await setViewport(360, 780, true);
  await sleep(500);
  results.smallMobileOverflowingElements = await auditOverflow();
  results.smallMobileH1ScrollWidth = await evaluate("document.querySelector('#hero h1').scrollWidth");
  results.smallMobileH1FontSize = await evaluate("getComputedStyle(document.querySelector('#hero h1')).fontSize");
  results.smallMobileContentWidth = await evaluate("document.querySelector('#hero').clientWidth - 48");

  // Expanded project detail audit (mobile)
  await setViewport(390, 844, true);
  await sleep(300);
  await evaluate("document.querySelector('#projects').scrollIntoView()");
  await sleep(300);
  // Collapse everything first so the state is deterministic
  await evaluate(`(() => {
    document.querySelectorAll('.proj-toggle[aria-expanded="true"]').forEach((b) => b.click());
  })()`);
  await sleep(500);
  results.expandedBeforeCount = await evaluate("document.querySelectorAll('.proj-detail').length");
  await evaluate("document.querySelectorAll('.proj-toggle')[0].click()");
  await sleep(700);
  results.expandedMobileOverflowingElements = await auditOverflow();
  results.expandedMobileDetailCount = await evaluate("document.querySelectorAll('.proj-detail').length");
  await evaluate("document.querySelector('.proj-detail').scrollIntoView({block:'start'})");
  await sleep(400);
  await shoot('mobile-project-expanded');
  await evaluate("document.querySelectorAll('.proj-toggle[aria-expanded=\"true\"]').forEach((b) => b.click())");
  await sleep(300);

  console.log(JSON.stringify({ results, consoleErrors }, null, 2));
  chrome.kill();
  process.exit(0);
})().catch((err) => {
  console.error('FATAL', err.message || err);
  try { console.error('PARTIAL RESULTS', JSON.stringify({ results, consoleErrors }, null, 2)); } catch (_) { /* ignore */ }
  chrome.kill();
  process.exit(1);
});



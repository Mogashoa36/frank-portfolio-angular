import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SkillCard {
  icon: string;
  title: string;
  tags: { label: string; highlight?: boolean }[];
}

export interface Experience {
  dates: string;
  current?: boolean;
  role: string;
  company: string;
  bullets: string[];
  /** Optional short descriptor of the work context, shown under the company name. */
  context?: string;
  /** Optional stack highlights for the role. */
  stack?: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  role: string;
  date: string;
  featured?: boolean;
  description: string;
  tech: string[];
<<<<<<< HEAD
  link?: string;
=======

  /* Optional detail fields. Existing data (and the card layout) stays valid
     when these are absent — rendering is driven by presence, not by a flag. */
  client?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  contribution?: string[];
  features?: string[];
  architecture?: string[];
  results?: string[];
  links?: ProjectLink[];
  confidential?: boolean;
>>>>>>> b3f7fcd89a040c4b128083418e601c864d1f16fd
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  navScrolled = false;
  /** Mobile navigation drawer open/closed state. */
  navOpen = false;
  /** Index of the project whose detail panel is expanded (-1 = all collapsed). */
  expandedProject = -1;

  @HostListener('window:scroll')
  onScroll() {
    this.navScrolled = window.scrollY > 40;
    this.checkReveal();
  }

  ngAfterViewInit() {
    this.checkReveal();
  }

  checkReveal() {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    // Stagger only within the batch that is currently entering the viewport,
    // so late sections never wait on a global index.
    let batchIndex = 0;
    elements.forEach((el) => {
      if (el.classList.contains('visible') || el.classList.contains('reveal-pending')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('reveal-pending');
        const delay = Math.min(batchIndex, 4) * 80;
        batchIndex++;
        setTimeout(() => {
          el.classList.add('visible');
          el.classList.remove('reveal-pending');
        }, delay);
      }
    });
  }

  scrollTo(id: string) {
    this.navOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  /** Expands the clicked project detail and collapses any other open panel. */
  toggleProject(index: number) {
    this.expandedProject = this.expandedProject === index ? -1 : index;
  }

  /** True when the project carries detail content that the card can expand into. */
  hasDetail(project: Project): boolean {
    return !!(
      project.overview ||
      project.problem ||
      project.solution ||
      project.contribution?.length ||
      project.features?.length ||
      project.architecture?.length ||
      project.results?.length
    );
  }

  skills: SkillCard[] = [
<<<<<<< HEAD
    { icon: '💻', title: 'Languages', tags: [
      { label: 'Java (8/17)', highlight: true }, { label: 'JavaScript' },
      { label: 'TypeScript', highlight: true }, { label: 'SQL' }, { label: 'C++' }, { label: 'C#' }
    ] },
    { icon: '⚙️', title: 'Backend', tags: [
      { label: 'Spring Boot', highlight: true }, { label: 'Spring Data JPA' }, { label: 'Hibernate' },
      { label: 'Spring Security' }, { label: 'RESTful APIs' }, { label: 'Microservices' },
      { label: 'JWT Authentication' }, { label: 'LDAP' }, { label: 'Active Directory (AD)' },
      { label: 'Node.js' }, { label: 'Express.js' }
    ] },
    { icon: '🎨', title: 'Frontend', tags: [
      { label: 'Angular', highlight: true }, { label: 'React.js' }, { label: 'HTML5' },
      { label: 'CSS3' }, { label: 'Angular Material' }
    ] },
    { icon: '🗄️', title: 'Databases', tags: [
      { label: 'PostgreSQL', highlight: true }, { label: 'Oracle' }, { label: 'MongoDB' },
      { label: 'MySQL' }, { label: 'Database Design' }, { label: 'Query Optimization' }
    ] },
    { icon: '☁️', title: 'Cloud & DevOps', tags: [
      { label: 'AWS (EC2, S3, Amplify)', highlight: true }, { label: 'CI/CD' },
      { label: 'Apache Tomcat' }, { label: 'WildFly' }, { label: 'Netlify' }
    ] },
    { icon: '✅', title: 'Testing', tags: [
      { label: 'Unit Testing' }, { label: 'Integration Testing' }, { label: 'User Acceptance Testing (UAT)' }
    ] },
    { icon: '🛠️', title: 'Tools', tags: [
      { label: 'Git' }, { label: 'GitHub' }, { label: 'IntelliJ IDEA' }, { label: 'Visual Studio Code' },
      { label: 'Visual Studio' }, { label: 'Postman' }, { label: 'Figma' }
    ] },
    { icon: '📐', title: 'Software Engineering', tags: [
      { label: 'OOP' }, { label: 'SDLC' }, { label: 'Agile (Scrum)' }, { label: 'API Integration' },
      { label: 'Performance Optimization' }, { label: 'Code Refactoring' }, { label: 'Debugging' },
      { label: 'Code Reviews' }
    ] }
  ];

  experiences: Experience[] = [
    { dates: '03/2026 — 05/2026', current: true, role: 'Junior Full-Stack Developer', company: 'Droppa', bullets: [
      'Developed and maintained Java (8/17) Spring Boot microservices supporting core courier and logistics operations, including order management and real-time driver tracking.',
      'Designed and implemented RESTful APIs integrating internal platforms with third-party services, improving system interoperability and API performance.',
      'Built responsive Angular and TypeScript user interfaces, integrating frontend applications with backend services to deliver seamless user experiences.',
      'Designed, optimized, and maintained MongoDB data models, improving query performance, data integrity, and application scalability.',
      'Deployed and supported cloud-hosted applications on AWS (EC2, S3, Amplify), contributing to CI/CD pipelines, production releases, and Agile software delivery.'
    ] },
    { dates: '05/2024 — 02/2026', role: 'Junior Developer', company: 'Department of Public Works and Infrastructure (DPWI)', bullets: [
      'Developed and maintained enterprise applications, including the Audit Tracking System and WorxTrack, delivering new features, performance improvements, and production support for systems used across all 9 South African regions.',
      'Designed and developed WorxTrack, a procurement lifecycle management system using Java (Spring Boot), Angular, PostgreSQL, and Oracle, supporting procurement initiation, approval, and award workflows.',
      'Designed and implemented the Audit Tracking System, replacing a paper-based compliance process with a digital platform featuring workflow automation, dashboards, audit trails, and reporting.',
      'Implemented secure authentication and role-based authorization using Spring Security, LDAP, Active Directory (AD), and JWT across multiple backend services and Angular applications.',
      'Improved application performance through code refactoring, database query optimization, code reviews, and production issue resolution, while managing deployments, feature releases, and UAT.',
      'Collaborated with product owners, business analysts, and stakeholders throughout the SDLC to deliver scalable enterprise solutions and provide end-user training and post-production support.'
    ] },
    { dates: '06/2023 — 04/2024', role: 'Intern Software Developer', company: 'Informatics Community Engagement Project (ICEP)', bullets: [
      'Developed and maintained responsive web applications using React.js, Node.js, and Express.js, implementing frontend and backend features to meet project requirements.',
      'Designed and implemented MySQL database schemas, ensuring efficient data storage, integrity, and query performance.',
      'Built, tested, and documented application features throughout the SDLC, contributing to reliable and maintainable software.',
      'Diagnosed and resolved application defects through debugging and testing, improving system stability and user experience.',
      'Collaborated within Agile (Scrum) teams, participating in sprint planning, daily stand-ups, sprint reviews, and retrospectives while using Git for version control.'
    ] }
  ];

  projects: Project[] = [
    // { featured: true, title: 'Droppa Business Portal', role: 'Full-Stack Developer', date: '03/2026', description: 'Scalable logistics management platform enabling businesses to streamline delivery operations through a centralized dashboard. Developed order management and delivery tracking workflows, improving operational efficiency through automated delivery coordination.', tech: ['Java 8', 'Angular', 'MongoDB', 'AWS', 'REST APIs'], link: 'https://www.droppa.co.za' },
     { featured: true, title: 'Audit Tracking System', role: 'Lead Developer', date: '12/2024', description: 'Transformed a paper-based audit compliance process into a real-time digital platform serving 9+ government regions. Architected end-to-end workflow with dynamic task assignment, multi-level escalation logic, and auditor conclusion workflows. Built real-time compliance dashboards and full audit-trail logging, reducing manual reconciliation by 90%+ and audit resolution time from weeks to days. Led the system from design through production rollout, conducting UAT and multi-region training across all 9 regions.', tech: ['Java (Spring Boot)', 'Angular', 'Oracle (Prod)', 'PostgreSQL (Test)', 'REST APIs', 'JWT Authentication'], link: 'https://worxstation.dpw.gov.za/Audit-Tracking' },
    { title: 'WorxTrack', role: 'Full-Stack Developer', date: '07/2024', description: 'Enterprise procurement lifecycle management system for government purchasing operations. Designed a complex procurement request lifecycle (initiation → approval → award) with dynamic approval routing based on purchase amount and department, enabling parallel approvals and reducing bottlenecks. Built a centralized procurement dashboard and reporting suite, reducing processing delays by 40%+ and improving budget transparency across departments.', tech: ['Java (Spring Boot)', 'Angular', 'Oracle (Prod)', 'PostgreSQL (Test)', 'REST APIs', 'Hibernate'], link: 'https://worxstation.dpw.gov.za/worxtrack' }
=======
    {
      icon: '☕', title: 'Languages',
      tags: [
        { label: 'Java 8', highlight: true }, { label: 'Java 17', highlight: true },
        { label: 'TypeScript', highlight: true }, { label: 'JavaScript ES6+', highlight: false },
        { label: 'SQL', highlight: false }, { label: 'HTML5', highlight: false },
        { label: 'CSS3', highlight: false }
      ]
    },
    {
      icon: '⚙️', title: 'Backend Development',
      tags: [
        { label: 'Spring Boot', highlight: true }, { label: 'REST APIs', highlight: true },
        { label: 'Spring Data JPA', highlight: true }, { label: 'Hibernate', highlight: false },
        { label: 'Microservices', highlight: false }, { label: 'Node.js', highlight: false },
        { label: 'Express', highlight: false }
      ]
    },
    {
      icon: '🖥️', title: 'Frontend Development',
      tags: [
        { label: 'Angular', highlight: true }, { label: 'TypeScript', highlight: true },
        { label: 'React.js', highlight: false }, { label: 'Angular Material', highlight: false },
        { label: 'Responsive Design', highlight: false }
      ]
    },
    {
      icon: '🗄️', title: 'Databases',
      tags: [
        { label: 'PostgreSQL', highlight: true }, { label: 'Oracle', highlight: true },
        { label: 'MongoDB', highlight: false }, { label: 'MySQL', highlight: false },
        { label: 'Query Optimisation', highlight: false }
      ]
    },
    {
      icon: '☁️', title: 'Cloud & DevOps',
      tags: [
        { label: 'AWS EC2', highlight: true }, { label: 'AWS S3', highlight: true },
        { label: 'CI/CD Pipelines', highlight: true }, { label: 'AWS Amplify', highlight: false },
        { label: 'Application Deployment', highlight: false },
        { label: 'Apache Tomcat', highlight: false }
      ]
    },
    {
      icon: '🔐', title: 'Security & Integration',
      tags: [
        { label: 'Spring Security', highlight: true }, { label: 'JWT', highlight: true },
        { label: 'LDAP', highlight: true }, { label: 'Active Directory', highlight: true },
        { label: 'API Integration', highlight: false }
      ]
    },
    {
      icon: '🧪', title: 'Testing & Dev Tools',
      tags: [
        { label: 'Unit Testing', highlight: false }, { label: 'Integration Testing', highlight: false },
        { label: 'UAT', highlight: false }, { label: 'Postman', highlight: false },
        { label: 'Git / GitHub', highlight: false }, { label: 'IntelliJ IDEA', highlight: false },
        { label: 'Figma', highlight: false }, { label: 'Agile / Scrum', highlight: false },
        { label: 'AI-Assisted Development', highlight: false }
      ]
    }
  ];

  experiences: Experience[] = [
    {
      dates: 'Mar 2026 — May 2026', current: false,
      role: 'Junior Full-Stack Developer', company: 'Droppa',
      context: 'Private sector — logistics technology',
      stack: ['Java 8 / 17', 'Spring Boot', 'Angular', 'MongoDB', 'AWS', 'CI/CD'],
      bullets: [
        'Built and maintained Spring Boot backend services supporting courier and logistics operations, exposing REST APIs consumed by the customer, driver and administration portals.',
        'Developed Angular interfaces with responsive layouts and seamless integration against those REST APIs.',
        'Implemented delivery tracking, order management and driver workflow features across the applications.',
        'Worked with MongoDB to model shipment, customer and order data for the logistics domain.',
        'Supported application deployment on AWS and contributed to the CI/CD pipeline that automated build and release steps.'
      ]
    },
    {
      dates: 'May 2024 — Feb 2026', current: false,
      role: 'Junior Developer', company: 'Department of Public Works and Infrastructure (DPWI)',
      context: 'Public sector — enterprise application delivery',
      stack: ['Java 17', 'Spring Boot', 'Angular', 'Oracle', 'PostgreSQL', 'JWT', 'LDAP / AD'],
      bullets: [
        'Developed and maintained enterprise full-stack web applications using Java Spring Boot services and Angular interfaces.',
        'Designed, implemented and consumed REST APIs and integrated them with relational databases using Spring Data JPA and Hibernate.',
        'Implemented role-based access control with Spring Security and JWT, and integrated directory authentication through LDAP and Active Directory.',
        'Partnered with product owners and business analysts to translate requirements into working functionality, and collaborated in Agile ceremonies.',
        'Led UAT sessions, coordinated production deployments, supported production systems and handled defect resolution.',
        'Delivered end-user training across multiple regions to support adoption of the deployed systems.'
      ]
    },
    {
      dates: 'Jun 2023 — Apr 2024', current: false,
      role: 'Intern Software Developer', company: 'Informatics Community Engagement Project (ICEP)',
      context: 'Internship — collaborative learning platform',
      stack: ['React.js', 'Node.js', 'Express', 'MySQL', 'Figma'],
      bullets: [
        'Built dynamic web application features using React.js on the frontend and Node.js/Express on the backend.',
        'Designed MySQL schemas and implemented full-stack features end-to-end within a six-person team.',
        'Collaborated in Agile ceremonies including sprint planning, stand-ups and retrospectives.',
        'Used Figma to review and refine interface designs during development.'
      ]
    }
  ];

  projects: Project[] = [
    {
      title: 'Audit Tracking System',
      client: 'Department of Public Works and Infrastructure (DPWI)',
      role: 'Full-Stack Developer', date: '2024 — 2026',
      featured: true,
      confidential: true,
      description:
        'Digitised audit tracking and compliance workflow platform that replaced manual, paper-based follow-up with tracked tasks, escalations and reporting.',
      overview:
        'An enterprise web application used to manage the full lifecycle of audits — from initiation, through task assignment and escalation, to final resolution and reporting. The system supports audit and compliance staff across nine South African regions.',
      problem:
        'Audit follow-up was tracked manually, so status, ownership and escalations were difficult to maintain and reporting required manual consolidation across regions.',
      solution:
        'A centralised Spring Boot and Angular platform that records every audit, assigns tracked tasks against due dates, applies escalation rules when items are overdue, and produces status reporting from a complete audit trail.',
      contribution: [
        'Built the Spring Boot backend exposing REST APIs for audits, tasks, escalations, status transitions and reporting.',
        'Developed the Angular front end for audit lists, task assignment, escalation handling and status dashboards.',
        'Implemented authentication and authorisation with Spring Security, JWT and directory integration through LDAP and Active Directory.',
        'Persisted application data through Spring Data JPA and Hibernate against Oracle and PostgreSQL databases.',
        'Contributed to testing, UAT and production deployment, and supported the system after release.'
      ],
      features: [
        'Audit lifecycle tracking from initiation to resolution',
        'Task assignment with status tracking against due dates',
        'Escalation handling for overdue items',
        'Status and compliance reporting dashboards',
        'Immutable audit trail of changes and actions',
        'Role-based access with LDAP / Active Directory sign-in'
      ],
      architecture: [
        'Java 17 with Spring Boot for the REST API layer',
        'Angular with TypeScript for the client application',
        'Oracle and PostgreSQL accessed via Spring Data JPA / Hibernate',
        'Spring Security with JWT for stateless authentication',
        'LDAP / Active Directory for enterprise directory identity'
      ],
      results: [
        'Audit tracking and compliance follow-up handled in one system rather than manually.',
        'In use across nine South African regions, supporting consistent audit and compliance reporting.',
        'Task ownership, escalation and status became auditable through the recorded audit trail.'
      ],
      tech: ['Java 17', 'Spring Boot', 'Angular', 'Oracle', 'PostgreSQL', 'JWT', 'LDAP / AD']
    },
    {
      title: 'Droppa Logistics Applications',
      client: 'Droppa',
      role: 'Junior Full-Stack Developer', date: '2026',
      featured: true,
      confidential: true,
      description:
        'A suite of logistics applications — a customer and business portal, a driver application and an administration portal — covering order management, driver operations and delivery coordination.',
      overview:
        'A multi-application logistics platform where businesses manage delivery operations, drivers run their day-to-day routes, and administrators oversee the platform. I worked across the Java and Angular sides of the solution.',
      problem:
        'Logistics operations were fragmented: customer-side order management, driver-side operations and administration each needed a consistent view of delivery activity.',
      solution:
        'Separate but integrated Spring Boot services and Angular front ends backed by MongoDB, with deployment handled on AWS and releases driven through CI/CD pipelines.',
      contribution: [
        'Developed and maintained Spring Boot services and the REST APIs consumed by the Angular applications.',
        'Built Angular interface work for the customer/business portal and administration experiences.',
        'Implemented order management and driver workflow features end-to-end across backend and frontend.',
        'Worked with MongoDB to model shipment, customer and order data for the logistics domain.',
        'Supported deployment on AWS and contributed to the CI/CD pipeline used for build and release automation.'
      ],
      features: [
        'Customer and business portal for managing delivery operations',
        'Driver application supporting day-to-day delivery operations',
        'Administration portal for platform oversight',
        'Order management workflow across the portals',
        'Driver operations and delivery status handling',
        'CI/CD pipeline for automated build and release steps'
      ],
      architecture: [
        'Java 8 and Java 17 with Spring Boot',
        'Angular with TypeScript for the portal applications',
        'MongoDB for logistics domain documents',
        'REST APIs between backend services and front ends',
        'AWS hosting with CI/CD automation for deployment'
      ],
      results: [
        'Delivered working software across customer, driver and administration portals within a short engagement.',
        'Established a repeatable CI/CD path from commit through to AWS deployment.'
      ],
      tech: ['Java 8 / 17', 'Spring Boot', 'Angular', 'MongoDB', 'AWS', 'CI/CD']
    },
    {
      title: 'Media Collector / VideoVault',
      client: 'Personal project',
      role: 'Full-Stack Developer', date: 'Personal',
      featured: false,
      description:
        'A personal project for collecting, searching, categorising and organising online media and research material, including a companion browser extension.',
      overview:
        'A web application for gathering media and research material into a personal library that can be searched and categorised. A browser extension supports capturing material directly while browsing, and the Angular front end is backed by a Spring Boot API with PostgreSQL storage.',
      problem:
        'Online media and research material was scattered across tabs, bookmarks and folders, with no way to search or categorise it once collected.',
      solution:
        'A Spring Boot REST API with PostgreSQL storage, an Angular interface for searching and organising a personal library, and a browser extension that captures material into that library.',
      contribution: [
        'Designed and built the Spring Boot backend and its REST API for collection, categorisation and search.',
        'Built the Angular front end for browsing, searching and organising the library.',
        'Implemented PostgreSQL persistence and the data model for media and research items.',
        'Developed the browser extension that captures material into the collection.'
      ],
      features: [
        'Capture and collect media and research material',
        'Search across collected items',
        'Categorisation and organisation of the library',
        'Browser extension for capturing material while browsing',
        'Angular front end served by a Spring Boot REST API'
      ],
      architecture: [
        'Angular with TypeScript for the web client',
        'Spring Boot with REST APIs for the backend',
        'PostgreSQL for persistence',
        'Browser extension for in-browser capture'
      ],
      results: [
        'A working personal media and research library with search and categorisation.',
        'Browser extension shortening the path from finding material to having it organised.'
      ],
      tech: ['Angular', 'Spring Boot', 'PostgreSQL', 'REST APIs', 'Browser Extension']
    },
    {
      title: 'Business Automation Platform',
      client: 'Personal project',
      role: 'Full-Stack Developer', date: 'Personal',
      featured: false,
      description:
        'A personal software project focused on business workflows, application functionality and reusable backend architecture.',
      overview:
        'A self-directed application platform built to model common business processes as configurable workflows, with reusable Spring Boot backend components intended to be reused across projects.',
      problem:
        'Business workflow logic tends to be re-implemented per application, so the aim of this project was to build a reusable backend foundation rather than a one-off script.',
      solution:
        'A Spring Boot backend exposing REST APIs over a reusable workflow and application foundation, paired with front-end functionality that exercises those APIs.',
      contribution: [
        'Designed and implemented the reusable Spring Boot backend architecture and its REST APIs.',
        'Built the front-end application functionality that consumes those APIs.',
        'Structured the domain model so business workflows could be expressed without duplicating logic.',
        'Maintained the project as a self-directed study of clean, reusable backend design.'
      ],
      features: [
        'Reusable Spring Boot backend foundation',
        'REST APIs for business workflow operations',
        'Configurable workflow and application functionality',
        'Front-end interface consuming the backend APIs'
      ],
      architecture: [
        'Spring Boot backend with layered service and persistence structure',
        'REST APIs as the integration contract',
        'Front end built with the web technologies available in the repository'
      ],
      results: [
        'Established a reusable backend foundation rather than application-specific code.',
        'Provided a practical reference for structuring business workflow logic.'
      ],
      tech: ['Spring Boot', 'REST APIs', 'Java']
    },
    {
      title: 'Clevertouch',
      client: 'Informatics Community Engagement Project (ICEP)',
      role: 'Full-Stack Developer', date: '2023 — 2024',
      featured: false,
      description:
        'A collaborative digital lecture-notes system that let students share, organise and build on lecture material together.',
      overview:
        'A web application where students collaboratively capture and share lecture notes. I worked as a full-stack developer within a six-person team of two business analysts, two frontend developers and two full-stack developers.',
      problem:
        'Lecture notes were captured individually and inconsistently, with no straightforward way to share or build on what a class had captured.',
      solution:
        'A collaborative notes application with a React.js client, a Node.js/Express API and a MySQL data layer, with Figma designs used to guide the interface.',
      contribution: [
        'Implemented full-stack features end-to-end, covering both the React.js interface and the Node.js/Express backend.',
        'Designed MySQL schemas and wrote the queries and access logic behind the notes features.',
        'Built and integrated API endpoints between the React.js client and the Express server.',
        'Worked with the frontend developers and business analysts to shape and review the interface designs.'
      ],
      features: [
        'Collaborative capture and sharing of lecture notes',
        'Organisation of notes by course and lecture',
        'React.js client interface',
        'Node.js/Express API with MySQL persistence'
      ],
      architecture: [
        'React.js for the front end',
        'Node.js with Express for the REST API layer',
        'MySQL for relational persistence',
        'Figma for interface design and review'
      ],
      results: [
        'Delivered working collaborative notes functionality as part of a six-person team.',
        'Gained full-stack experience across a React.js, Node.js and MySQL stack.'
      ],
      tech: ['React.js', 'Node.js', 'Express', 'MySQL', 'Figma']
    },
    {
      title: 'WorxTrack',
      client: 'Department of Public Works and Infrastructure (DPWI)',
      role: 'Full-Stack Developer', date: '2024 — 2026',
      featured: false,
      confidential: true,
      description:
        'Procurement lifecycle management application tracking requests from initiation through approval to award, with routing logic and status tracking.',
      overview:
        'An enterprise application that manages procurement requests as they move through the approval lifecycle. Requests are raised, routed to the correct approvers based on the decision rules, tracked by status, and reported on centrally.',
      problem:
        'Procurement requests moved through approvals by manual handover, making it hard to see where a request was, who owned it and whether it was on track.',
      solution:
        'A Spring Boot and Angular application that models the procurement lifecycle, routes requests through approval steps and maintains live status with centralised reporting.',
      contribution: [
        'Built Spring Boot backend services and the REST APIs backing the procurement lifecycle.',
        'Developed Angular interfaces for request initiation, approval routing, status tracking and reporting.',
        'Implemented persistence through Spring Data JPA and Hibernate on PostgreSQL.',
        'Contributed to testing, UAT and production deployment of the application.'
      ],
      features: [
        'Procurement request initiation and tracking',
        'Approval routing logic across the lifecycle',
        'Status tracking for in-flight requests',
        'Centralised reporting dashboards'
      ],
      architecture: [
        'Java with Spring Boot for the REST API layer',
        'Angular with TypeScript for the client application',
        'PostgreSQL accessed through Spring Data JPA / Hibernate',
        'REST APIs between the Angular client and backend services'
      ],
      results: [
        'Procurement requests tracked from initiation through to award in one system.',
        'Approval status and ownership visible without manual follow-up.'
      ],
      tech: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'Hibernate', 'REST APIs']
    }
>>>>>>> b3f7fcd89a040c4b128083418e601c864d1f16fd
  ];

  /** Verified public contact and profile links. */
  readonly email = 'frankmogashoa3@gmail.com';
  readonly phone = '+27 82 844 7046';
  readonly phoneHref = 'tel:+27828447046';
  readonly linkedinUrl = 'https://linkedin.com/in/frank-mogashoa-18026a28a';
  readonly linkedinLabel = 'linkedin.com/in/frank-mogashoa-18026a28a';
  readonly githubUrl = 'https://github.com/Mogashoa36';
  readonly githubLabel = 'github.com/Mogashoa36';
  readonly location = 'Gauteng, South Africa';
  readonly education = 'National Diploma — IT: Software Development, Tshwane University of Technology (2024)';
}

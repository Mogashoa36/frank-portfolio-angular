import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
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
}

export interface Project {
  title: string;
  role: string;
  date: string;
  featured?: boolean;
  description: string;
  tech: string[];
  link?: string;
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

  @HostListener('window:scroll')
  onScroll() {
    this.navScrolled = window.scrollY > 40;
    this.checkReveal();
  }

  ngAfterViewInit() {
    this.checkReveal();
  }

  checkReveal() {
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        setTimeout(() => el.classList.add('visible'), i * 80);
      }
    });
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  skills: SkillCard[] = [
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
  ];
}

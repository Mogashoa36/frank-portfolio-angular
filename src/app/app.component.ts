import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SkillCard {
  icon: string;
  title: string;
  tags: { label: string; highlight: boolean }[];
}

export interface Experience {
  dates: string;
  current: boolean;
  role: string;
  company: string;
  bullets: string[];
}

export interface Project {
  title: string;
  role: string;
  date: string;
  featured: boolean;
  description: string;
  tech: string[];
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
    {
      icon: '⚙️', title: 'Backend',
      tags: [
        { label: 'Java', highlight: true }, { label: 'Spring Boot', highlight: true },
        { label: 'Java EE', highlight: true }, { label: 'Node.js', highlight: false },
        { label: 'Express', highlight: false }, { label: 'REST APIs', highlight: false },
        { label: 'Microservices', highlight: false }, { label: 'C++', highlight: false }
      ]
    },
    {
      icon: '🖥️', title: 'Frontend',
      tags: [
        { label: 'Angular', highlight: true }, { label: 'TypeScript', highlight: true },
        { label: 'React.js', highlight: false }, { label: 'JavaScript ES6+', highlight: false },
        { label: 'HTML5', highlight: false }, { label: 'CSS3', highlight: false },
        { label: 'Angular Material', highlight: false }
      ]
    },
    {
      icon: '🗄️', title: 'Databases',
      tags: [
        { label: 'PostgreSQL', highlight: true }, { label: 'MongoDB', highlight: true },
        { label: 'Oracle', highlight: false }, { label: 'MySQL', highlight: false },
        { label: 'Hibernate', highlight: false }
      ]
    },
    {
      icon: '☁️', title: 'Cloud & DevOps',
      tags: [
        { label: 'AWS EC2', highlight: true }, { label: 'AWS S3', highlight: true },
        { label: 'AWS Amplify', highlight: false }, { label: 'CI/CD Pipelines', highlight: false },
        { label: 'Apache Tomcat', highlight: false }, { label: 'JBoss', highlight: false },
        { label: 'Payara', highlight: false }
      ]
    },
    {
      icon: '🧪', title: 'Testing & QA',
      tags: [
        { label: 'Unit Testing', highlight: false }, { label: 'Integration Testing', highlight: false },
        { label: 'UAT', highlight: false }, { label: 'Test Case Design', highlight: false },
        { label: 'Postman', highlight: false }
      ]
    },
    {
      icon: '🛠️', title: 'Dev Tools',
      tags: [
        { label: 'Git / GitHub', highlight: true }, { label: 'IntelliJ IDEA', highlight: false },
        { label: 'VS Code', highlight: false }, { label: 'Figma', highlight: false },
        { label: 'Agile / Scrum', highlight: false }, { label: 'SDLC', highlight: false }
      ]
    }
  ];

  experiences: Experience[] = [
    {
      dates: 'Mar 2026 — Present', current: true,
      role: 'Junior Full-Stack Developer', company: 'Droppa',
      bullets: [
        'Build and maintain Java Spring Boot microservices powering courier and logistics operations.',
        'Develop responsive Angular frontends with seamless REST API integration.',
        'Implement real-time delivery tracking, route optimisation, and distance calculation features.',
        'Manage MongoDB data pipelines for shipment and customer records.',
        'Deploy and configure applications on AWS (EC2, S3, Amplify) with CI/CD pipelines.'
      ]
    },
    {
      dates: 'Apr 2024 — Mar 2026', current: false,
      role: 'Junior Developer', company: 'Dept. of Public Works & Infrastructure (DPWI)',
      bullets: [
        'Developed and maintained enterprise full-stack applications using Angular and Java Spring Boot.',
        'Collaborated with product owners and business analysts to deliver scalable technical solutions.',
        'Led UAT sessions, coordinated production deployments, and managed bug fixes.',
        'Delivered end-user training across multiple regions, improving system adoption.'
      ]
    },
    {
      dates: 'Feb 2024 — Apr 2024', current: false,
      role: 'Intern Software Developer', company: 'Informatics Community Engagement Project (ICEP)',
      bullets: [
        'Built dynamic web applications using React.js and Node.js/Express.',
        'Designed MySQL schemas and implemented full-stack features end-to-end.',
        'Participated in Agile ceremonies: sprint planning, stand-ups, retrospectives.'
      ]
    }
  ];

  projects: Project[] = [
    {
      title: 'Droppa Business Portal', role: 'Full-Stack Developer', date: '2026',
      featured: true,
      description: 'Scalable logistics management platform enabling businesses to manage delivery operations through a centralised dashboard. Includes order workflows, real-time tracking, and automated delivery coordination.',
      tech: ['Java Spring Boot', 'Angular', 'MongoDB', 'REST APIs', 'AWS']
    },
         {
           title: 'Skynet Delivery App', role: 'Backend Developer', date: '2026',
           featured: false,
           description: 'Courier management application for delivery drivers with route optimisation, navigation, and proof-of-delivery capture via signature and image upload.',
           tech: ['Core Java', 'MongoDB', 'REST APIs', 'Google Maps API']
         }
    {
      title: 'Audit Tracking System', role: 'Lead Developer', date: '2026',
      featured: false,
      description: 'Centralised audit management system for tracking COAFs and RFIs from initiation to resolution. Features real-time dashboards, task assignment, escalation logic, and JWT-secured audit trails.',
      tech: ['Spring Boot', 'Angular', 'PostgreSQL', 'Chart.js', 'JWT']
    },
    {
      title: 'Worxtrack', role: 'Full-Stack Developer', date: '2024',
      featured: false,
      description: 'Enterprise procurement lifecycle management system tracking requests from initiation through approval to award, with routing logic, status tracking, and centralised reporting dashboards.',
      tech: ['Spring Boot', 'Angular', 'PostgreSQL', 'Hibernate', 'REST APIs']
    }
  ];
}

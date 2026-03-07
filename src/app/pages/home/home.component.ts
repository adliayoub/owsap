import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationId = 0;

  stats = [
    { value: 50, suffix: '+', label: 'Security Checks' },
    { value: '10', suffix: 'K+', label: 'Repos Scanned' },
    { value: '99.9', suffix: '%', label: 'Uptime' },
    { value: 24, suffix: '/7', label: 'AI Analysis' },
  ];

  features = [
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'Static Analysis', description: 'Detect vulnerabilities in source code with advanced static analysis engines.', color: 'bg-blue-500' },
    { icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Dependency Scan', description: 'Identify outdated and vulnerable packages in your dependencies.', color: 'bg-purple-500' },
    { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Secret Detection', description: 'Find exposed API keys, passwords, and credentials before they reach production.', color: 'bg-red-500' },
    { icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', title: 'Configuration Review', description: 'Analyze security configurations and identify misconfigurations.', color: 'bg-green-500' },
  ];

  additionalFeatures = [
    { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'OWASP ASVS Mapping', description: 'Map detected vulnerabilities to specific OWASP ASVS requirements for comprehensive compliance tracking.', color: 'bg-emerald-500' },
    { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'AI-Powered Analysis', description: 'Leverage advanced AI to summarize findings, classify vulnerabilities, and generate secure code recommendations.', color: 'bg-amber-500' },
  ];

  githubFeatures = [
    'Support for public and private repositories',
    'Detailed vulnerability reports with severity levels',
    'AI-powered remediation suggestions',
    'OWASP ASVS compliance mapping',
  ];

  mockReport = [
    { label: 'SQL Injection detected', severity: 'Critical', dot: 'bg-red-500', badge: 'bg-red-500' },
    { label: 'Outdated dependency: lodash', severity: 'High', dot: 'bg-orange-500', badge: 'bg-orange-500' },
    { label: 'Missing security headers', severity: 'Medium', dot: 'bg-yellow-500', badge: 'bg-yellow-500' },
    { label: 'No hardcoded secrets found', severity: 'Pass', dot: 'bg-green-500', badge: 'bg-green-500' },
  ];

  ngAfterViewInit() {
    this.initParticles();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

  private initParticles() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const create = () => {
      particles.length = 0;
      const n = Math.min(50, Math.floor(window.innerWidth / 30));
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${p.opacity})`; ctx.fill();
        particles.slice(i + 1).forEach(o => {
          const d = Math.sqrt((p.x - o.x) ** 2 + (p.y - o.y) ** 2);
          if (d < 150) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(147,197,253,${0.1 * (1 - d / 150)})`; ctx.stroke();
          }
        });
      });
      this.animationId = requestAnimationFrame(draw);
    };

    resize(); create(); draw();
    window.addEventListener('resize', () => { resize(); create(); });
  }
}

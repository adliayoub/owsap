import { Component, inject, ElementRef, ViewChild, AfterViewInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('pieChart') pieRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineRef!: ElementRef<HTMLCanvasElement>;

  authService = inject(AuthService);
  ts = inject(TranslationService);
  private chartsReady = false;

  vulnData = computed(() => [
    { name: this.ts.t('dash.critical'), value: 2, color: '#ef4444' },
    { name: this.ts.t('dash.high'), value: 5, color: '#f97316' },
    { name: this.ts.t('dash.medium'), value: 12, color: '#eab308' },
    { name: this.ts.t('dash.low'), value: 8, color: '#22c55e' },
  ]);

  quickActions = computed(() => [
    { title: this.ts.t('dash.scanRepo'), description: this.ts.t('dash.newScan'), href: '/scanner', color: 'bg-blue-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: this.ts.t('dash.viewChecklist'), description: this.ts.t('dash.asvs'), href: '/checklist', color: 'bg-emerald-500', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: this.ts.t('dash.viewAllScans'), description: this.ts.t('dash.history'), href: '/history', color: 'bg-purple-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]);

  statCards = computed(() => [
    { title: this.ts.t('dash.totalScans'), value: 3, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: this.ts.t('dash.vulnerabilities'), value: 59, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { title: this.ts.t('dash.asvsCoverage'), value: '78%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { title: this.ts.t('dash.securedRepos'), value: 12, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ]);

  ngAfterViewInit() {
    if (typeof (window as any)['Chart'] !== 'undefined') {
      this.renderCharts();
    } else {
      const existing = document.querySelector('script[src*="chart.js"]');
      if (existing) {
        existing.addEventListener('load', () => this.renderCharts());
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
        script.onload = () => this.renderCharts();
        script.onerror = () => console.warn('Chart.js failed to load — charts will not display');
        document.head.appendChild(script);
      }
    }
  }

  private renderCharts() {
    if (this.chartsReady) return;
    this.chartsReady = true;
    const Chart = (window as any)['Chart'];
    const vd = this.vulnData();

    // Pie chart
    new Chart(this.pieRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: vd.map(d => d.name),
        datasets: [{ data: vd.map(d => d.value), backgroundColor: vd.map(d => d.color), borderWidth: 0, hoverOffset: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Bar chart
    new Chart(this.barRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Architecture', 'Auth', 'Session Mgmt', 'Access Ctrl', 'Input Valid'],
        datasets: [{ data: [85, 72, 90, 68, 78], backgroundColor: 'rgba(99, 102, 241, 0.8)', borderRadius: 4, label: 'Score' }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#888', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' }, max: 100 }
        }
      }
    });

    // Line chart
    new Chart(this.lineRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          data: [3, 5, 2, 8, 6, 4, 3], label: 'Scans',
          borderColor: 'rgba(99, 102, 241, 1)', backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true, tension: 0.4, pointBackgroundColor: 'rgba(99, 102, 241, 1)', pointRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

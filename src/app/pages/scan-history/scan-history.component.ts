import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScanHistoryItem } from '../../models';

const MOCK_HISTORY: ScanHistoryItem[] = [
  { id: 'scan-001', repository: 'ecommerce-platform', url: 'https://github.com/acme/ecommerce-platform', date: '2026-03-04', status: 'Completed', vulnerabilities: { critical: 2, high: 4, medium: 8, low: 3 }, asvsCoverage: 78 },
  { id: 'scan-002', repository: 'api-gateway', url: 'https://github.com/acme/api-gateway', date: '2026-03-03', status: 'Completed', vulnerabilities: { critical: 0, high: 2, medium: 5, low: 1 }, asvsCoverage: 85 },
  { id: 'scan-003', repository: 'user-service', url: 'https://github.com/acme/user-service', date: '2026-03-02', status: 'Completed', vulnerabilities: { critical: 1, high: 3, medium: 6, low: 2 }, asvsCoverage: 72 },
  { id: 'scan-004', repository: 'payment-processor', url: 'https://github.com/acme/payment-processor', date: '2026-03-01', status: 'Failed', vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 }, asvsCoverage: 0 },
  { id: 'scan-005', repository: 'notification-service', url: 'https://github.com/acme/notification-service', date: '2026-02-28', status: 'Completed', vulnerabilities: { critical: 0, high: 1, medium: 3, low: 0 }, asvsCoverage: 90 },
];

@Component({
  selector: 'app-scan-history',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './scan-history.component.html',
  styleUrls: ['./scan-history.component.css']
})
export class ScanHistoryComponent {
  scans = signal<ScanHistoryItem[]>(MOCK_HISTORY);
  searchQuery = signal('');
  statusFilter = signal('all');
  openMenu = signal<string | null>(null);

  filteredScans = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const filter = this.statusFilter();
    return this.scans().filter(s =>
      (s.repository.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)) &&
      (filter === 'all' || s.status.toLowerCase() === filter)
    );
  });

  stats = computed(() => {
    const s = this.scans();
    const completed = s.filter(x => x.status === 'Completed');
    return {
      total: s.length,
      completed: completed.length,
      failed: s.filter(x => x.status === 'Failed').length,
      avgCoverage: Math.round(completed.reduce((a, b) => a + b.asvsCoverage, 0) / (completed.length || 1)),
    };
  });

  getStatusClass(s: string) {
    const map: Record<string, string> = {
      Completed: 'bg-green-500/20 text-green-400',
      Failed: 'bg-destructive/20 text-destructive',
      'In Progress': 'bg-blue-500/20 text-blue-400',
    };
    return map[s] ?? 'bg-secondary text-secondary-foreground';
  }

  toggleMenu(id: string) {
    this.openMenu.update(v => v === id ? null : id);
  }

  deleteScan(id: string) {
    this.scans.update(s => s.filter(x => x.id !== id));
    this.openMenu.set(null);
  }
}

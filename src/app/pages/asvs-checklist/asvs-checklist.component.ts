import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ASVSRequirement, RequirementStatus } from '../../models';

const MOCK_REQUIREMENTS: ASVSRequirement[] = [
  { Area: 'Secure Software Development Lifecycle', '#': '1.1.1', 'ASVS Level': 2, CWE: '', NIST: '', 'Verification Requirement': 'Verify the use of a secure software development lifecycle that addresses security in all stages of development.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.2', 'ASVS Level': 2, CWE: 1053, NIST: '', 'Verification Requirement': 'Verify the use of threat modeling for every design change or sprint planning to identify threats.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Authentication Architecture', '#': '1.2.1', 'ASVS Level': 2, CWE: 250, NIST: '', 'Verification Requirement': 'Verify the use of unique or special low-privilege operating system accounts for all application components.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Authentication Architecture', '#': '1.2.2', 'ASVS Level': 2, CWE: 306, NIST: '', 'Verification Requirement': 'Verify that communications between application components, including APIs, middleware and data layers, are authenticated.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Access Control Architecture', '#': '1.4.1', 'ASVS Level': 2, CWE: 602, NIST: '', 'Verification Requirement': 'Verify that trusted enforcement points such as access control gateways, servers, and serverless functions enforce access controls.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Input and Output Architecture', '#': '1.5.1', 'ASVS Level': 2, CWE: 602, NIST: '', 'Verification Requirement': 'Verify that input and output requirements clearly define how to handle and process data based on type, content, and applicable laws.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Cryptographic Architecture', '#': '1.6.1', 'ASVS Level': 2, CWE: 310, NIST: '', 'Verification Requirement': 'Verify that there is an explicit policy for management of cryptographic keys following a key management standard.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Error Handling and Logging Architecture', '#': '1.7.1', 'ASVS Level': 2, CWE: 778, NIST: '', 'Verification Requirement': 'Verify that a common logging format and approach is used across the system.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Data Protection Architecture', '#': '1.8.1', 'ASVS Level': 2, CWE: 213, NIST: '', 'Verification Requirement': 'Verify that all sensitive data is identified and classified into protection levels.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Communications Architecture', '#': '1.9.1', 'ASVS Level': 2, CWE: 319, NIST: '', 'Verification Requirement': 'Verify the application encrypts communications between components, particularly when these components are in different containers, systems, sites, or cloud providers.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Malicious Software Architecture', '#': '1.10.1', 'ASVS Level': 2, CWE: 1177, NIST: '', 'Verification Requirement': 'Verify that a source code control system is in use, with procedures to ensure that check-ins are accompanied by issues or change tickets.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Business Logic Architecture', '#': '1.11.1', 'ASVS Level': 2, CWE: 841, NIST: '', 'Verification Requirement': 'Verify the definition and documentation of all application components in terms of the business or security functions they provide.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
];

@Component({
  selector: 'app-asvs-checklist',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asvs-checklist.component.html',
  styleUrls: ['./asvs-checklist.component.css']
})
export class AsvsChecklistComponent implements OnInit {
  private http = inject(HttpClient);

  requirements = signal<ASVSRequirement[]>([]);
  statuses = signal<Record<string, RequirementStatus>>({});

  // FIX: All filter state as signals so computed() reacts properly
  searchQuery = signal('');
  selectedArea = signal('all');
  selectedLevel = signal('all');
  currentPage = signal(1);

  showAIModal = signal(false);
  aiLoading = signal(false);
  selectedReq = signal<ASVSRequirement | null>(null);
  selectedLang = signal('JavaScript');
  langs = ['Java', 'Python', 'JavaScript'];

  readonly itemsPerPage = 10;

  areas = computed(() => {
    const s = new Set<string>();
    this.requirements().forEach(r => { if (r.Area) s.add(r.Area); });
    return Array.from(s);
  });

  filteredRequirements = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const area = this.selectedArea();
    const level = this.selectedLevel();
    return this.requirements().filter(req => {
      const matchSearch = req['Verification Requirement'].toLowerCase().includes(q) || req['#'].toLowerCase().includes(q);
      const matchArea = area === 'all' || req.Area === area;
      const matchLevel = level === 'all' || req['ASVS Level'] === parseInt(level);
      return matchSearch && matchArea && matchLevel;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRequirements().length / this.itemsPerPage)));

  paginatedRequirements = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredRequirements().slice(start, start + this.itemsPerPage);
  });

  progress = computed(() => {
    const total = this.filteredRequirements().length;
    if (!total) return { completed: 0, inProgress: 0, notStarted: 0, percentage: 0 };
    const vals = Object.values(this.statuses());
    const completed = vals.filter(s => s.status === 'Completed').length;
    const inProgress = vals.filter(s => s.status === 'In Progress').length;
    return { completed, inProgress, notStarted: total - completed - inProgress, percentage: Math.round((completed / total) * 100) };
  });

  codeExamples: Record<string, string> = {
    Java: `// Input Validation Example
public class InputValidator {
    public static boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(email).matches();
    }
    public static String sanitizeInput(String input) {
        return input.replaceAll("[<>\"']", "");
    }
}`,
    Python: `# Input Validation Example
import re
from html import escape

def is_valid_email(email):
    pattern = r'^[A-Za-z0-9+_.-]+@(.+)$'
    return re.match(pattern, email) is not None

def sanitize_input(user_input):
    return escape(user_input)`,
    JavaScript: `// Input Validation Example
function isValidEmail(email) {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}`,
  };

  codeExample = computed(() => this.codeExamples[this.selectedLang()] ?? '');

  ngOnInit() {
    this.http.get<any>('/asvs-data.json').subscribe({
      next: data => {
        const all: ASVSRequirement[] = [];
        Object.entries(data).forEach(([cat, items]) => {
          if (Array.isArray(items) && cat !== 'ASVS Results') all.push(...items as ASVSRequirement[]);
        });
        if (all.length > 0) this.requirements.set(all);
        else this.requirements.set(MOCK_REQUIREMENTS);
      },
      error: () => this.requirements.set(MOCK_REQUIREMENTS)
    });
  }

  onAreaChange(value: string) {
    this.selectedArea.set(value);
    this.currentPage.set(1); // reset pagination on filter change
  }

  updateStatus(id: string, status: RequirementStatus['status']) {
    this.statuses.update(s => ({ ...s, [id]: { id, status } }));
  }

  getCheckboxValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  openAIExplain(req: ASVSRequirement) {
    this.selectedReq.set(req);
    this.showAIModal.set(true);
    this.aiLoading.set(true);
    setTimeout(() => this.aiLoading.set(false), 1500);
  }

  prevPage() { this.currentPage.update(p => Math.max(1, p - 1)); }
  nextPage() { this.currentPage.update(p => Math.min(this.totalPages(), p + 1)); }

  exportData(format: 'json' | 'csv') {
    const data = this.filteredRequirements().map(req => ({
      ...req, status: this.statuses()[req['#']]?.status || 'Not Started'
    }));
    const content = format === 'json'
      ? JSON.stringify(data, null, 2)
      : ['ID,Area,Level,CWE,Requirement,Status', ...data.map(r => `${r['#']},${r.Area || ''},${r['ASVS Level']},${r.CWE},"${(r['Verification Requirement'] || '').replace(/"/g, '""')}",${(r as any).status}`)].join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `asvs-checklist.${format}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

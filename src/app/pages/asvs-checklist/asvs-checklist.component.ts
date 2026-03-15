import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ASVSRequirement, RequirementStatus } from '../../models';
import { TranslationService } from '../../services/translation.service';

export interface AreaGroup {
  area: string;
  color: string;
  bgColor: string;
  borderColor: string;
  requirements: ASVSRequirement[];
}

const ASVS_DATA: ASVSRequirement[] = [
  { Area: 'Secure Software Development Lifecycle', '#': '1.1.1', 'ASVS Level': 2, CWE: '', NIST: '', 'Verification Requirement': 'Verify the use of a secure software development lifecycle that addresses security in all stages of development. (C1)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.2', 'ASVS Level': 2, CWE: 1053, NIST: '', 'Verification Requirement': 'Verify the use of threat modeling for every design change or sprint planning to identify threats, plan for countermeasures, facilitate appropriate risk responses, and guide security testing.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.3', 'ASVS Level': 2, CWE: 1110, NIST: '', 'Verification Requirement': 'Verify that all user stories and features contain functional security constraints, such as "As a user, I should be able to view and edit my profile. I should not be able to view or edit anyone else\'s profile"', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.4', 'ASVS Level': 2, CWE: 1059, NIST: '', 'Verification Requirement': 'Verify documentation and justification of all the application\'s trust boundaries, components, and significant data flows.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.5', 'ASVS Level': 2, CWE: 1059, NIST: '', 'Verification Requirement': 'Verify definition and security analysis of the application\'s high-level architecture and all connected remote services. (C1)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.6', 'ASVS Level': 2, CWE: 637, NIST: '', 'Verification Requirement': 'Verify implementation of centralized, simple (economy of design), vetted, secure, and reusable security controls to avoid duplicate, missing, ineffective, or insecure controls. (C10)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.1.7', 'ASVS Level': 2, CWE: 637, NIST: '', 'Verification Requirement': 'Verify availability of a secure coding checklist, security requirements, guideline, or policy to all developers and testers.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Authentication Architecture', '#': '1.2.1', 'ASVS Level': 2, CWE: 250, NIST: '', 'Verification Requirement': 'Verify the use of unique or special low-privilege operating system accounts for all application components, services, and servers. (C3)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.2.2', 'ASVS Level': 2, CWE: 306, NIST: '', 'Verification Requirement': 'Verify that communications between application components, including APIs, middleware and data layers, are authenticated. Components should have the least necessary privileges needed. (C3)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.2.3', 'ASVS Level': 2, CWE: 306, NIST: '', 'Verification Requirement': 'Verify that the application uses a single vetted authentication mechanism that is known to be secure, can be extended to include strong authentication, and has sufficient logging and monitoring to detect account abuse or breaches.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.2.4', 'ASVS Level': 2, CWE: 306, NIST: '', 'Verification Requirement': 'Verify that all authentication pathways and identity management APIs implement consistent authentication security control strength, such that there are no weaker alternatives per the risk of the application.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Access Control Architecture', '#': '1.4.1', 'ASVS Level': 2, CWE: 602, NIST: '', 'Verification Requirement': 'Verify that trusted enforcement points such as at access control gateways, servers, and serverless functions enforce access controls. Never enforce access controls on the client.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.4.2', 'ASVS Level': 2, CWE: 284, NIST: '', 'Verification Requirement': '[DELETED, NOT ACTIONABLE]', Valid: 'Not Applicable', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.4.3', 'ASVS Level': 2, CWE: 272, NIST: '', 'Verification Requirement': '[DELETED, DUPLICATE OF 4.1.3]', Valid: 'Not Applicable', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.4.4', 'ASVS Level': 2, CWE: 284, NIST: '', 'Verification Requirement': 'Verify the application uses a single and well-vetted access control mechanism for accessing protected data and resources. All requests must pass through this single mechanism to avoid copy and paste or insecure alternative paths. (C7)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.4.5', 'ASVS Level': 2, CWE: 275, NIST: '', 'Verification Requirement': 'Verify that attribute or feature-based access control is used whereby the code checks the user\'s authorization for a feature/data item rather than just their role. Permissions should still be allocated using roles. (C7)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Input and Output Architecture', '#': '1.5.1', 'ASVS Level': 2, CWE: 1029, NIST: '', 'Verification Requirement': 'Verify that input and output requirements clearly define how to handle and process data based on type, content, and applicable laws, regulations, and other policy compliance.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.5.2', 'ASVS Level': 2, CWE: 502, NIST: '', 'Verification Requirement': 'Verify that serialization is not used when communicating with untrusted clients. If this is not possible, ensure that adequate integrity controls (and possibly encryption if sensitive data is sent) are enforced to prevent deserialization attacks including object injection.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.5.3', 'ASVS Level': 2, CWE: 602, NIST: '', 'Verification Requirement': 'Verify that input validation is enforced on a trusted service layer. (C5)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.5.4', 'ASVS Level': 2, CWE: 116, NIST: '', 'Verification Requirement': 'Verify that output encoding occurs close to or by the interpreter for which it is intended. (C4)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Cryptographic Architecture', '#': '1.6.1', 'ASVS Level': 2, CWE: 320, NIST: '', 'Verification Requirement': 'Verify that there is an explicit policy for management of cryptographic keys and that a cryptographic key lifecycle follows a key management standard such as NIST SP 800-57.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.6.2', 'ASVS Level': 2, CWE: 320, NIST: '', 'Verification Requirement': 'Verify that consumers of cryptographic services protect key material and other secrets by using key vaults or API based alternatives.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.6.3', 'ASVS Level': 2, CWE: 320, NIST: '', 'Verification Requirement': 'Verify that all keys and passwords are replaceable and are part of a well-defined process to re-encrypt sensitive data.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.6.4', 'ASVS Level': 2, CWE: 320, NIST: '', 'Verification Requirement': 'Verify that the architecture treats client-side secrets--such as symmetric keys, passwords, or API tokens--as insecure and never uses them to protect or access sensitive data.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Error, Logging and Auditing Architecture', '#': '1.7.1', 'ASVS Level': 2, CWE: 1009, NIST: '', 'Verification Requirement': 'Verify that a common logging format and approach is used across the system. (C9)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.7.2', 'ASVS Level': 2, CWE: '', NIST: '', 'Verification Requirement': 'Verify that logs are securely transmitted to a preferably remote system for analysis, detection, alerting, and escalation. (C9)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Data Protection and Privacy Architecture', '#': '1.8.1', 'ASVS Level': 2, CWE: '', NIST: '', 'Verification Requirement': 'Verify that all sensitive data is identified and classified into protection levels.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.8.2', 'ASVS Level': 2, CWE: '', NIST: '', 'Verification Requirement': 'Verify that all protection levels have an associated set of protection requirements, such as encryption requirements, integrity requirements, retention, privacy and other confidentiality requirements, and that these are applied in the architecture.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Communications Architecture', '#': '1.9.1', 'ASVS Level': 2, CWE: 319, NIST: '', 'Verification Requirement': 'Verify the application encrypts communications between components, particularly when these components are in different containers, systems, sites, or cloud providers. (C3)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.9.2', 'ASVS Level': 2, CWE: 295, NIST: '', 'Verification Requirement': 'Verify that application components verify the authenticity of each side in a communication link to prevent person-in-the-middle attacks. For example, application components should validate TLS certificates and chains.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Malicious Software Architecture', '#': '1.10.1', 'ASVS Level': 2, CWE: 284, NIST: '', 'Verification Requirement': 'Verify that a source code control system is in use, with procedures to ensure that check-ins are accompanied by issues or change tickets. The source code control system should have access control and identifiable users to allow traceability of any changes.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Business Logic Architecture', '#': '1.11.1', 'ASVS Level': 2, CWE: 1059, NIST: '', 'Verification Requirement': 'Verify the definition and documentation of all application components in terms of the business or security functions they provide.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.11.2', 'ASVS Level': 2, CWE: 362, NIST: '', 'Verification Requirement': 'Verify that all high-value business logic flows, including authentication, session management and access control, do not share unsynchronized state.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.11.3', 'ASVS Level': 2, CWE: 367, NIST: '', 'Verification Requirement': 'Verify that all high-value business logic flows, including authentication, session management and access control are thread safe and resistant to time-of-check and time-of-use race conditions.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Secure File Upload Architecture', '#': '1.12.1', 'ASVS Level': 2, CWE: 552, NIST: '', 'Verification Requirement': '[DELETED, DUPLICATE OF 12.4.1]', Valid: 'Not Applicable', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.12.2', 'ASVS Level': 2, CWE: 646, NIST: '', 'Verification Requirement': 'Verify that user-uploaded files - if required to be displayed or downloaded from the application - are served by either octet stream downloads, or from an unrelated domain, such as a cloud file storage bucket. Implement a suitable Content Security Policy (CSP) to reduce the risk from XSS vectors or other attacks from the uploaded file.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: 'Configuration Architecture', '#': '1.14.1', 'ASVS Level': 2, CWE: 923, NIST: '', 'Verification Requirement': 'Verify the segregation of components of differing trust levels through well-defined security controls, firewall rules, API gateways, reverse proxies, cloud-based security groups, or similar mechanisms.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.14.2', 'ASVS Level': 2, CWE: 494, NIST: '', 'Verification Requirement': 'Verify that binary signatures, trusted connections, and verified endpoints are used to deploy binaries to remote devices.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.14.3', 'ASVS Level': 2, CWE: 1104, NIST: '', 'Verification Requirement': 'Verify that the build pipeline warns of out-of-date or insecure components and takes appropriate actions.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.14.4', 'ASVS Level': 2, CWE: '', NIST: '', 'Verification Requirement': 'Verify that the build pipeline contains a build step to automatically build and verify the secure deployment of the application, particularly if the application infrastructure is software defined, such as cloud environment build scripts.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.14.5', 'ASVS Level': 2, CWE: 265, NIST: '', 'Verification Requirement': 'Verify that application deployments adequately sandbox, containerize and/or isolate at the network level to delay and deter attackers from attacking other applications, especially when they are performing sensitive or dangerous actions such as deserialization. (C5)', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
  { Area: '', '#': '1.14.6', 'ASVS Level': 2, CWE: 477, NIST: '', 'Verification Requirement': 'Verify the application does not use unsupported, insecure, or deprecated client-side technologies such as NSAPI plugins, Flash, Shockwave, ActiveX, Silverlight, NACL, or client-side Java applets.', Valid: '', 'Source Code Reference': '', Comment: '', 'Tool Used': '' },
];

// Color palette for area groups
const AREA_COLORS: { color: string; bgColor: string; borderColor: string }[] = [
  { color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)' },    // Indigo
  { color: '#f43f5e', bgColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)' },      // Rose
  { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' },     // Emerald
  { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' },     // Amber
  { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' },     // Blue
  { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' },     // Violet
  { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)' },     // Pink
  { color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.1)', borderColor: 'rgba(20, 184, 166, 0.3)' },     // Teal
  { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' },       // Red
  { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.3)' },       // Cyan
  { color: '#84cc16', bgColor: 'rgba(132, 204, 22, 0.1)', borderColor: 'rgba(132, 204, 22, 0.3)' },     // Lime
  { color: '#d946ef', bgColor: 'rgba(217, 70, 239, 0.1)', borderColor: 'rgba(217, 70, 239, 0.3)' },     // Fuchsia
  { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.3)' },     // Orange
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
  ts = inject(TranslationService);

  requirements = signal<ASVSRequirement[]>([]);
  statuses = signal<Record<string, RequirementStatus>>({});

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
      const matchArea = area === 'all' || this.getAreaForReq(req) === area;
      const matchLevel = level === 'all' || req['ASVS Level'] === parseInt(level);
      return matchSearch && matchArea && matchLevel;
    });
  });

  // Group requirements by area (non-null areas only)
  groupedRequirements = computed(() => {
    const reqs = this.filteredRequirements();
    const groups: AreaGroup[] = [];
    let currentArea = '';
    let currentGroup: AreaGroup | null = null;
    let colorIndex = 0;

    // Build area list to assign colors based on the full data
    const allAreas: string[] = [];
    let lastArea = '';
    for (const req of this.requirements()) {
      if (req.Area && req.Area.trim()) {
        if (req.Area.trim() !== lastArea) {
          allAreas.push(req.Area.trim());
          lastArea = req.Area.trim();
        }
      }
    }
    const areaColorMap = new Map<string, number>();
    allAreas.forEach((a, i) => areaColorMap.set(a, i));

    for (const req of reqs) {
      const area = req.Area && req.Area.trim() ? req.Area.trim() : currentArea;
      if (area !== currentArea || !currentGroup) {
        const ci = areaColorMap.get(area) ?? colorIndex;
        const colors = AREA_COLORS[ci % AREA_COLORS.length];
        currentGroup = {
          area,
          color: colors.color,
          bgColor: colors.bgColor,
          borderColor: colors.borderColor,
          requirements: []
        };
        groups.push(currentGroup);
        currentArea = area;
        colorIndex++;
      }
      currentGroup.requirements.push(req);
    }
    return groups;
  });

  // Area-based pagination: each page = one area
  totalPages = computed(() => {
    if (this.selectedArea() === 'all') {
      return Math.max(1, this.groupedRequirements().length);
    }
    return 1;
  });

  // Current area group for the "All Areas" paginated view (one area per page)
  currentAreaGroup = computed(() => {
    const groups = this.groupedRequirements();
    const idx = this.currentPage() - 1;
    return groups[idx] ?? null;
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
    this.requirements.set(ASVS_DATA);
  }

  /** Resolve effective area for a requirement (inherits from previous if null) */
  getAreaForReq(req: ASVSRequirement): string {
    if (req.Area && req.Area.trim()) return req.Area.trim();
    const all = this.requirements();
    const idx = all.indexOf(req);
    for (let i = idx - 1; i >= 0; i--) {
      if (all[i].Area && all[i].Area.trim()) return all[i].Area.trim();
    }
    return '';
  }

  /** Get color for a requirement based on its resolved area */
  getAreaColor(req: ASVSRequirement): { color: string; bgColor: string; borderColor: string } {
    const area = this.getAreaForReq(req);
    // Build area-to-index map
    const allAreas: string[] = [];
    let lastArea = '';
    for (const r of this.requirements()) {
      if (r.Area && r.Area.trim() && r.Area.trim() !== lastArea) {
        allAreas.push(r.Area.trim());
        lastArea = r.Area.trim();
      }
    }
    const idx = allAreas.indexOf(area);
    return AREA_COLORS[(idx >= 0 ? idx : 0) % AREA_COLORS.length];
  }

  onAreaChange(value: string) {
    this.selectedArea.set(value);
    this.currentPage.set(1);
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

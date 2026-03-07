import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/scanner', label: 'GitHub Scanner' },
    { path: '/history', label: 'Scan History' },
    { path: '/checklist', label: 'ASVS Checklist' },
    { path: '/cicd-guide', label: 'CI/CD Guide' },
  ];

  // Close dropdowns when clicking anywhere on document
  @HostListener('document:click')
  onDocumentClick() {
    this.userMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  handleLogout() {
    this.authService.logout();
    this.userMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}

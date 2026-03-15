import { Component, signal, inject, HostListener, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { TranslationService } from '../../services/translation.service';

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
  ts = inject(TranslationService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  navLinks = computed(() => [
    { path: '/dashboard', label: this.ts.t('nav.dashboard') },
    { path: '/scanner', label: this.ts.t('nav.scanner') },
    { path: '/history', label: this.ts.t('nav.history') },
    { path: '/checklist', label: this.ts.t('nav.checklist') },
    { path: '/cicd-guide', label: this.ts.t('nav.cicd') },
  ]);

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

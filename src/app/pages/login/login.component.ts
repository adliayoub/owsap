import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  ts = inject(TranslationService);

  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  error = signal('');

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async handleSubmit() {
    this.error.set('');
    this.isLoading.set(true);
    try {
      const ok = await this.authService.login(this.email, this.password);
      if (ok) this.router.navigate(['/dashboard']);
      else this.error.set(this.ts.t('login.invalidCredentials'));
    } catch {
      this.error.set(this.ts.t('login.error'));
    } finally {
      this.isLoading.set(false);
    }
  }

  fillDemo() {
    this.email = 'demo@asvs.security';
    this.password = 'demo123';
  }
}

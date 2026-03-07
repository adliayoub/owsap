import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
      else this.error.set('Invalid email or password. Try demo@asvs.security / demo123');
    } catch {
      this.error.set('An error occurred. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  fillDemo() {
    this.email = 'demo@asvs.security';
    this.password = 'demo123';
  }
}

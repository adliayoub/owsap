import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);

  user = this._user.asReadonly();
  isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { this._user.set(JSON.parse(saved)); } catch {}
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    if (email === 'demo@asvs.security' && password === 'demo123') {
      const userData: User = { email: 'demo@asvs.security', name: 'Security Analyst', role: 'analyst' };
      this._user.set(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('user');
  }
}

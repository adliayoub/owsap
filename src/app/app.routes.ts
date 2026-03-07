import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'scanner', loadComponent: () => import('./pages/github-scanner/github-scanner.component').then(m => m.GithubScannerComponent) },
  { path: 'checklist', loadComponent: () => import('./pages/asvs-checklist/asvs-checklist.component').then(m => m.AsvsChecklistComponent) },
  { path: 'history', loadComponent: () => import('./pages/scan-history/scan-history.component').then(m => m.ScanHistoryComponent) },
  { path: 'cicd-guide', loadComponent: () => import('./pages/cicd-guide/cicd-guide.component').then(m => m.CicdGuideComponent) },
  { path: '**', redirectTo: '' }
];

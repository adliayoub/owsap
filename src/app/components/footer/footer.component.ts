import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year = new Date().getFullYear();

  socialIcons = [
    { label: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
    { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
    { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
    { label: 'Email', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  ];

  footerSections = [
    {
      category: 'Product',
      links: [
        { label: 'GitHub Scanner', path: '/scanner' },
        { label: 'ASVS Checklist', path: '/checklist' },
        { label: 'Scan History', path: '/history' },
        { label: 'CI/CD Integration', path: '/cicd-guide' },
      ]
    },
    {
      category: 'Resources',
      links: [
        { label: 'OWASP ASVS', href: 'https://owasp.org/www-project-application-security-verification-standard/' },
        { label: 'Documentation', path: '#' },
        { label: 'API Reference', path: '#' },
        { label: 'Security Blog', path: '#' },
      ]
    },
    {
      category: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '#' },
        { label: 'Terms of Service', path: '#' },
        { label: 'Cookie Policy', path: '#' },
        { label: 'Security Disclosure', path: '#' },
      ]
    }
  ];
}

# ASVS Security Dashboard — Angular 17+

Conversion complète du projet React vers **Angular 17+ Standalone**.

## 🚀 Installation & Démarrage

```bash
npm install
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200)

## 🔐 Identifiants Demo

- **Email:** demo@asvs.security
- **Password:** demo123

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/         # Navbar avec theme toggle + auth
│   │   └── footer/         # Footer avec liens
│   ├── guards/
│   │   └── auth.guard.ts   # Route guard Angular
│   ├── models/
│   │   └── index.ts        # Interfaces TypeScript
│   ├── pages/
│   │   ├── home/           # Page d'accueil avec canvas particles
│   │   ├── login/          # Page de connexion
│   │   ├── dashboard/      # Dashboard avec Chart.js
│   │   ├── github-scanner/ # Scanner avec simulation de scan
│   │   ├── asvs-checklist/ # Checklist OWASP ASVS
│   │   ├── scan-history/   # Historique des scans
│   │   └── cicd-guide/     # Guide CI/CD
│   ├── services/
│   │   ├── auth.service.ts  # Auth avec Signals Angular
│   │   └── theme.service.ts # Theme dark/light
│   ├── app.component.ts
│   └── app.routes.ts
├── styles.scss              # CSS variables Tailwind
└── main.ts                  # Bootstrap standalone
```

## 🔄 React → Angular : Correspondances

| React | Angular 17+ |
|-------|------------|
| `useState` | `signal()` |
| `useEffect` | `ngOnInit()` / `AfterViewInit` |
| `useMemo` / `useCallback` | `computed()` |
| `Context` | `Injectable Service` |
| `React Router` | `@angular/router` |
| `framer-motion` | CSS animations + Angular Animations |
| `recharts` | `Chart.js` via CDN |
| `shadcn/ui` | Tailwind CSS natif |

## 🛠️ Technologies

- **Angular 17+** — Standalone Components, Signals
- **Tailwind CSS** — Styling
- **Chart.js** — Graphiques (Dashboard)
- **TypeScript** — Typage strict
- **Angular Router** — Navigation avec lazy loading

## 📦 Build Production

```bash
npm run build
```

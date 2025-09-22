# CthulhuCharacterApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Déploiement sur Netlify

Ce projet est configuré pour être déployé facilement sur Netlify sous le nom "call-of-cthulhu".

### Configuration automatique

Le projet inclut :
- `netlify.toml` : Configuration principale de Netlify avec les redirections SPA et les headers de sécurité
- `public/_redirects` : Fichier de fallback pour les redirections
- Script npm optimisé : `npm run build:netlify` pour la production

### Étapes de déploiement

#### Option 1 : Déploiement depuis GitHub (Recommandé)

1. **Connecter votre repository à Netlify :**
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Sélectionnez votre provider Git (GitHub, GitLab, Bitbucket)
   - Choisissez ce repository

2. **Configuration de build :**
   - Build command: `npm run build` (ou `npm run build:netlify`)
   - Publish directory: `dist/cthulhu-character-app/browser`
   - Node version: `18` (configuré automatiquement via netlify.toml)

3. **Nom du site :**
   - Dans les paramètres du site, changez le nom pour "call-of-cthulhu"
   - L'URL sera : `https://call-of-cthulhu.netlify.app`

#### Option 2 : Déploiement manuel

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build du projet
npm run build:netlify

# Déploiement
netlify deploy --prod --dir=dist/cthulhu-character-app/browser --site=call-of-cthulhu
```

### Fonctionnalités incluses

- ✅ Redirections SPA pour le routing Angular
- ✅ Headers de sécurité (XSS, CSRF, etc.)
- ✅ Cache optimisé pour les assets statiques
- ✅ Support des langues multiples (i18n)
- ✅ Build optimisé pour la production

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Examination Management System

This is a code bundle for Examination Management System. The original project is available at https://www.figma.com/design/q0TcX27ILahCFOSTtS9kUW/Examination-Management-System.

## Running the code locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

## Deploying to Vercel

This project is now configured for Vercel deployment as a Vite single-page app (SPA).

### Option 1: Vercel Dashboard

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import the repository.
3. Keep the default detected settings or use:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

For production deployment:

```bash
vercel --prod
```

### Notes

- `vercel.json` includes an SPA rewrite so deep links like `/faculty/duties` and `/student/exams` work after refresh.
- No server-side runtime is required for deployment; the app is served as static assets from `dist`.

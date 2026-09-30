# MediChain AI — Smart Healthcare Supply Chain & Resilience Platform

MediChain AI is an AI-powered healthcare supply chain resilience platform featuring real-time medicine demand forecasting, stock-out risk prevention, cold-chain verification, inter-hospital stock redistribution, and digital twin disruption simulation.

---

## 🚀 How to Push and Deploy to GitHub

Because this workspace runs in an isolated container without access to your private GitHub credentials or SSH keys, you can connect it to your GitHub account using the simple steps below.

### Option 1: Deploy with GitHub Pages (Automated Workflow Included)

A ready-to-use GitHub Actions workflow has already been configured in `.github/workflows/deploy.yml`. Once pushed, GitHub will automatically build and deploy your app.

#### Step 1: Create a new repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter a repository name (e.g., `medichain-ai`).
3. Leave it Public (or Private), and **do not** initialize with a README, .gitignore, or license (the repository already has these).
4. Click **Create repository**.

#### Step 2: Push your code to GitHub
Run the following commands in your terminal from your project folder:

```bash
# Link your local repo to your GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# Push the main branch to GitHub
git push -u origin main
```

#### Step 3: Enable GitHub Pages
1. On GitHub, navigate to your repository **Settings** → **Pages** (in the left sidebar).
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Go to the **Actions** tab on your repository to watch the deployment run.
4. Once completed, your live URL will be shown at `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`.

---

### Option 2: Deploy to Vercel (1-Click, Free & Fast)

Vercel is natively optimized for Vite + React applications:
1. Push your repository to GitHub (following the steps above).
2. Go to [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **Add New Project** and select your GitHub repository.
4. Framework preset will automatically detect **Vite**.
5. (Optional) Add your `GEMINI_API_KEY` under Environment Variables.
6. Click **Deploy**. Your app will be live with free SSL in less than 60 seconds!

---

### Option 3: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub.
2. Click **Add new site** → **Import an existing project**.
3. Select your repository.
4. Set Build command: `npm run build` and Publish directory: `dist`.
5. Click **Deploy site**.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy environment template
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🛠 Features Included
- **10 Purpose-Built Healthcare Workspaces**: Doctor, Pharmacist, Receptionist, Nurse, District Admin, Supply Chain Officer, Warehouse Manager, ML Analyst, Super Admin, and Auditor.
- **Real-Time Stock & Epidemic Analytics**: EDA charts, risk heatmap, inventory velocity, and critical shortage alarms.
- **Redistribution & Dispatch**: Automated inter-hospital transfer coordination.
- **Digital Twin Simulation**: Disruption stress-testing (severe weather, border delays, cold chain breakdown).

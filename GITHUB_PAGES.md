# Share this prototype as a static site on your GitHub (TT-nking)

Use these steps to host the product-finder prototype on [GitHub Pages](https://pages.github.com/) under your account [TT-nking](https://github.com/TT-nking) so you can share a single link (e.g. in Slack).

---

## One-command option (if you have GitHub CLI)

If you have [GitHub CLI](https://cli.github.com/) installed and logged in (`gh auth login`):

```bash
cd /Users/ctr-nking/product-finder-prototype
chmod +x push-to-github.sh
./push-to-github.sh
```

Then in the repo on GitHub: **Settings → Pages → Source: GitHub Actions**. Your site will be at **https://tt-nking.github.io/product-finder-prototype/**.

---

## Manual steps

### 1. Create a new repo under TT-nking

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** e.g. `product-finder-prototype` (or any name; the URL will be `https://tt-nking.github.io/<repo-name>/`).
3. **Public**, leave **Add a README** unchecked (you already have one).
4. Click **Create repository**.

---

## 2. Set the Vite base path (required for GitHub Pages)

GitHub Pages serves the site at `https://tt-nking.github.io/<repo-name>/`, so all asset paths must start with `/<repo-name>/`.

- Open **`vite.config.ts`** and set `base` to your repo name (with leading and trailing slash):

```ts
export default defineConfig({
  base: '/product-finder-prototype/',  // ← use your repo name, e.g. '/my-prototype/'
  plugins: [react()],
});
```

- If you used a different repo name, use that: `base: '/your-repo-name/'`.

---

## 3. Push the project to the new repo

From your machine, in the project folder:

```bash
cd /Users/ctr-nking/product-finder-prototype

# If this folder isn’t a git repo yet:
git init
git add .
git commit -m "Initial commit: product finder prototype"

# Add your new repo as remote (replace REPO_NAME with your actual repo name)
git remote add origin https://github.com/TT-nking/REPO_NAME.git

# Push (use main or master depending on your default branch)
git branch -M main
git push -u origin main
```

If the folder is already a git repo with another remote, add the new one and push:

```bash
git remote add origin https://github.com/TT-nking/product-finder-prototype.git
git push -u origin main
```

---

## 4. Turn on GitHub Pages and deploy

**Option A: Deploy from a GitHub Action (recommended)**

- The project includes **`.github/workflows/deploy-pages.yml`**, which builds the app and deploys the `dist/` folder to GitHub Pages on every push to `main`.
- After you push, go to the repo on GitHub → **Settings** → **Pages**.
- Under **Build and deployment**, set **Source** to **GitHub Actions**.
- The next push to `main` (or the first one after adding the workflow) will run the workflow; when it finishes, the site will be live at `https://tt-nking.github.io/<repo-name>/`.

**Option B: Deploy from the `dist/` folder manually**

- Locally run: `npm run build`
- Push the **contents** of the `dist/` folder to a branch named `gh-pages` (or use the **docs/** folder on main and set Pages to deploy from that folder).  
  See [GitHub Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for “Publishing source” options.

---

## 5. Share the link

- Live URL: **`https://tt-nking.github.io/<repo-name>/`**  
  Example: `https://tt-nking.github.io/product-finder-prototype/`
- Paste that URL in Slack (or email); anyone can open it in a browser. No install or sign-in required.

---

## Checklist

| Step | Done |
|------|------|
| Create new repo under [TT-nking](https://github.com/TT-nking) | |
| Set `base` in `vite.config.ts` to `'/your-repo-name/'` | |
| Push project to the new repo | |
| Enable Pages: **Settings → Pages → Source: GitHub Actions** | |
| Wait for workflow to finish; open `https://tt-nking.github.io/<repo-name>/` | |

If the page is blank or assets don’t load, double-check that `base` in `vite.config.ts` matches the repo name (with slashes).

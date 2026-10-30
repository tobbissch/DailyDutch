# DailyDutch — Deployment Guide

Step-by-step guide from the current local state of the project to a public, live website.
Total cost: **€0**. Expected time: 30–45 minutes the first time (plus up to an hour of waiting for DNS if you do the optional DuckDNS part).

---

## 0. What we are deploying (read once)

- DailyDutch is a **static website**: Vite + React + TypeScript. There is **no server, no database, no login, no API keys**.
- `npm run build` produces a folder `dist/` with plain HTML/CSS/JS/PNG files. "Deploying" = putting `dist/` on a free host that serves files over HTTPS.
- User progress is stored in each visitor's own browser (`localStorage`). Nothing to back up, nothing to migrate.
- Speech uses the browser's built-in Dutch voice (`speechSynthesis`). No external service.
- Routing uses `#/...` hash URLs (`#/review`, `#/lesson/3`), so the host needs **no rewrite rules**.
- The app is a PWA (installable, works offline). Service workers **only work over HTTPS** — every host below gives HTTPS for free.
- `index.html` and `src/main.tsx` use root paths (`/sw.js`, `/manifest.webmanifest`), so the app must be served from the **root of a domain** (e.g. `https://dailydutch.vercel.app/`), not from a sub-folder.

### Chosen setup

| Part | Choice | Why |
| --- | --- | --- |
| Code hosting | GitHub (repo `tobbissch/DailyDutch`, already set as `origin`) | Already configured |
| Web hosting | **Vercel, Hobby (free) plan** | Free, auto-detects Vite, free HTTPS, redeploys automatically on every `git push`, serves from domain root |
| Domain | `https://<project>.vercel.app` (always) + optional `https://<name>.duckdns.org` | Both free |

Why not GitHub Pages: it serves the site from `https://<user>.github.io/DailyDutch/` (a sub-folder), which breaks `/sw.js` and `/manifest.webmanifest` without code changes. Vercel avoids that.

Note: the Vercel Hobby plan is for **non-commercial** use. A free college project is fine.

### Final result

- `https://dailydutch.vercel.app` (or similar, see step 4.6) — always works.
- Optional: `https://dailydutch.duckdns.org` (or your chosen name) — nicer custom name.

---

## 1. Things you need before starting

Accounts (all free):

1. **GitHub** account that owns / can push to `github.com/tobbissch/DailyDutch`.
2. **Vercel** account — you will create it in step 4 by signing in with GitHub. Nothing to do now.
3. Optional: **DuckDNS** account — created in step 6 by signing in with GitHub/Google/etc.

On your Mac:

- Node.js **18 or newer** (you have v24 — fine). Check: `node -v`
- npm (comes with Node). Check: `npm -v`
- git. Check: `git --version`
- The project folder: `/Users/tabishamiri/Projects/collage/dailydutch`

Fill this in as you go (keep it somewhere private — not in the repo):

```
GitHub repo URL:        https://github.com/tobbissch/DailyDutch
Vercel project name:    __________________
Vercel URL:             https://__________________.vercel.app
(optional) DuckDNS name: __________________.duckdns.org
(optional) DuckDNS token: (secret — never commit, never share)
```

---

## 2. Local pre-flight check (make sure the build works)

Vercel will run exactly `npm run build`. If it fails on your Mac, it will fail on Vercel. Do this first.

Open Terminal:

```bash
cd /Users/tabishamiri/Projects/collage/dailydutch
```

### 2.1 Clean install of dependencies (same as Vercel does)

```bash
npm ci
```

Expected: ends with `added N packages`, no `ERR!` lines.

### 2.2 Content check

```bash
npm run check
```

Expected: no errors (this validates all lesson JSON files; it also runs automatically as part of `npm run build`).

### 2.3 Unit tests

```bash
npm test
```

Expected: all tests pass (`Tests  N passed`).

### 2.4 Production build

```bash
npm run build
```

This runs: content check → TypeScript type check (`tsc --noEmit`) → `vite build`.
Expected: last lines show files written to `dist/` and `✓ built in ...`.

Check the output folder contains these files:

```bash
ls dist
```

Must include: `index.html`, `assets/`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`.

### 2.5 Try the production build locally

```bash
npm run preview
```

Open the URL it prints (usually `http://localhost:4173`). Click through: Home → a lesson → Review → My words → Sounds → press a listen button. Then stop it with `Ctrl + C`.

(Offline mode / service worker also works on `localhost`, so you can test it here too: DevTools → Application → Service Workers.)

> Shortcut: `./deploy.sh check` runs 2.1–2.4 for you (see section 9).

---

## 3. Put the code on GitHub

Current state (at time of writing):
- Branch `main` is **1 commit ahead** of `origin/main` (commit "created the presentation" is not pushed yet).
- The `project-management/` documents are **untracked** (not committed).
- `dist/` and `node_modules/` are ignored by `.gitignore` — correct, Vercel builds its own. Do **not** commit them.

### 3.1 Check that you can reach GitHub over SSH

The remote is `git@github.com:tobbissch/DailyDutch.git` (SSH). Test:

```bash
ssh -T git@github.com
```

- Expected: `Hi tobbissch! You've successfully authenticated, but GitHub does not provide shell access.`
- If you see `Permission denied (publickey)`: your SSH key is not added to that GitHub account. Fix: either
  - add your key: `cat ~/.ssh/id_ed25519.pub` → copy → GitHub → Settings → SSH and GPG keys → New SSH key → paste. (No key yet? `ssh-keygen -t ed25519 -C "your-email"` first, press Enter for defaults.)
  - or switch to HTTPS: `git remote set-url origin https://github.com/tobbissch/DailyDutch.git` (git will then ask for username + a Personal Access Token, not your password).

Also check the username in the message is the account that owns the repo (`tobbissch`). Your local git user is `tobbisch-amiri` — that only affects commit author names, not access.

### 3.2 Make sure the repo exists on GitHub

Open `https://github.com/tobbissch/DailyDutch` in the browser.

- If it exists: continue.
- If it shows 404: create it — GitHub → **New repository** → Owner `tobbissch`, Name `DailyDutch`, **Public** or **Private** (both work with Vercel), **do NOT** tick "Add README / .gitignore / license" (the repo must be empty) → Create.

### 3.3 Commit the remaining files

Decide whether the `project-management/` documents should be in the repo. Recommended: yes (they are part of the project, small, no secrets). Note: if the repo is **public**, everyone can read them — remove any private info first (names, grades, etc.).

```bash
git status
git add project-management deployment.md deploy.sh
git commit -m "Add project management docs and deployment guide"
```

### 3.4 Push

```bash
git push -u origin main
```

Expected: `main -> main`. Refresh the GitHub page: you should see `src/`, `public/`, `package.json`, etc., and **no** `dist/` or `node_modules/`.

---

## 4. Deploy on Vercel

### 4.1 Create the Vercel account

1. Go to `https://vercel.com/signup`.
2. Choose plan type **Hobby** ("I'm working on personal projects").
3. Enter your name → **Continue with GitHub** → authorize Vercel.

### 4.2 Give Vercel access to the repo

1. Vercel dashboard → **Add New…** → **Project**.
2. Under "Import Git Repository" you see your GitHub repos. If `DailyDutch` is missing: click **Adjust GitHub App Permissions** (or "Configure GitHub App") → choose the `tobbissch` account → **Only select repositories** → select `DailyDutch` → **Save**.
3. Back on Vercel, click **Import** next to `DailyDutch`.

### 4.3 Project settings (the "Configure Project" screen)

Set / verify exactly this:

| Field | Value |
| --- | --- |
| Project Name | `dailydutch` (this becomes the URL; lowercase, see 4.6) |
| Framework Preset | **Vite** (auto-detected) |
| Root Directory | `./` (leave default) |
| Build Command | `npm run build` (default for Vite — leave it) |
| Output Directory | `dist` (default for Vite — leave it) |
| Install Command | `npm ci` (or leave default `npm install`; both work because `package-lock.json` exists) |
| Environment Variables | **none** — the app uses none |

### 4.4 Deploy

Click **Deploy**. Takes ~1 minute. You can watch the build log; it should show the same output as your local `npm run build` and end with `Deployment completed`.

When done you get a "Congratulations" screen with a preview image → click **Continue to Dashboard**.

### 4.5 (Recommended) pin the Node.js version

Project → **Settings** → **Build and Deployment** (sometimes "General") → **Node.js Version** → choose the newest offered (`22.x` or newer) → **Save**. Any 18+ version works; pinning avoids surprises when Vercel changes defaults.

### 4.6 Your public URL

Project dashboard → **Domains** shows the production URL, e.g. `https://dailydutch.vercel.app`.

- If `dailydutch` was already taken by someone else, Vercel gives something like `dailydutch-abc123.vercel.app`. You can pick a nicer free one: Project → **Settings** → **Domains** → **Add Domain** → type e.g. `daily-dutch.vercel.app` → Add. Any free `*.vercel.app` name works.
- Ignore the long URLs with random letters (e.g. `dailydutch-git-main-...vercel.app`): those are per-deployment links. Share only the short production URL.

**At this point the app is live and public.** Section 5 verifies it.

### 4.7 Make sure the site is really public

Vercel can protect deployments behind a Vercel login. The production domain is normally public, but check:
Project → **Settings** → **Deployment Protection** → **Vercel Authentication**: it is fine if it only applies to "Preview" deployments. If it says it applies to production / "All Deployments", set it to **Standard Protection** or disable it → Save.

Then open the production URL in a **private / incognito window** (not logged in to Vercel). If you see the DailyDutch home page, it is public.

---

## 5. Verify the live site (checklist)

Open the production URL, preferably on both laptop and phone:

- [ ] Address bar shows a lock (HTTPS).
- [ ] Home page loads, today's lesson shows.
- [ ] Open a lesson, go through words → grammar → dialogue.
- [ ] Listen button speaks Dutch. (Depends on the device having a Dutch voice: iPhone/Mac and Chrome on Android/desktop usually do. Not a deployment problem if one device lacks it.)
- [ ] Review, My words, Sounds pages open (`#/review`, `#/words`, `#/sounds`).
- [ ] Reload the page on `#/lesson/2` → same lesson shows (hash routing works).
- [ ] Progress survives a reload (localStorage).
- [ ] Desktop Chrome: DevTools (`Cmd+Option+I`) → **Application** → **Service Workers** shows `sw.js` "activated and is running"; **Manifest** shows name DailyDutch + icons, no errors.
- [ ] Offline: DevTools → Network → set "Offline" → reload → app still loads.
- [ ] Install on phone:
  - iPhone (Safari): Share → **Add to Home Screen**.
  - Android (Chrome): menu ⋮ → **Install app** / **Add to Home screen**.
  The app opens full-screen with the orange DailyDutch icon.

All ticked = officially live.

---

## 6. Optional: free custom name with DuckDNS

Gives you `https://<name>.duckdns.org` instead of `*.vercel.app`. Free. Skip this whole section if you don't want it — the Vercel URL is already fully working.

### How it works / limits (read first)

- DuckDNS gives free subdomains of `duckdns.org` and lets you point them at **one IPv4 address** (A record) — it does **not** support CNAME records.
- Vercel supports pointing a domain at its server with an **A record**, so this works: `yourname.duckdns.org → A → Vercel's IP`. Vercel then automatically gets a free HTTPS certificate (Let's Encrypt).
- Vercel's IP is fixed, so you set it **once**. You do **not** need the DuckDNS auto-update cron/script (that is only for home servers with changing IPs).
- DuckDNS is a free volunteer-run service; it is occasionally slow or down. The `*.vercel.app` URL keeps working regardless.
- **Important:** browser storage is per domain. A visitor's progress on `dailydutch.vercel.app` is **not** visible on `dailydutch.duckdns.org` and vice versa. Pick **one** URL to share with users and stick to it (section 6.6 shows how to redirect the other one).

### 6.1 Get the IP Vercel wants

1. Vercel → Project → **Settings** → **Domains** → **Add Domain**.
2. Type your chosen name, e.g. `dailydutch.duckdns.org` (check availability in 6.2 first if unsure) → **Add**.
3. If Vercel asks "Add www.… and redirect?" → choose to add **only** `dailydutch.duckdns.org` (no www).
4. Vercel now lists the domain with **Invalid Configuration** and shows the record it wants, typically:

   ```
   Type: A    Name: @    Value: 76.76.21.21
   ```

   Vercel sometimes shows a different IP (e.g. a newer `216.198.79.x` address). **Always use the exact value Vercel shows you.** Write it down.

(`duckdns.org` is on the public suffix list, so Vercel treats `yourname.duckdns.org` as a top-level "apex" domain — that's why it asks for an A record, which is exactly what DuckDNS supports.)

### 6.2 Create the DuckDNS subdomain

1. Go to `https://www.duckdns.org` → sign in (top: GitHub, Google, Reddit, or X/Twitter).
2. At the top you see your **token** (long UUID). This is a password — keep it secret, never commit it.
3. In the **sub domain** box type e.g. `dailydutch` → **add domain**. (If taken, try `daily-dutch`, `dailydutch-nl`, etc. — and use the same name in Vercel.)
4. In the list, in the **current ip** field of your new domain, replace the auto-filled IP (that's your home IP — wrong) with **Vercel's IP from 6.1** → click **update ip**.
5. Leave the IPv6 field **empty** (Vercel is reached over IPv4; a wrong IPv6 would break it).

Command-line alternative (same thing, using the DuckDNS API):

```bash
curl "https://www.duckdns.org/update?domains=dailydutch&token=YOUR_TOKEN&ip=76.76.21.21&verbose=true"
```

Expected answer starts with `OK`. (Or use `./deploy.sh duckdns-ip`, section 9.)

### 6.3 Check DNS

Wait 1–5 minutes, then:

```bash
dig +short dailydutch.duckdns.org
```

Expected: exactly Vercel's IP (e.g. `76.76.21.21`). If empty or different, wait a bit longer / redo 6.2 step 4. (Without `dig`: `nslookup dailydutch.duckdns.org`.)

### 6.4 Let Vercel verify + issue HTTPS

Back in Vercel → Settings → **Domains**. Click **Refresh** next to the domain. Within a few minutes (up to ~1 hour) the status turns to **Valid Configuration** and the certificate is issued automatically. Nothing else to do.

If Vercel instead asks to **verify ownership with a TXT record** (it does this when the name was ever linked to another Vercel account), it shows something like:

```
Type: TXT   Name: _vercel   Value: vc-domain-verify=dailydutch.duckdns.org,abc123...
```

DuckDNS allows one TXT value per domain, set via its API (it is served for sub-names like `_vercel.dailydutch.duckdns.org` too):

```bash
curl "https://www.duckdns.org/update?domains=dailydutch&token=YOUR_TOKEN&txt=PASTE_THE_FULL_VALUE&verbose=true"
```

(Or `./deploy.sh duckdns-txt "PASTE_THE_FULL_VALUE"`.) Check with `dig +short TXT _vercel.dailydutch.duckdns.org`, then click **Refresh/Verify** in Vercel. Once verified you can clear it:
`curl "https://www.duckdns.org/update?domains=dailydutch&token=YOUR_TOKEN&txt=removed&clear=true"`.

### 6.5 Test

Open `https://dailydutch.duckdns.org` in an incognito window → lock icon, DailyDutch loads. Re-run the checklist in section 5 on this URL (especially install on phone, since installation is tied to the domain).

### 6.6 Pick one main URL (recommended)

To avoid users having split progress on two domains, redirect one to the other:
Vercel → Settings → **Domains** → on `dailydutch.vercel.app` click **Edit** → **Redirect to** → `dailydutch.duckdns.org` → **308 Permanent** → Save.

(Only do this once 6.5 works. If DuckDNS ever has problems, remove the redirect and the vercel.app URL works directly again.)

---

## 7. Updating the live site later

Vercel is connected to GitHub: **every push to `main` = automatic new production deployment** (~1 minute). No manual step.

```bash
cd /Users/tabishamiri/Projects/collage/dailydutch
# ...edit files...
npm run build          # make sure it still builds
git add -A
git commit -m "Describe the change"
git push
```

Or: `./deploy.sh push` (runs all checks, then pushes; section 9).

Watch it in Vercel → Project → **Deployments** (status "Ready" = live).

Pushes to **other branches** create a separate *preview* URL and do **not** change the live site — useful for testing.

### About the service worker cache (why users still see the old version)

- Pages are fetched **network-first**, JS/CSS (in `/assets/`, file names contain a hash) are cache-first. So after a deploy, users get the new version on their **next page load while online** — usually immediately, at most one extra reload.
- Installed PWA on phone: close it fully and reopen once.
- Only if you change how caching works in `public/sw.js` (or the list of cached shell files): bump `const VERSION = 'v1'` → `'v2'` in `public/sw.js` so old caches get deleted.

---

## 8. Rollback (if a deployment breaks the site)

Fastest: Vercel → Project → **Deployments** → find the last good deployment → **⋯** → **Promote to Production** (or "Instant Rollback"). Live within seconds.

Then fix the code properly, and push again (or `git revert <bad-commit>` + `git push`).

---

## 9. The `deploy.sh` helper script

`deploy.sh` (in the project root) automates the repeatable parts. It never touches Vercel settings; it only checks/builds locally, pushes to GitHub (which triggers Vercel), and optionally talks to the DuckDNS API.

First time only, make it executable:

```bash
chmod +x deploy.sh
```

Commands:

| Command | What it does |
| --- | --- |
| `./deploy.sh check` | Verifies node/npm/git, `npm ci`, content check, tests, production build, checks `dist/` contains all required files. Changes nothing in git. |
| `./deploy.sh push` | Runs `check`, refuses if there are uncommitted changes or you're not on `main`, asks for confirmation, then `git push origin main` → Vercel deploys. |
| `./deploy.sh duckdns-ip [IP]` | Points your DuckDNS name at Vercel's IP (default `76.76.21.21`). |
| `./deploy.sh duckdns-txt "VALUE"` | Sets the DuckDNS TXT record (for Vercel ownership verification). |
| `./deploy.sh duckdns-status` | Shows what your DuckDNS name currently resolves to (A + TXT). |
| `./deploy.sh help` | Shows usage. |

DuckDNS commands need two environment variables (so the token is never written into a file in the repo):

```bash
export DUCKDNS_DOMAIN=dailydutch        # only the name, without .duckdns.org
export DUCKDNS_TOKEN=xxxxxxxx-xxxx-...  # from duckdns.org (secret)
./deploy.sh duckdns-ip 76.76.21.21
```

(`export` only lasts for that Terminal window — that is intentional.)

---

## 10. Troubleshooting

| Problem | Cause / fix |
| --- | --- |
| `git push` → `Permission denied (publickey)` | SSH key not on the GitHub account. See 3.1. |
| `git push` → `rejected ... fetch first` | GitHub has commits you don't have locally (e.g. you created the repo with a README). `git pull --rebase origin main`, then push again. |
| Vercel can't see the repo | 4.2 step 2 — give the Vercel GitHub App access to `DailyDutch`. |
| Vercel build fails at `node scripts/check-content.mjs` | A lesson JSON is invalid. Run `npm run check` locally, fix the reported file, push. |
| Vercel build fails at `tsc --noEmit` | Type error. Run `npm run build` locally, fix, push. |
| Vercel build fails with a Node error | Set Node.js Version to 22.x (4.5) and redeploy (Deployments → ⋯ → Redeploy). |
| Site shows 404 / "Deployment not found" | Wrong URL (a per-deployment link) or Output Directory not `dist`. Check 4.3 and 4.6. |
| Visitors see a Vercel login page | Deployment Protection on production. See 4.7. |
| Blank page | Open DevTools → Console. Usually a stale service worker: DevTools → Application → Storage → **Clear site data**, reload. |
| Old version still showing after deploy | Reload once more; on phone close + reopen the app. See section 7. |
| Listen button silent | Device has no Dutch voice installed (browser feature, not hosting). iOS: Settings → Accessibility → Spoken Content → Voices → Dutch. |
| "Install" option missing on phone | Must be HTTPS (it is) and the real production URL. iPhone: only Safari can add to home screen. |
| DuckDNS: Vercel stays "Invalid Configuration" | `dig +short yourname.duckdns.org` must show exactly the IP Vercel asks for. Remove any IPv6 value in DuckDNS. Wait, then Refresh. |
| DuckDNS: works on HTTP but certificate error | Certificate not issued yet — wait up to 1 hour after Vercel shows Valid Configuration. |
| DuckDNS name stops working someday | DuckDNS outage. Remove the redirect from 6.6; the vercel.app URL works on its own. |

---

## 11. Alternatives (only if Vercel is not an option)

Both are also free, need the same build settings (`npm run build`, output `dist`), and serve from the domain root:

- **Cloudflare Pages** — `dash.cloudflare.com` → Workers & Pages → Create → Pages → Connect to Git → choose repo → Framework preset **Vite** → Deploy. URL: `https://<project>.pages.dev`. Custom domains on Pages need a CNAME, so DuckDNS (A-record only) does **not** fit there.
- **Netlify** — `app.netlify.com` → Add new site → Import from Git → build `npm run build`, publish `dist` → Deploy. URL: `https://<name>.netlify.app`. Netlify also accepts an A record for apex domains (load balancer IP shown in its domain settings), so DuckDNS works the same way as in section 6.

---

## 12. Final checklist

- [ ] `npm run build` passes locally (section 2)
- [ ] All files committed, pushed to `github.com/tobbissch/DailyDutch` (section 3)
- [ ] Vercel project created from the repo, first deployment "Ready" (section 4)
- [ ] Production URL public in incognito (4.7)
- [ ] Live checklist done on laptop + phone (section 5)
- [ ] (Optional) DuckDNS domain shows Valid Configuration + HTTPS (section 6)
- [ ] (Optional) Redirect so only one URL is used (6.6)
- [ ] Update `PLAN.md` "Next": tick "Git repo + GitHub" and "Deploy", add the live URL
- [ ] Put the live URL in `project-management/06-project-closure-report.md` and the presentation if needed

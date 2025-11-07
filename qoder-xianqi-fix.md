# Qoder Prompt: Fix xianqi GitHub Pages Deployment Issues

You are working on the **xianqi** Vite React project that needs to be deployed to GitHub Pages with a custom domain.

## Problem
The website shows a blank page with the error:
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream"
```

This is because the GitHub Pages source is pointing to the wrong branch.

---

## Your Task

Fix all the following files and settings for the **xianqi** project:

### 1. Fix vite.config.js
**File**: `vite.config.js`

Find this line:
```javascript
base: '/xianqi/',  // or any repository name
```

Change it to:
```javascript
base: '/',
```

The complete config should look like:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
})
```

**Reason**: When using a custom domain (xianqi.bitebite.app), assets must load from root (`/`), not a subdirectory.

---

### 2. Create/Verify public/CNAME File
**File**: `public/CNAME`

**Content** (exactly):
```
xianqi.bitebite.app
```

**Important**: 
- No `https://`
- No trailing slash
- Just the domain name
- Should be at the root of the `public` folder

---

### 3. Verify package.json Scripts
**File**: `package.json`

Ensure these scripts exist:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

**Important**: 
- `predeploy` must run before `deploy` (it's automatic)
- Deploy must target `dist` folder, not `src`
- `gh-pages` package must be installed

---

### 4. Rebuild and Deploy

After making the above changes, run these commands:

```bash
# Install dependencies if needed
npm install

# Clean build
npm run build

# Deploy to GitHub Pages (this creates/updates gh-pages branch)
npm run deploy
```

---

## After Qoder Makes Changes

You will need to do this manually in GitHub:

### Manual Step: Change GitHub Pages Source

Go to your xianqi repository:

1. Click **Settings** (top right)
2. Click **Pages** (left sidebar)
3. Find the **Branch** dropdown under "Build and deployment" → "Source"
4. **Change from `main` to `gh-pages`**
5. Keep folder as **`/ (root)`**
6. Click **Save**

---

## Verification After Deployment

After making all changes and waiting 3-5 minutes:

1. Visit: https://xianqi.bitebite.app/
2. Open DevTools (F12) → Console tab
3. Verify:
   - ✅ No red error messages
   - ✅ No MIME type errors
   - ✅ Website content is visible
   - ✅ All assets load successfully

---

## Summary

**Files to update in Qoder**:
1. ✅ `vite.config.js` - change `base` to `/`
2. ✅ `public/CNAME` - create with domain `xianqi.bitebite.app`
3. ✅ `package.json` - verify deploy scripts are correct

**Commands to run after Qoder**:
```bash
npm run build
npm run deploy
```

**Manual step in GitHub**:
- Settings → Pages → Change branch from `main` to `gh-pages`

---

## Additional Notes

- The `gh-pages` package automatically creates a `gh-pages` branch when you run `npm run deploy`
- The CNAME file from `public/` folder is automatically copied to the root of the `gh-pages` branch during build
- GitHub Pages will then use this CNAME to route the custom domain to your site
- All files in the `dist` folder after build are what get deployed

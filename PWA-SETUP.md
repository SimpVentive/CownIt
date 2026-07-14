# CownIt PWA Setup Guide

Complete guide for Progressive Web App (PWA) configuration for CownIt.

## 📁 File Structure

```
web/
├── public/
│   ├── sw.js                 ← Service Worker (offline support)
│   ├── manifest.json         ← PWA metadata
│   ├── icons/                ← Icon directory
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── icon-192x192-maskable.png  (Android adaptive icon)
│   ├── index.html
│   └── favicon.png
├── index.html                ← Main HTML file (update with PWA tags)
└── src/
    └── main.tsx
```

---

## 1️⃣ Icon Files Setup

### Location: `/web/public/icons/`

**Three icon files required:**

| File | Size | Purpose |
|------|------|---------|
| `icon-192x192.png` | 192×192px | Chrome, Android, iOS home screen |
| `icon-512x512.png` | 512×512px | High-res displays, splash screens |
| `icon-192x192-maskable.png` | 192×192px | Android adaptive icons (all shapes) |

### Creating Icons

**Option A: From 1200×1200px source**
```bash
npm run process-icons
```
This runs `process-icons.js` which:
- Resizes 1200px → 192px, 512px
- Creates maskable version with 80% safe zone
- Saves to `/web/public/icons/`

**Option B: Manual creation**
1. Design icon at 1200×1200px (square, centered)
2. Use image editor to resize to:
   - 192×192px → save as `icon-192x192.png`
   - 512×512px → save as `icon-512x512.png`
3. Create maskable version:
   - 192×192px with 80% content zone (center 154px)
   - 19px padding on all sides
   - Save as `icon-192x192-maskable.png`

---

## 2️⃣ HTML Configuration

### Add to `<head>` section of `/web/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Character Encoding & Viewport -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <!-- Page Metadata -->
    <title>CownIt — Commit & Own It</title>
    <meta name="description" content="Commit & Own It - A progress tracking app. Log commitments, track achievements, and measure impact." />
    <meta name="color-scheme" content="light dark" />

    <!-- Open Graph Tags (Social Media) -->
    <meta property="og:title" content="CownIt" />
    <meta property="og:description" content="Commit & Own It - A progress tracking app" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://cownit.l-kurve.com" />

    <!-- PWA Configuration -->
    <meta name="theme-color" content="#001F3F" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="CownIt" />

    <!-- Icons & Manifest -->
    <link rel="icon" type="image/png" href="/icons/icon-192x192.png" sizes="192x192" />
    <link rel="icon" type="image/png" href="/icons/icon-512x512.png" sizes="512x512" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    <link rel="manifest" href="/manifest.json" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>

    <!-- Service Worker Registration (see section 3) -->
  </body>
</html>
```

### Key Meta Tags Explained:

| Tag | Purpose |
|-----|---------|
| `viewport-fit=cover` | Supports notch/safe areas on modern phones |
| `color-scheme` | Supports light and dark mode |
| `theme-color` | Status bar color (#001F3F = dark blue) |
| `apple-mobile-web-app-capable` | Full-screen mode on iOS |
| `manifest` | Links to PWA configuration file |

---

## 3️⃣ Service Worker Registration

### Add to `</body>` in `/web/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => {
        console.log('✓ Service Worker registered successfully');
      })
      .catch((error) => {
        console.error('✗ Service Worker registration failed:', error);
      });
  }
</script>
```

### What the Service Worker Does:

**Install Phase:**
- Caches index.html and manifest.json
- Activates immediately (skips waiting)

**Fetch Phase:**
- **API calls** (`/api/*`): Network-first strategy
  - Tries to fetch fresh data
  - Falls back to cache if offline
  - Caches successful responses
  
- **Static assets**: Cache-first strategy
  - Serves from cache instantly
  - Updates cache in background
  
- **Navigation**: Falls back to cached index.html
  - Enables SPA routing to work offline

**Offline Behavior:**
```
Online:       User gets fresh data + caches it
Offline API:  User gets cached data (or error)
Offline Page: User gets cached app shell (index.html)
```

---

## 4️⃣ Manifest Configuration

File: `/web/public/manifest.json`

```json
{
  "name": "CownIt",
  "short_name": "CownIt",
  "description": "Commit & Own It - A progress tracking app",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#001F3F",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["business", "productivity"]
}
```

---

## 5️⃣ Testing in Chrome DevTools

### Test PWA Features Locally

#### Step 1: Open DevTools
```
Chrome/Edge: F12 or Ctrl+Shift+I (Windows) / Cmd+Option+I (Mac)
```

#### Step 2: Navigate to Application Tab
```
DevTools → Application (or Storage on older Chrome)
```

#### Step 3: Check Manifest
```
Application → Manifest
  ✓ Verify name, icons, colors appear correctly
  ✓ Check that icon URLs resolve (200 OK)
  ✓ No errors in console
```

#### Step 4: Check Service Worker
```
Application → Service Workers
  ✓ Status shows "activated and running" (green dot)
  ✓ Scope shows "/" 
  ✓ No registration errors in console
```

#### Step 5: Test Caching
```
Application → Cache Storage → cownit-v1
  ✓ See cached files: index.html, manifest.json, etc.
  ✓ Click to view cached responses
  ✓ Check Last-Modified dates
```

#### Step 6: Test Offline Mode
```
DevTools → Network
  ☑ Check "Offline" checkbox
  
Then:
  1. Refresh page (Ctrl+R)
     → Should still load from cache
  2. Navigate to /api/people
     → Should show "Offline" (503)
  3. Go back to main page
     → Should still be cached and functional
```

#### Step 7: Test Install Prompt
```
DevTools → Console
  Run: window.location.reload()
  
Then:
  ☑ On Android/Chrome: "Install" banner should appear
  ☑ On iOS/Safari: Share → Add to Home Screen
```

### Full Testing Checklist

- [ ] Manifest loads without errors
- [ ] All icon URLs in manifest resolve correctly
- [ ] Service Worker shows "activated and running"
- [ ] Cache storage contains precached files
- [ ] App loads when offline
- [ ] API calls show "Offline" when network is disabled
- [ ] Navigation falls back to cached index.html
- [ ] Install banner appears on mobile
- [ ] No console errors or warnings
- [ ] Lighthouse PWA audit passes

### Chrome Lighthouse Audit

```
DevTools → Lighthouse
  1. Select "PWA" category
  2. Click "Analyze page load"
  3. Review results:
     ✓ Installable
     ✓ Works Offline
     ✓ Has Web App Manifest
     ✓ Has Service Worker
```

---

## 6️⃣ Deployment Checklist

Before deploying to production:

### Pre-deployment
- [ ] Icons are in `/web/public/icons/`
- [ ] manifest.json links to correct icon paths
- [ ] Service worker registered in index.html
- [ ] All meta tags added to `<head>`
- [ ] No console errors in DevTools
- [ ] Lighthouse PWA audit passes
- [ ] Tested offline mode
- [ ] Tested on mobile device

### Production
- [ ] SSL/HTTPS enabled (required for PWA)
- [ ] Service Worker cache busting (use version in CACHE_NAME)
- [ ] Monitor service worker errors
- [ ] Test install prompts on real devices

### Update Strategy

When you update icons or service worker:

1. **Change CACHE_NAME version:**
   ```javascript
   // In sw.js
   const CACHE_NAME = 'cownit-v2'; // Increment version
   ```

2. **Redeploy**
   ```bash
   npm run build
   git push
   # CI/CD deploys automatically
   ```

3. **Old caches automatically cleaned** during activate event

---

## 7️⃣ Testing on Real Devices

### Android (Chrome)
1. Open https://cownit.l-kurve.com
2. Wait for "Install CownIt" banner at bottom
3. Tap [Install]
4. Tap [Install app] in dialog
5. App appears on home screen
6. Tap to launch as standalone app

### iPhone (Safari)
1. Open https://cownit.l-kurve.com in Safari
2. Tap Share button (↑ in tab bar)
3. Tap "Add to Home Screen"
4. Enter name (keep default "CownIt")
5. Tap [Add]
6. App appears on home screen
7. Tap to launch as standalone app

### Testing Offline
1. Install app to home screen
2. Open app
3. Settings → Airplane Mode ON
4. Navigate within app
5. Verify:
   - Pages load from cache
   - API calls show offline state
   - Navigation still works (SPA routing)
6. Turn airplane mode OFF
7. API calls resume

---

## 📚 Reference Files

| File | Purpose | Status |
|------|---------|--------|
| `/web/index.html` | HTML with PWA meta tags | ✅ Configured |
| `/web/public/manifest.json` | PWA metadata | ✅ Configured |
| `/web/public/sw.js` | Service worker (offline) | ✅ Configured |
| `/web/public/icons/` | Icon files (3 versions) | ✅ Generated |
| `/process-icons.js` | Icon generation script | ✅ Available |

---

## 🚀 Quick Start

```bash
# 1. Build web app
cd web
npm run build

# 2. Deploy (auto via GitHub Actions)
git push origin main

# 3. Test in DevTools
# Chrome: F12 → Application → Check Manifest & Service Worker

# 4. Test on phone
# Android: Open app → Install banner
# iPhone: Safari → Share → Add to Home Screen
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Service Worker won't register | Check HTTPS (required), check `/sw.js` path, check console errors |
| Icons not showing | Verify paths in manifest.json point to `/icons/` folder |
| Install prompt not showing | Must use HTTPS, must have manifest.json, check Chrome version |
| Offline doesn't work | Clear cache (DevTools → Storage → Clear site data) and reload |
| Can't debug SW | DevTools → Application → Service Workers → Click "inspect" link |
| Cached data outdated | Change CACHE_NAME version in sw.js and redeploy |

---

## 📖 Additional Resources

- [Web.dev PWA Checklist](https://web.dev/install-criteria/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Chrome DevTools - Application](https://developer.chrome.com/docs/devtools/application/)

---

**Last Updated:** July 2026  
**CownIt Version:** 1.0.0  
**PWA Status:** ✅ Production Ready

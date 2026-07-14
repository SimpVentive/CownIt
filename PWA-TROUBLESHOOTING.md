# PWA Install Banner Troubleshooting

The install banner won't appear if certain Chrome requirements aren't met. Follow this guide to diagnose the issue.

---

## 🔍 **Chrome Requirements Checklist**

For the install banner to show, ALL of these must be true:

- [ ] **HTTPS enabled** (required)
- [ ] **manifest.json loads** (200 OK, valid JSON)
- [ ] **manifest.json has required fields** (name, short_name, icons, display, start_url)
- [ ] **Icons exist and load** (192×192 minimum)
- [ ] **Service Worker registered** (activated and running)
- [ ] **Service Worker has fetch event** (handles requests)
- [ ] **No console errors**
- [ ] **Not already installed**
- [ ] **Using Chrome 31+ on Android**

---

## 🛠️ **Step 1: Check HTTPS**

Open browser console and run:
```javascript
console.log(location.protocol); // Should be: https:
```

**Expected:** `https:`

**If showing `http:`** → HTTPS not configured. Contact sysadmin to enable SSL.

---

## 🛠️ **Step 2: Check Manifest.json Loads**

### In Chrome DevTools:

1. **Open DevTools:** F12
2. **Go to:** Application → Manifest
3. **Look for:**
   - ✅ Manifest loads without errors
   - ✅ Name shows "CownIt"
   - ✅ Icons section shows 4 icons
   - ✅ theme_color: #001F3F
   - ✅ start_url: /

**If showing errors:**
```
Check console for messages like:
- "Failed to load manifest from..." → manifest.json not found
- "Manifest is not valid JSON" → JSON syntax error
- "Missing required field..." → manifest missing required fields
```

### Manual Check:

Open in browser address bar:
```
https://cownit.l-kurve.com/manifest.json
```

**Expected:** JSON appears in browser (not download dialog)

**If 404 or empty:** manifest.json not deployed or in wrong location.

---

## 🛠️ **Step 3: Check Icons Load**

### In Chrome DevTools:

1. **Application → Manifest**
2. **Scroll to "Icons" section**
3. **Click each icon URL**
   - Should show green checkmark ✓
   - Should display the image preview

**If showing ❌ red X:**
```
Icon file not found:
- Check file exists: /web/public/icons/icon-192x192.png
- Check path in manifest.json: "src": "/icons/icon-192x192.png"
- Check file deployed to server
```

### Manual Check:

Open each URL in browser:
```
https://cownit.l-kurve.com/icons/icon-192x192.png
https://cownit.l-kurve.com/icons/icon-512x512.png
https://cownit.l-kurve.com/icons/icon-192x192-maskable.png
```

**Expected:** PNG image displays (not 404)

---

## 🛠️ **Step 4: Check Service Worker**

### In Chrome DevTools:

1. **Open DevTools:** F12
2. **Go to:** Application → Service Workers
3. **Look for:**
   - ✅ Status: "activated and running" (green dot)
   - ✅ Scope: /
   - ✅ No error messages

**If showing "redundant" (red):**
- Service Worker crashed or failed to register
- Check console for errors

### Console Check:

Open **Console** tab and look for:
```javascript
✓ "Service Worker registered successfully"
✗ "Service Worker registration failed: [error]"
```

**If seeing errors:**
```
Common issues:
- sw.js has syntax error
- sw.js returns 404
- sw.js has JavaScript errors
- Service Worker scope mismatch
```

---

## 🛠️ **Step 5: Check manifest.json Required Fields**

Go to **Application → Manifest** and verify these fields exist:

```javascript
{
  "name": "CownIt",                    ✓ Required
  "short_name": "CownIt",              ✓ Required
  "description": "...",                ✓ Recommended
  "start_url": "/",                    ✓ Required
  "display": "standalone",             ✓ Required (NOT "browser")
  "icons": [                           ✓ Required (at least 192px)
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "theme_color": "#001F3F",            ✓ Recommended
  "background_color": "#ffffff"        ✓ Recommended
}
```

---

## 🛠️ **Step 6: Verify Service Worker Fetch Handler**

### In DevTools Console:

```javascript
// Check if service worker is active
navigator.serviceWorker.controller
// Should return ServiceWorkerContainer object

// Try to fetch a resource while offline
fetch('/api/health')
  .then(r => r.text())
  .catch(e => console.error('Fetch failed:', e))
```

If service worker is working:
- Online: request goes to server
- Offline: request returns cached data or error

---

## 🛠️ **Step 7: Check for Console Errors**

1. **Open DevTools:** F12
2. **Go to:** Console tab
3. **Look for red error messages**

### Common Errors:

**"Failed to load manifest"**
```
Fix: Check manifest.json path in index.html
     Should be: <link rel="manifest" href="/manifest.json" />
```

**"Service Worker registration failed"**
```
Fix: Check sw.js syntax, ensure it's at /public/sw.js
     Check console for JavaScript errors in sw.js
```

**"Failed to fetch resource"**
```
Fix: Check icon file paths, ensure files exist on server
```

---

## 🛠️ **Step 8: Clear Cache & Reload**

Sometimes old cache prevents banner from showing:

1. **DevTools → Application → Storage**
2. **Click "Clear site data"**
3. **Check:** All checkboxes
4. **Click:** "Clear"
5. **Reload page:** Ctrl+R (or Cmd+R on Mac)
6. **Close DevTools**
7. **Wait 10 seconds**
8. **Banner should appear**

---

## 🛠️ **Step 9: Check Installation Requirements**

The banner only shows if:

- [ ] Not already installed (check if icon on home screen)
- [ ] Chrome 31+ (almost all Android Chrome versions)
- [ ] Android phone (not desktop)
- [ ] Not in incognito/private mode
- [ ] Using HTTPS
- [ ] Service Worker active
- [ ] Manifest valid
- [ ] Icons loadable

**To test if already installed:**
- Swipe to home screen
- Look for "CownIt" icon
- If present, uninstall first (long-press → Remove)

---

## ✅ **Complete Debugging Checklist**

### Terminal Checks:
```bash
# 1. Check if manifest.json is accessible
curl -s https://cownit.l-kurve.com/manifest.json | jq .

# 2. Check if icons exist
curl -I https://cownit.l-kurve.com/icons/icon-192x192.png
curl -I https://cownit.l-kurve.com/icons/icon-512x512.png
curl -I https://cownit.l-kurve.com/icons/icon-192x192-maskable.png

# 3. Check if service worker exists
curl -I https://cownit.l-kurve.com/sw.js
```

**Expected:** All return `HTTP/1.1 200 OK`

### Browser DevTools Checks:
- [ ] Application → Manifest: Shows valid config
- [ ] Application → Manifest: All icons show ✓
- [ ] Application → Service Workers: Shows "activated and running"
- [ ] Application → Cache Storage: Shows cached files
- [ ] Console: No red error messages
- [ ] Console: Shows "Service Worker registered successfully"

---

## 🚨 **Most Common Issues & Fixes**

### Issue: Icons show ❌ in manifest
**Cause:** Icon files not deployed  
**Fix:**
```bash
# Check icons exist locally
ls -la web/public/icons/

# If missing, regenerate
npm run process-icons

# Rebuild and redeploy
npm run build
git push origin main
```

### Issue: Service Worker shows "redundant" (red)
**Cause:** Service Worker crashed or failed to load  
**Fix:**
```bash
# Check for syntax errors in sw.js
# Check browser console for error messages
# Verify /sw.js path is correct
# Clear site data and reload
```

### Issue: Manifest doesn't load (404)
**Cause:** manifest.json not in /public folder or wrong path  
**Fix:**
```bash
# Verify file exists
ls -la web/public/manifest.json

# Verify path in index.html
grep manifest web/index.html
# Should show: <link rel="manifest" href="/manifest.json" />

# Redeploy if needed
git push origin main
```

### Issue: Banner shows but Install fails
**Cause:** Installation error in browser  
**Fix:**
- Try a different Chrome version
- Clear browser data and cache
- Try incognito mode (in case privacy settings block install)
- Check Chrome is up to date: Chrome menu → About Chrome

---

## 📱 **Testing on Real Android Device**

1. **Ensure HTTPS working:**
   ```
   Open https://cownit.l-kurve.com in Chrome
   Address bar should show green lock 🔒
   ```

2. **Open DevTools on phone:**
   ```
   On computer with phone connected:
   - Chrome → Dev Tools
   - Devices → Port forwarding (optional, if testing localhost)
   ```

3. **Check DevTools remotely:**
   ```
   Computer: chrome://inspect/#devices
   Select phone device
   Click "inspect" next to CownIt tab
   ```

4. **Look for install banner:**
   ```
   - Bottom of screen: "Install CownIt" banner
   - Or: Chrome menu (⋮) → "Install app"
   ```

5. **If no banner appears:**
   - Check all steps above
   - Try clearing Chrome data on phone
   - Try different Chrome channel (Beta, Dev)

---

## 🔧 **Server-Side Checks**

If everything looks correct in DevTools but banner still doesn't show:

### Check HTTP Headers

```bash
curl -I https://cownit.l-kurve.com/manifest.json

# Should show:
# Content-Type: application/json (or application/manifest+json)
# Cache-Control: public, max-age=3600 (or similar)
```

### Check Apache Configuration

Ensure `/web/public` is being served:

```bash
# On server, check Apache config
cat /etc/apache2/sites-available/*.conf | grep -A 10 "cownit"

# Should show:
# DocumentRoot /path/to/web/public
# Or similar proxy config
```

### Check Files Deployed

```bash
# On server, verify files exist
ls -la /var/www/cownit/web/public/manifest.json
ls -la /var/www/cownit/web/public/sw.js
ls -la /var/www/cownit/web/public/icons/
```

---

## 📞 **Still Not Working?**

If you've checked everything above and banner still doesn't show:

1. **Collect debug info:**
   ```bash
   # Take screenshot of DevTools
   # Note Chrome version (Chrome menu → About)
   # Note Android version
   # Copy console errors
   ```

2. **Check Chrome Lighthouse:**
   - DevTools → Lighthouse
   - Category: "PWA"
   - Run audit
   - Review failures

3. **Check requirements met:**
   - https://web.dev/install-criteria/
   - Follow official checklist

4. **Try different approach:**
   - Manual install: Chrome menu (⋮) → "Install app"
   - iPhone: Safari → Share → Add to Home Screen
   - Desktop Chrome: Address bar menu → Install

---

## 📊 **Quick Diagnostic Script**

Run in browser console to check all requirements:

```javascript
console.log('=== PWA Diagnostic ===');
console.log('Protocol:', location.protocol);
console.log('HTTPS:', location.protocol === 'https:' ? '✓' : '✗');

// Check manifest
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => {
    console.log('Manifest loaded:', m.name, m.short_name);
    console.log('Icons:', m.icons?.length);
  })
  .catch(e => console.error('Manifest failed:', e));

// Check service worker
navigator.serviceWorker.getRegistrations()
  .then(regs => {
    console.log('Service Workers:', regs.length);
    regs.forEach(r => console.log('  -', r.scope, r.active ? '✓ active' : '✗ inactive'));
  });

console.log('=== End Diagnostic ===');
```

---

**Last Updated:** July 2026  
**Status:** Comprehensive troubleshooting guide

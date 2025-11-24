# Vite Configuration: DDEV vs Localhost

## Key Differences

### **DDEV Setup** (Current Configuration)
- **Environment**: Docker containers
- **URL**: `https://newproject.ddev.site`
- **Protocol**: HTTPS (secure)
- **HMR Protocol**: `wss` (WebSocket Secure)
- **Port Exposure**: Needs ddev router configuration
- **Host**: Uses ddev site domain

### **Localhost Setup**
- **Environment**: Direct on your machine
- **URL**: `http://localhost:8000` (or `http://127.0.0.1:8000`)
- **Protocol**: HTTP (not secure)
- **HMR Protocol**: `ws` (WebSocket)
- **Port Exposure**: Direct access, no router needed
- **Host**: `localhost` or `127.0.0.1`

---

## Configuration Files

### 1. **vite.config.js** - For DDEV (Current)

```javascript
export default defineConfig({
    server: {
        host: '0.0.0.0',              // Allow external connections
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'newproject.ddev.site',  // DDEV site URL
            protocol: 'wss',               // Secure WebSocket (HTTPS)
            port: 5173,
        },
    },
    // ...
});
```

### 2. **vite.config.js** - For Localhost

```javascript
export default defineConfig({
    server: {
        host: 'localhost',             // or '127.0.0.1'
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',            // Local machine
            protocol: 'ws',               // Regular WebSocket (HTTP)
            port: 5173,
        },
    },
    // ...
});
```

---

## What to Change When Switching

### **Switching FROM DDEV TO Localhost:**

1. **Update `vite.config.js`:**
   ```javascript
   hmr: {
       host: 'localhost',        // Change from 'newproject.ddev.site'
       protocol: 'ws',            // Change from 'wss'
       port: 5173,
   },
   ```

2. **Update `.env` file:**
   ```
   APP_URL=http://localhost:8000
   ```

3. **Start Laravel server:**
   ```bash
   php artisan serve
   ```

4. **Start Vite:**
   ```bash
   npm run dev
   ```

5. **Access site:**
   - Laravel: `http://localhost:8000`
   - Vite: `http://localhost:5173`

---

### **Switching FROM Localhost TO DDEV:**

1. **Update `vite.config.js`:**
   ```javascript
   hmr: {
       host: 'newproject.ddev.site',  // Change from 'localhost'
       protocol: 'wss',               // Change from 'ws'
       port: 5173,
   },
   ```

2. **Ensure `.ddev/config.yaml` has port exposure:**
   ```yaml
   web_extra_exposed_ports:
     - name: vite
       container_port: 5173
       http_port: 5174
       https_port: 5173
   ```

3. **Start ddev:**
   ```bash
   ddev start
   ```

4. **Start Vite inside ddev:**
   ```bash
   ddev exec npm run dev
   ```

5. **Access site:**
   - Laravel: `https://newproject.ddev.site`
   - Vite: `https://newproject.ddev.site:5173`

---

## Quick Reference Table

| Setting | DDEV | Localhost |
|---------|------|-----------|
| **HMR Host** | `newproject.ddev.site` | `localhost` |
| **HMR Protocol** | `wss` | `ws` |
| **Server Host** | `0.0.0.0` | `localhost` |
| **Laravel URL** | `https://newproject.ddev.site` | `http://localhost:8000` |
| **Vite URL** | `https://newproject.ddev.site:5173` | `http://localhost:5173` |
| **Port Exposure** | Required in `.ddev/config.yaml` | Not needed |
| **SSL/HTTPS** | Yes (automatic) | No |

---

## Why These Differences?

1. **DDEV uses HTTPS** → Needs `wss` (secure WebSocket)
2. **Localhost uses HTTP** → Needs `ws` (regular WebSocket)
3. **DDEV uses domain** → Needs full domain name for HMR
4. **Localhost uses IP** → Can use `localhost` or `127.0.0.1`
5. **DDEV is containerized** → Needs port forwarding configuration
6. **Localhost is direct** → Ports accessible directly

---

## Pro Tip: Environment-Based Configuration

You can make it automatic by detecting the environment:

```javascript
const isDdev = process.env.DDEV_PROJECT || process.env.APP_ENV === 'local';

export default defineConfig({
    server: {
        host: isDdev ? '0.0.0.0' : 'localhost',
        port: 5173,
        strictPort: true,
        hmr: {
            host: isDdev ? 'newproject.ddev.site' : 'localhost',
            protocol: isDdev ? 'wss' : 'ws',
            port: 5173,
        },
    },
    // ...
});
```


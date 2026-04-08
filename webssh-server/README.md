# WebSSH Server

Companion Node.js WebSocket proxy that enables real SSH sessions from the terminal portfolio.

## How it works

```
Browser (xterm.js) ←──WebSocket──→ This server ←──SSH──→ Remote machine
```

## Local Development

```bash
cd webssh-server
npm install
node index.js
# Server starts on ws://localhost:4242/ssh
```

Then in the portfolio root, create `.env.local`:

```
VITE_WEBSSH_BACKEND_URL=ws://localhost:4242/ssh
```

Restart `npm run dev` — the `webssh` command will now open real SSH sessions.

## Deploying to Production

### Railway (recommended)

1. Push this repo to GitHub
2. Create a new Railway project → "Deploy from GitHub Repo"
3. Set **root directory** to `webssh-server/`
4. Railway auto-detects Node.js and runs `npm start`
5. Copy the generated `*.railway.app` URL (it will be `wss://...`)
6. Set `VITE_WEBSSH_BACKEND_URL=wss://your-app.railway.app/ssh` in your Vite environment

### Render

1. New Web Service → connect GitHub
2. Root Directory: `webssh-server`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Copy the `*.onrender.com` URL and configure as above

### Self-hosted VPS

```bash
git clone https://github.com/tejas20002/tejas20002.github.io
cd tejas20002.github.io/webssh-server
npm install
# Use PM2 for process management
npm install -g pm2
pm2 start index.js --name webssh-server
pm2 save
```

Configure Nginx as HTTPS/WSS reverse proxy in front of port 4242.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4242` | Port to listen on |

## Security Notes

> ⚠️ This server proxies raw SSH connections. In production:
> - Put it behind HTTPS/WSS (Nginx or Railway/Render handle this)
> - Consider adding authentication tokens to prevent abuse
> - Only expose to trusted origins (configure CORS)
> - The server itself has no authentication — SSH credentials are passed per-connection from the browser

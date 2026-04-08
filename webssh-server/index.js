const express = require('express')
const { WebSocketServer } = require('ws')
const { Client } = require('ssh2')
const http = require('http')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 4242

app.use(express.json())

// ── CORS ────────────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.1', uptime: process.uptime() })
})

app.post('/feedback', async (req, res) => {
  const { message } = req.body
  const token = process.env.TELEGRAM_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error('[feedback] Missing Telegram config in env')
    return res.status(500).json({ error: 'Feedback system not configured' })
  }

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    `🚀 New Feedback from Portfolio:\n\n${message}`
  )}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.ok) {
      console.log('[feedback] Message sent successfully')
      res.json({ success: true })
    } else {
      console.error('[feedback] Telegram Error:', data.description)
      res.status(500).json({ error: data.description })
    }
  } catch (err) {
    console.error('[feedback] Network Error:', err.message)
    res.status(500).json({ error: 'Failed to connect to Telegram' })
  }
})

// ── WebSSH WebSocket Server ──────────────────────────────────────────────────

const wss = new WebSocketServer({ server, path: '/ssh' })

wss.on('connection', (ws) => {
  console.log('[webssh] New client connected')
  let sshClient = null
  let sshStream = null
  let connected = false

  function send(obj) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(obj))
    }
  }

  ws.on('message', (rawData) => {
    let msg
    try {
      msg = JSON.parse(rawData.toString())
    } catch {
      console.error('[webssh] Invalid JSON:', rawData.toString())
      return
    }

    // ── Connect request ─────────────────────────────────────────────────────
    if (msg.type === 'connect') {
      const { host, port = 22, user, password, privateKey, cols = 80, rows = 24 } = msg

      if (!host || !user) {
        return send({ type: 'error', message: 'Missing host or user in connect request.' })
      }

      sshClient = new Client()

      sshClient.on('ready', () => {
        connected = true
        console.log(`[webssh] SSH ready: ${user}@${host}:${port}`)

        sshClient.shell({ term: 'xterm-256color', cols, rows }, (err, stream) => {
          if (err) {
            send({ type: 'error', message: `Shell error: ${err.message}` })
            return sshClient.end()
          }

          sshStream = stream

          stream.on('data', (data) => {
            send({ type: 'data', data: data.toString('utf8') })
          })

          stream.stderr.on('data', (data) => {
            send({ type: 'data', data: data.toString('utf8') })
          })

          stream.on('close', () => {
            send({ type: 'close' })
            sshClient?.end()
          })
        })
      })

      sshClient.on('error', (err) => {
        console.error(`[webssh] SSH error: ${err.message}`)
        send({ type: 'error', message: err.message })
      })

      sshClient.on('close', () => {
        send({ type: 'close' })
      })

      const connectConfig = {
        host,
        port: parseInt(port),
        username: user,
        ...(privateKey ? { privateKey } : { password: password || '' }),
        readyTimeout: 15000,
      }

      try {
        sshClient.connect(connectConfig)
      } catch (e) {
        send({ type: 'error', message: `Connection failed: ${e.message}` })
      }
      return
    }

    // ── Data (keystrokes) ───────────────────────────────────────────────────
    if (msg.type === 'data' && sshStream) {
      sshStream.write(msg.data)
      return
    }

    // ── Resize ──────────────────────────────────────────────────────────────
    if (msg.type === 'resize' && sshStream) {
      sshStream.setWindow(msg.rows, msg.cols, 0, 0)
      return
    }
  })

  ws.on('close', () => {
    console.log('[webssh] Client disconnected')
    sshStream?.end()
    sshClient?.end()
    sshClient = null
    sshStream = null
  })

  ws.on('error', (err) => {
    console.error('[webssh] WebSocket error:', err.message)
  })
})

// ── Start ────────────────────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`[webssh] Server running on ws://localhost:${PORT}/ssh`)
  console.log(`[webssh] Health check: http://localhost:${PORT}/health`)
})

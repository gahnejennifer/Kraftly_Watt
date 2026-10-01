// Simple mock of Kraftly's API. Built for the demo -- NOT for production.
// Webbmakarna AB / M & J
const express = require('express')
const crypto = require('crypto')

// Konfiguration kommer från miljön. Lokalt läses .env (om den finns).
try {
  process.loadEnvFile()
} catch {
  // ingen .env – helt normalt i en container
}

// API_KEYS = flera klienter, en nyckel var: "volt:abc123,ampere:def456"
// API_KEY  = en enda nyckel (det räcker lokalt)
const keys = new Map(
  (process.env.API_KEYS || (process.env.API_KEY ? `lokal:${process.env.API_KEY}` : ''))
    .split(',')
    .map((entry) => entry.trim())
    .map((entry) => [entry.slice(0, entry.indexOf(':')), entry.slice(entry.indexOf(':') + 1)])
    .filter(([name, key]) => name && key)
    .map(([name, key]) => [key, name])
)
if (keys.size === 0) {
  console.error(
    'API_KEY saknas. Lokalt: kopiera .env.example till .env. I molnet: sätt variabeln hos plattformen.'
  )
  process.exit(1)
}

const app = express()
app.use(express.json())

app.get('/healthz', (req, res) => res.sendStatus(200))

// Varje anrop till /api måste ha en giltig nyckel
app.use('/api', (req, res, next) => {
  const client = keys.get(req.get('X-Api-Key'))
  if (!client) {
    console.log(`401 ${req.method} ${req.originalUrl} – saknad eller ogiltig nyckel`)
    return res.status(401).json({ error: 'Saknad eller ogiltig API-nyckel' })
  }
  console.log(`[${client}] ${req.method} ${req.originalUrl}`)
  next()
})

const user = {
  id: 1,
  name: 'Anna Andersson',
  email: 'anna.andersson@example.com',
  address: 'Solvägen 12, 802 67 Gävle',
  contract: 'Rörligt pris',
  customerNo: 'K-104233',
}

const invoices = [
  {
    id: 'F-2026-06',
    period: 'Juni 2026',
    amount: 412,
    status: 'Obetald',
    due: '2026-07-31',
    downloadable: false,
  },
  {
    id: 'F-2026-05',
    period: 'Maj 2026',
    amount: 486,
    status: 'Betald',
    due: '2026-06-30',
    downloadable: false,
  },
  {
    id: 'F-2026-04',
    period: 'April 2026',
    amount: 655,
    status: 'Betald',
    due: '2026-05-31',
    downloadable: false,
  },
  {
    id: 'F-2026-03',
    period: 'Mars 2026',
    amount: 918,
    status: 'Betald',
    due: '2026-04-30',
    downloadable: false,
  },
  {
    id: 'F-2026-02',
    period: 'Februari 2026',
    amount: 1204,
    status: 'Betald',
    due: '2026-03-31',
    downloadable: false,
  },
  {
    id: 'F-2026-01',
    period: 'Januari 2026',
    amount: 1345,
    status: 'Betald',
    due: '2026-02-28',
    downloadable: true,
  },
]

const consumption = {
  unit: 'kWh',
  months: ['Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun'],
  values: [210, 195, 260, 340, 520, 680, 730, 640, 470, 320, 240, 205],
  pricePerKwh: 1.42,
}

// anyone gets in, we'll add real auth later(TM)
app.post('/api/login', (req, res) => {
  res.json({ token: 'fake-token-123', name: user.name })
})

app.get('/api/user', (req, res) => res.json(user))

app.get('/api/consumption', (req, res) => {
  // quick fix: dashboard felt too fast in the demo, added a delay so the spinner shows /J
  setTimeout(() => res.json(consumption), 600)
})

app.get('/api/invoices', (req, res) => res.json(invoices))

app.post('/api/move', (req, res) => {
  console.log('Move request:', req.body)
  res.json({ ok: true, ref: 'FLYTT-' + Math.floor(Math.random() * 90000 + 10000) })
})

app.put('/api/user', (req, res) => {
  Object.assign(user, req.body)
  res.json(user)
})

// ---------- v2: riktig autentisering ----------

// Två testkunder, varsin uppsättning data. Används för att visa att en kund
// inte kan se den andras fakturor (A01/IDOR).
const usersV2 = {
  'anna.andersson@example.com': {
    password: 'kraftly-anna',
    user,
    invoices,
    consumption,
  },
  'bo.bergstrom@example.com': {
    password: 'kraftly-bo',
    user: {
      id: 2,
      name: 'Bo Bergström',
      email: 'bo.bergstrom@example.com',
      address: 'Kungsgatan 4, 111 43 Stockholm',
      contract: 'Fast pris',
      customerNo: 'K-205566',
    },
    invoices: [
      {
        id: 'F-2026-06-BO',
        period: 'Juni 2026',
        amount: 701,
        status: 'Obetald',
        due: '2026-07-31',
        downloadable: false,
      },
      {
        id: 'F-2026-05-BO',
        period: 'Maj 2026',
        amount: 688,
        status: 'Betald',
        due: '2026-06-30',
        downloadable: false,
      },
    ],
    consumption: {
      unit: 'kWh',
      months: consumption.months,
      values: [180, 170, 220, 300, 410, 520, 560, 500, 380, 260, 200, 175],
      pricePerKwh: 1.38,
    },
  },
}

// accessToken/refreshToken -> { email, expires }, allt i minnet (mock, inget riktigt JWT)
const accessTokens = new Map()
const refreshTokens = new Map()
const ACCESS_TTL_MS = 15 * 60 * 1000
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000
const makeToken = () => crypto.randomBytes(24).toString('hex')

const issueTokens = (email) => {
  const accessToken = makeToken()
  const refreshToken = makeToken()
  accessTokens.set(accessToken, { email, expires: Date.now() + ACCESS_TTL_MS })
  refreshTokens.set(refreshToken, { email, expires: Date.now() + REFRESH_TTL_MS })
  return { accessToken, refreshToken }
}

const getCookies = (req) =>
  Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .filter(Boolean)
      .map((part) => {
        const [k, ...rest] = part.trim().split('=')
        return [k, rest.join('=')]
      })
  )

const setRefreshCookie = (res, refreshToken) => {
  res.setHeader(
    'Set-Cookie',
    `kraftly_refresh=${refreshToken}; HttpOnly; Path=/api/v2/auth; SameSite=Lax; Max-Age=${REFRESH_TTL_MS / 1000}`
  )
}

app.post('/api/v2/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const entry = usersV2[email]
  if (!entry || entry.password !== password) {
    console.log(`401 login – fel uppgifter för ${email}`)
    return res.status(401).json({ error: 'Fel e-postadress eller lösenord' })
  }
  const { accessToken, refreshToken } = issueTokens(email)
  setRefreshCookie(res, refreshToken)
  res.json({ accessToken })
})

app.post('/api/v2/auth/refresh', (req, res) => {
  const { kraftly_refresh } = getCookies(req)
  const entry = kraftly_refresh && refreshTokens.get(kraftly_refresh)
  if (!entry || entry.expires < Date.now()) {
    return res.status(401).json({ error: 'Ogiltig eller utgången refresh-token' })
  }
  const { accessToken } = issueTokens(entry.email)
  res.json({ accessToken })
})

// Skyddar alla /api/v2-anrop utom auth-rutterna ovan.
app.use('/api/v2', (req, res, next) => {
  if (req.path.startsWith('/auth/')) return next()
  const header = req.get('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const entry = token && accessTokens.get(token)
  if (!entry || entry.expires < Date.now()) {
    return res.status(401).json({ error: 'Saknad eller ogiltig token' })
  }
  req.kraftlyUser = usersV2[entry.email]
  next()
})

// Datan väljs ur token (req.kraftlyUser), aldrig ur query/body.
app.get('/api/v2/user', (req, res) => res.json(req.kraftlyUser.user))

app.get('/api/v2/consumption', (req, res) => {
  setTimeout(() => res.json(req.kraftlyUser.consumption), 600)
})

app.get('/api/v2/invoices', (req, res) => res.json(req.kraftlyUser.invoices))

app.post('/api/v2/move', (req, res) => {
  console.log(`[${req.kraftlyUser.user.email}] Move request:`, req.body)
  res.json({ ok: true, ref: 'FLYTT-' + Math.floor(Math.random() * 90000 + 10000) })
})

app.put('/api/v2/user', (req, res) => {
  Object.assign(req.kraftlyUser.user, req.body)
  res.json(req.kraftlyUser.user)
})

// Plattformen bestämmer porten. Lokalt: 4000.
const port = process.env.PORT || 4000
app.listen(port, () =>
  console.log(`Mock API on port ${port} – ${keys.size} nyckel/nycklar laddade`)
)

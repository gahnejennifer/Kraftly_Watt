// ---------- v2: riktig autentisering ----------
const crypto = require('crypto')

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

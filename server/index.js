import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

dotenv.config()


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = 'coregg_super_secret_admin'

const DISCORD_CONTACT_WEBHOOK =
  'https://discord.com/api/webhooks/1504216019961511978/ax0a-WICFMYyBXbp6rbLHbfWGuJcf3eYMb87JYgf8i8d5oPEKGHbjPljXX_YmWHY7nVK'

const uploadsPath = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true
  })
}

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(uploadsPath))

const db = new Database('database.db')

function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não enviado'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({
      error: 'Token inválido'
    })
  }
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    featured INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run()

const newsColumns = db.prepare(`PRAGMA table_info(news)`).all()

const hasFeatured = newsColumns.some((column) => column.name === 'featured')
const hasViews = newsColumns.some((column) => column.name === 'views')
const hasPosition = newsColumns.some((column) => column.name === 'position')

if (!hasFeatured) {
  db.prepare(`
    ALTER TABLE news
    ADD COLUMN featured INTEGER DEFAULT 0
  `).run()
}

if (!hasViews) {
  db.prepare(`
    ALTER TABLE news
    ADD COLUMN views INTEGER DEFAULT 0
  `).run()
}

if (!hasPosition) {
  db.prepare(`
    ALTER TABLE news
    ADD COLUMN position INTEGER DEFAULT 0
  `).run()
}

const newsWithoutPosition = db
  .prepare(`
    SELECT id
    FROM news
    WHERE position IS NULL
       OR position = 0
    ORDER BY id DESC
  `)
  .all()

if (newsWithoutPosition.length > 0) {
  newsWithoutPosition.forEach((item, index) => {
    db.prepare(`
      UPDATE news
      SET position = ?
      WHERE id = ?
    `).run(index + 1, item.id)
  })
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`).run()

const defaultSettings = {
  siteName: 'COREGG',
  siteSubtitle: 'ORGANIZAÇÃO DE E-SPORTS',
  siteDescription: 'Organização de esports, creators e GTA RP.',

  homeButtonText: 'Conheça a COREGG',
  homeButtonLink: '/creators',

  homeBannerImage: '',
  homeHighlightImage: '',

  homeHighlightTitle: '',
  homeHighlightText: '',
  homeHighlightActive: 'false',

  discordLink: '#',
  instagramLink: '#',
  tiktokLink: '#',
  youtubeLink: '#',

  contactEmail: 'contato@coregg.com.br'
}

Object.entries(defaultSettings).forEach(([key, value]) => {
  const exists = db
    .prepare('SELECT * FROM settings WHERE key = ?')
    .get(key)

  if (!exists) {
    db.prepare(`
      INSERT INTO settings (
        key,
        value
      )
      VALUES (?, ?)
    `).run(key, value)
  }
})

db.prepare(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`).run()

const adminExists = db
  .prepare('SELECT * FROM admins WHERE email = ?')
  .get('admin@coregg.com')

if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('coregg123', 10)

  db.prepare(`
    INSERT INTO admins (
      email,
      password
    )
    VALUES (?, ?)
  `).run('admin@coregg.com', hashedPassword)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath)
  },

  filename: function (req, file, cb) {
    const cleanOriginalName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.\-_]/g, '')

    const uniqueName = `${Date.now()}-${cleanOriginalName}`

    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Arquivo inválido'))
    }
  }
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body

  const admin = db
    .prepare('SELECT * FROM admins WHERE email = ?')
    .get(email)

  if (!admin) {
    return res.status(401).json({
      error: 'Usuário não encontrado'
    })
  }

  const validPassword = bcrypt.compareSync(password, admin.password)

  if (!validPassword) {
    return res.status(401).json({
      error: 'Senha inválida'
    })
  }

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )

  res.json({
    token
  })
})

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Preencha todos os campos.'
      })
    }

    const discordMessage = {
      username: 'COREGG Site',
      embeds: [
        {
          title: '📩 Novo contato recebido',
          color: 55807,
          fields: [
            {
              name: 'Nome',
              value: name,
              inline: true
            },
            {
              name: 'E-mail',
              value: email,
              inline: true
            },
            {
              name: 'Assunto',
              value: subject,
              inline: false
            },
            {
              name: 'Mensagem',
              value: message,
              inline: false
            }
          ],
          footer: {
            text: 'Formulário oficial do site COREGG'
          },
          timestamp: new Date().toISOString()
        }
      ]
    }

    const response = await fetch(DISCORD_CONTACT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordMessage)
    })

    if (!response.ok) {
      return res.status(500).json({
        error: 'Erro ao enviar para o Discord.'
      })
    }

    res.json({
      success: true
    })
  } catch {
    res.status(500).json({
      error: 'Erro interno ao enviar contato.'
    })
  }
})

app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all()

  const settings = {}

  rows.forEach((item) => {
    settings[item.key] = item.value
  })

  res.json(settings)
})

app.put('/api/settings', authAdmin, (req, res) => {
  const settings = req.body

  const update = db.prepare(`
    INSERT INTO settings (
      key,
      value
    )
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET
    value = excluded.value
  `)

  Object.entries(settings).forEach(([key, value]) => {
    update.run(key, value ?? '')
  })

  res.json({
    success: true
  })
})

app.post(
  '/api/upload/home-image',
  authAdmin,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'Imagem não enviada'
      })
    }

    res.json({
      image: `/uploads/${req.file.filename}`
    })
  }
)

app.get('/api/news', (req, res) => {
  const news = db
    .prepare(`
      SELECT *
      FROM news
      ORDER BY position ASC, id DESC
    `)
    .all()

  res.json(news)
})

app.get('/api/news/:id', (req, res) => {
  const { id } = req.params

  const news = db
    .prepare(`
      SELECT *
      FROM news
      WHERE id = ?
    `)
    .get(id)

  if (!news) {
    return res.status(404).json({
      error: 'Notícia não encontrada'
    })
  }

  db.prepare(`
    UPDATE news
    SET views = views + 1
    WHERE id = ?
  `).run(id)

  res.json({
    ...news,
    views: news.views + 1
  })
})

app.post(
  '/api/news',
  authAdmin,
  upload.single('image'),
  (req, res) => {
    const {
      title,
      category,
      description,
      content
    } = req.body

    if (!title || !category || !description || !content) {
      return res.status(400).json({
        error: 'Preencha todos os campos da notícia.'
      })
    }

    const image = req.file
      ?`/uploads/${req.file.filename}`
      : null

    const lastPosition = db
      .prepare(`
        SELECT MAX(position) as maxPosition
        FROM news
      `)
      .get()

    const position = lastPosition.maxPosition
      ? lastPosition.maxPosition + 1
      : 1

    const insert = db.prepare(`
      INSERT INTO news (
        title,
        category,
        description,
        content,
        image,
        position
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = insert.run(
      title,
      category,
      description,
      content,
      image,
      position
    )

    res.json({
      success: true,
      id: result.lastInsertRowid
    })
  }
)

app.put('/api/news/order', authAdmin, (req, res) => {
  const { news } = req.body

  if (!Array.isArray(news)) {
    return res.status(400).json({
      error: 'Lista inválida'
    })
  }

  const update = db.prepare(`
    UPDATE news
    SET position = ?
    WHERE id = ?
  `)

  news.forEach((item, index) => {
    update.run(index + 1, item.id)
  })

  res.json({
    success: true
  })
})

app.put(
  '/api/news/:id',
  authAdmin,
  upload.single('image'),
  (req, res) => {
    const { id } = req.params

    const {
      title,
      category,
      description,
      content
    } = req.body

    const currentNews = db
      .prepare('SELECT * FROM news WHERE id = ?')
      .get(id)

    if (!currentNews) {
      return res.status(404).json({
        error: 'Notícia não encontrada'
      })
    }

    if (!title || !category || !description || !content) {
      return res.status(400).json({
        error: 'Preencha todos os campos da notícia.'
      })
    }

    const image = req.file
      ?`/uploads/${req.file.filename}`
      : currentNews.image

    db.prepare(`
      UPDATE news
      SET
        title = ?,
        category = ?,
        description = ?,
        content = ?,
        image = ?
      WHERE id = ?
    `).run(
      title,
      category,
      description,
      content,
      image,
      id
    )

    res.json({
      success: true
    })
  }
)

app.delete('/api/news/:id', authAdmin, (req, res) => {
  const { id } = req.params

  db.prepare(`
    DELETE FROM news
    WHERE id = ?
  `).run(id)

  res.json({
    success: true
  })
})

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.message
    })
  }

  if (err) {
    return res.status(400).json({
      error: err.message || 'Erro interno'
    })
  }

  next()
})

app.use(express.static(path.join(__dirname, '../dist')))

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`COREGG API rodando na porta ${PORT}`)
})
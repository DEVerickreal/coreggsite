import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { fileURLToPath } from 'url'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = 'coregg_super_secret_admin'

const DISCORD_CONTACT_WEBHOOK =
  'https://discord.com/api/webhooks/1504216019961511978/ax0a-WICFMYyBXbp6rbLHbfWGuJcf3eYMb87JYgf8i8d5oPEKGHbjPljXX_YmWHY7nVK'

const db = new Database('database.db')

app.use(cors())
app.use(express.json())

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

db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`).run()

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

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: 'coregg',

    allowed_formats: [
      'jpg',
      'jpeg',
      'png',
      'webp'
    ]
  }
})

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024
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

    console.log(req.file)

    if (!req.file) {
      return res.status(400).json({
        error: 'Imagem não enviada'
      })
    }

    res.json({
      image: req.file.path
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

    console.log('=== FILE ===')
    console.log(req.file)

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
      ? req.file.path
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
      id: result.lastInsertRowid,
      image
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

    console.log('UPDATE FILE:', req.file)

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

    const image = req.file
      ? req.file.path
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
      success: true,
      image
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

  console.log(err)

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
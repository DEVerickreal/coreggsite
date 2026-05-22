import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = 'coregg_super_secret_admin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// ======================
// MONGODB
// ======================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado')
  })
  .catch((err) => {
    console.log(err)
  })

// ======================
// CLOUDINARY
// ======================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// ======================
// SCHEMAS
// ======================

const newsSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  content: String,
  image: String,
  featured: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const adminSchema = new mongoose.Schema({
  email: String,
  password: String
})

const settingsSchema = new mongoose.Schema({
  key: String,
  value: String
})

const News = mongoose.model('News', newsSchema)
const Admin = mongoose.model('Admin', adminSchema)
const Settings = mongoose.model('Settings', settingsSchema)

// ======================
// ADMIN DEFAULT
// ======================

async function createAdmin() {
  const adminExists = await Admin.findOne({
    email: 'admin@coregg.com'
  })

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('coregg123', 10)

    await Admin.create({
      email: 'admin@coregg.com',
      password: hashedPassword
    })

    console.log('Admin criado')
  }
}

createAdmin()

// ======================
// AUTH
// ======================

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

// ======================
// MULTER
// ======================

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
  storage
})

// ======================
// LOGIN
// ======================

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  const admin = await Admin.findOne({ email })

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
      id: admin._id,
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

// ======================
// NEWS
// ======================

app.get('/api/news', async (req, res) => {
  const news = await News.find().sort({
    position: 1,
    created_at: -1
  })

  res.json(news)
})

app.get('/api/news/:id', async (req, res) => {
  const news = await News.findById(req.params.id)

  if (!news) {
    return res.status(404).json({
      error: 'Notícia não encontrada'
    })
  }

  news.views += 1
  await news.save()

  res.json(news)
})

app.post(
  '/api/news',
  authAdmin,
  upload.single('image'),
  async (req, res) => {

    const {
      title,
      category,
      description,
      content
    } = req.body

    const image = req.file
      ? req.file.path
      : null

    const lastNews = await News.findOne().sort({
      position: -1
    })

    const position = lastNews
      ? lastNews.position + 1
      : 1

    const news = await News.create({
      title,
      category,
      description,
      content,
      image,
      position
    })

    res.json({
      success: true,
      news
    })
  }
)

app.put(
  '/api/news/:id',
  authAdmin,
  upload.single('image'),
  async (req, res) => {

    const news = await News.findById(req.params.id)

    if (!news) {
      return res.status(404).json({
        error: 'Notícia não encontrada'
      })
    }

    news.title = req.body.title
    news.category = req.body.category
    news.description = req.body.description
    news.content = req.body.content

    if (req.file) {
      news.image = req.file.path
    }

    await news.save()

    res.json({
      success: true
    })
  }
)

app.delete('/api/news/:id', authAdmin, async (req, res) => {
  await News.findByIdAndDelete(req.params.id)

  res.json({
    success: true
  })
})

// ======================
// FRONTEND
// ======================

app.use(express.static(path.join(__dirname, '../dist')))

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// ======================
// START
// ======================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
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

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'coregg_super_secret_admin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())

app.use(express.json())

// ======================
// NO CACHE
// ======================

app.use((req, res, next) => {

  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  )

  res.setHeader(
    'Pragma',
    'no-cache'
  )

  res.setHeader(
    'Expires',
    '0'
  )

  next()

})

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
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET
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

const News =
  mongoose.model('News', newsSchema)

const Admin =
  mongoose.model('Admin', adminSchema)

const Settings =
  mongoose.model('Settings', settingsSchema)

// ======================
// ADMIN DEFAULT
// ======================

async function createAdmin() {

  const adminExists =
    await Admin.findOne({
      email: 'admin@coregg.com'
    })

  if (!adminExists) {

    const hashedPassword =
      bcrypt.hashSync('coregg123', 10)

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

  const authHeader =
    req.headers.authorization

  if (!authHeader) {

    return res.status(401).json({
      error: 'Token não enviado'
    })

  }

  const token =
    authHeader.replace('Bearer ', '')

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

  const {
    email,
    password
  } = req.body

  const admin =
    await Admin.findOne({ email })

  if (!admin) {

    return res.status(401).json({
      error: 'Usuário não encontrado'
    })

  }

  const validPassword =
    bcrypt.compareSync(
      password,
      admin.password
    )

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
// SETTINGS
// ======================

app.get('/api/settings', async (req, res) => {

  try {

    const settings =
      await Settings.find()

    const formatted = {}

    settings.forEach((item) => {

      formatted[item.key] =
        item.value

    })

    res.json(formatted)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao buscar configurações'
    })

  }

})

app.put(
  '/api/settings',
  authAdmin,
  async (req, res) => {

    try {

      const settings = req.body

      for (const key in settings) {

        await Settings.findOneAndUpdate(

          { key },

          {
            key,
            value: settings[key]
          },

          {
            upsert: true,
            new: true
          }

        )

      }

      res.json({
        success: true
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error: 'Erro ao salvar configurações'
      })

    }

  }
)

// ======================
// UPLOAD HOME IMAGE
// ======================

app.post(
  '/api/upload/home-image',
  authAdmin,
  upload.single('image'),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: 'Imagem não enviada'
        })

      }

      res.json({
        image: req.file.path
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error: 'Erro ao enviar imagem'
      })

    }

  }
)

// ======================
// NEWS
// ======================

app.get('/api/news', async (req, res) => {

  try {

    const news = await News.find()

      .sort({
        position: 1,
        created_at: -1
      })

      .lean()

    res.json(news)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao buscar notícias'
    })

  }

})

app.get('/api/news/:id', async (req, res) => {

  try {

    const news =
      await News.findById(req.params.id)

    if (!news) {

      return res.status(404).json({
        error: 'Notícia não encontrada'
      })

    }

    news.views += 1

    await news.save()

    res.json(news)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao buscar notícia'
    })

  }

})

app.post(
  '/api/news',
  authAdmin,
  upload.single('image'),
  async (req, res) => {

    try {

      const {
        title,
        category,
        description,
        content
      } = req.body

      if (
        !title ||
        !category ||
        !description ||
        !content
      ) {

        return res.status(400).json({
          error: 'Preencha todos os campos.'
        })

      }

      const image =
        req.file
          ? req.file.path
          : null

      const totalNews =
        await News.countDocuments()

      const news = await News.create({

        title,

        category,

        description,

        content,

        image,

        position: totalNews + 1

      })

      res.json({
        success: true,
        news
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error: 'Erro ao publicar notícia'
      })

    }

  }
)

app.put(
  '/api/news/:id',
  authAdmin,
  upload.single('image'),
  async (req, res) => {

    try {

      const news =
        await News.findById(req.params.id)

      if (!news) {

        return res.status(404).json({
          error: 'Notícia não encontrada'
        })

      }

      news.title =
        req.body.title

      news.category =
        req.body.category

      news.description =
        req.body.description

      news.content =
        req.body.content

      if (req.file) {

        news.image =
          req.file.path

      }

      await news.save()

      res.json({
        success: true
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error: 'Erro ao editar notícia'
      })

    }

  }
)

app.delete(
  '/api/news/:id',
  authAdmin,
  async (req, res) => {

    try {

      await News.findByIdAndDelete(
        req.params.id
      )

      const updatedNews =
        await News.find()
          .sort({
            position: 1
          })

      for (
        let i = 0;
        i < updatedNews.length;
        i++
      ) {

        updatedNews[i].position =
          i + 1

        await updatedNews[i].save()

      }

      res.json({
        success: true
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error: 'Erro ao excluir notícia'
      })

    }

  }
)

// ======================
// NEWS ORDER
// ======================

app.put(
  '/api/news/order',
  authAdmin,
  async (req, res) => {

    try {

      const { news } = req.body

      if (!Array.isArray(news)) {

        return res.status(400).json({
          error: 'Lista inválida'
        })

      }

      for (
        let i = 0;
        i < news.length;
        i++
      ) {

        await News.findByIdAndUpdate(

          news[i].id,

          {
            position: i + 1
          }

        )

      }

      const reorderedNews =
        await News.find()
          .sort({
            position: 1
          })

      res.json({
        success: true,
        news: reorderedNews
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error: 'Erro ao salvar ordem'
      })

    }

  }
)

// ======================
// CONTACT / DISCORD
// ======================

app.post('/api/contact', async (req, res) => {

  try {

    const {
      name,
      email,
      subject,
      message
    } = req.body

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {

      return res.status(400).json({
        error: 'Preencha todos os campos'
      })

    }

    const webhookURL =
      process.env.DISCORD_WEBHOOK_URL

    if (!webhookURL) {

      return res.status(500).json({
        error: 'Webhook não configurado'
      })

    }

    const discordMessage = {

      embeds: [

        {

          title:
            '📩 Novo contato recebido',

          color: 65535,

          fields: [

            {
              name: '👤 Nome',
              value: name
            },

            {
              name: '📧 Email',
              value: email
            },

            {
              name: '📌 Assunto',
              value: subject
            },

            {
              name: '📝 Mensagem',
              value: message
            }

          ],

          footer: {
            text: 'COREGG Website'
          },

          timestamp:
            new Date().toISOString()

        }

      ]

    }

    const response =
      await fetch(
        webhookURL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify(
            discordMessage
          )
        }
      )

    if (!response.ok) {

      return res.status(500).json({
        error: 'Erro ao enviar webhook'
      })

    }

    res.json({
      success: true
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao enviar contato'
    })

  }

})

// ======================
// FRONTEND
// ======================

app.use(
  express.static(
    path.join(__dirname, '../dist'),
    {
      etag: false,
      lastModified: false
    }
  )
)

app.use((req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      '../dist/index.html'
    )
  )

})

// ======================
// START
// ======================

app.listen(PORT, '0.0.0.0', () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  )

})
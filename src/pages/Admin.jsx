import '../styles/admin.css'

import { useEffect, useState } from 'react'

import Home from './Home'

import API_URL from '../api'

function Admin({ adminSection }) {

  const token = localStorage.getItem('coregg_token')

  const [news, setNews] = useState([])

  const [settings, setSettings] = useState({
    siteName: '',
    siteSubtitle: '',
    siteDescription: '',
    homeButtonText: '',
    homeButtonLink: '',
    homeBannerImage: '',
    discordLink: '',
    instagramLink: '',
    tiktokLink: '',
    youtubeLink: '',
    contactEmail: ''
  })

  const [editingId, setEditingId] = useState(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)

  const [homeBannerFile, setHomeBannerFile] =
    useState(null)

  async function loadSettings() {

    try {

      const response = await fetch(
        `${API_URL}/api/settings?t=${Date.now()}`,
        {
          cache: 'no-store'
        }
      )

      const data = await response.json()

      setSettings({
        siteName: data.siteName || 'COREGG',

        siteSubtitle:
          data.siteSubtitle ||
          'ORGANIZAÇÃO DE E-SPORTS',

        siteDescription:
          data.siteDescription || '',

        homeButtonText:
          data.homeButtonText ||
          'Conheça a COREGG',

        homeButtonLink:
          data.homeButtonLink ||
          '/creators',

        homeBannerImage:
          data.homeBannerImage || '',

        discordLink:
          data.discordLink || '',

        instagramLink:
          data.instagramLink || '',

        tiktokLink:
          data.tiktokLink || '',

        youtubeLink:
          data.youtubeLink || '',

        contactEmail:
          data.contactEmail || ''
      })

    } catch (error) {

      console.error(error)

    }

  }

  async function loadNews() {

    try {

      const response = await fetch(
        `${API_URL}/api/news?t=${Date.now()}`,
        {
          cache: 'no-store'
        }
      )

      const data = await response.json()

      if (Array.isArray(data)) {
        setNews(data)
      }

    } catch (error) {

      console.error(error)

    }

  }

  useEffect(() => {

    loadSettings()
    loadNews()

  }, [])

  function clearForm() {

    setEditingId(null)

    setTitle('')
    setCategory('')
    setDescription('')
    setContent('')
    setImage(null)

  }

  function startEdit(item) {

    setEditingId(item._id)

    setTitle(item.title || '')
    setCategory(item.category || '')
    setDescription(item.description || '')
    setContent(item.content || '')

    setImage(null)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }

  async function uploadHomeImage(file) {

    const formData = new FormData()

    formData.append('image', file)

    const response = await fetch(
      `${API_URL}/api/upload/home-image`,
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${token}`
        },

        body: formData
      }
    )

    const data = await response.json()

    if (!response.ok) {

      throw new Error(
        data.error || 'Erro ao enviar imagem'
      )

    }

    return data.image

  }

  async function saveHomeBanner(e) {

    e.preventDefault()

    try {

      let updatedSettings = {
        ...settings
      }

      if (homeBannerFile) {

        const uploadedImage =
          await uploadHomeImage(homeBannerFile)

        updatedSettings = {
          ...updatedSettings,
          homeBannerImage:
            uploadedImage
        }

      }

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(
            updatedSettings
          )
        }
      )

      const data = await response.json()

      if (!response.ok) {

        alert(
          data.error ||
          'Erro ao salvar banner'
        )

        return

      }

      setSettings(updatedSettings)

      setHomeBannerFile(null)

      alert('Banner atualizado!')

    } catch (error) {

      alert(error.message)

    }

  }

  async function resetHomeBanner() {

    try {

      const updatedSettings = {
        ...settings,
        homeBannerImage: ''
      }

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(
            updatedSettings
          )
        }
      )

      const data = await response.json()

      if (!response.ok) {

        alert(
          data.error ||
          'Erro ao resetar banner'
        )

        return

      }

      setSettings(updatedSettings)

      alert('Banner restaurado!')

    } catch (error) {

      console.error(error)

    }

  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      const formData = new FormData()

      formData.append('title', title)
      formData.append('category', category)

      formData.append(
        'description',
        description
      )

      formData.append(
        'content',
        content
      )

      if (image) {
        formData.append('image', image)
      }

      let response

      if (editingId) {

        response = await fetch(
          `${API_URL}/api/news/${editingId}`,
          {
            method: 'PUT',

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        )

      } else {

        response = await fetch(
          `${API_URL}/api/news`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        )

      }

      const data = await response.json()

      if (!response.ok) {

        alert(
          data.error ||
          'Erro ao salvar notícia'
        )

        return

      }

      alert(
        editingId
          ? 'Notícia atualizada!'
          : 'Notícia publicada!'
      )

      clearForm()

      await loadNews()

    } catch (error) {

      console.error(error)

      alert('Erro ao salvar notícia')

    }

  }

  async function deleteNews(id) {

    const confirmDelete = window.confirm(
      'Deseja excluir esta notícia?'
    )

    if (!confirmDelete) return

    try {

      const response = await fetch(
        `${API_URL}/api/news/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {

        alert(
          data.error ||
          'Erro ao excluir notícia'
        )

        return

      }

      await loadNews()

      alert('Notícia excluída!')

    } catch (error) {

      console.error(error)

      alert('Erro ao excluir notícia')

    }

  }

  async function saveNewsOrder(
    updatedNews
  ) {

    try {

      const response = await fetch(
        `${API_URL}/api/news/order`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            news: updatedNews.map(
              (item, index) => ({
                id: item._id,
                position: index + 1
              })
            )
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        alert(
          data.error ||
          'Erro ao salvar ordem'
        )

        return false

      }

      return true

    } catch (error) {

      console.error(error)

      return false

    }

  }

  async function moveNews(
    index,
    direction
  ) {

    const updatedNews = [...news]

    if (
      direction === 'up' &&
      index > 0
    ) {

      [
        updatedNews[index],
        updatedNews[index - 1]
      ] = [
        updatedNews[index - 1],
        updatedNews[index]
      ]

    }

    if (
      direction === 'down' &&
      index < updatedNews.length - 1
    ) {

      [
        updatedNews[index],
        updatedNews[index + 1]
      ] = [
        updatedNews[index + 1],
        updatedNews[index]
      ]

    }

    setNews(updatedNews)

    const success =
      await saveNewsOrder(updatedNews)

    if (success) {

      await loadNews()

    }

  }

  return (
    <div className="adminPage">

      {/* restante do JSX continua igual */}

    </div>
  )

}

export default Admin
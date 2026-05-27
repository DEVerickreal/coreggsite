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
            (item) => ({
              id: item._id
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

      {adminSection === 'dashboard' && (
        <div className="adminBox">

          <div className="adminBoxHeader">
            <h3>Dashboard</h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit,minmax(220px,1fr))',
              gap: '20px'
            }}
          >

            <div className="adminStatsCard">
              <h2>{news.length}</h2>
              <p>Total de notícias</p>
            </div>

            <div className="adminStatsCard">
              <h2>
                {
                  news.filter(
                    (item) =>
                      item.featured === 1
                  ).length
                }
              </h2>

              <p>Notícias destaque</p>
            </div>

            <div className="adminStatsCard">
              <h2>
                {news.reduce(
                  (acc, item) =>
                    acc +
                    (item.views || 0),
                  0
                )}
              </h2>

              <p>Total de visualizações</p>
            </div>

          </div>

        </div>
      )}

      {adminSection === 'settings' && (
        <div className="adminBox">

          <div className="adminBoxHeader">
            <h3>Home / Destaques</h3>
          </div>

          <form
            className="adminForm"
            onSubmit={saveHomeBanner}
          >

            <input
              type="text"
              placeholder="Nome do site"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  siteName:
                    e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Subtítulo"
              value={
                settings.siteSubtitle
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  siteSubtitle:
                    e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Texto do botão"
              value={
                settings.homeButtonText
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homeButtonText:
                    e.target.value
                })
              }
            />

            <label className="customUpload">

              <span>
                {homeBannerFile
                  ? homeBannerFile.name
                  : 'Selecionar banner'}
              </span>

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setHomeBannerFile(
                    e.target.files[0]
                  )
                }
              />

            </label>

            <button type="submit">
              Salvar alterações
            </button>

            <button
              type="button"
              className="cancelEditButton"
              onClick={
                resetHomeBanner
              }
            >
              Restaurar banner
            </button>

          </form>

        </div>
      )}

      {adminSection === 'preview' && (
        <div className="adminBox">

          <div className="adminBoxHeader">
            <h3>Prévia do site</h3>
          </div>

          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border:
                '1px solid rgba(255,255,255,.08)'
            }}
          >
            <Home />
          </div>

        </div>
      )}

      {adminSection === 'news' && (
        <div className="adminGrid">

          <div className="adminLeft">

            <div className="adminBox">

              <div className="adminBoxHeader">
                <h3>
                  {editingId
                    ? 'Editar notícia'
                    : 'Nova notícia'}
                </h3>
              </div>

              <form
                className="adminForm"
                onSubmit={handleSubmit}
              >

                <input
                  type="text"
                  placeholder="Título"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Categoria"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  required
                />

                <textarea
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  required
                />

                <textarea
                  placeholder="Conteúdo"
                  value={content}
                  onChange={(e) =>
                    setContent(
                      e.target.value
                    )
                  }
                  required
                />

                <label className="customUpload">

                  <span>
                    {image
                      ? image.name
                      : 'Selecionar imagem'}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setImage(
                        e.target.files[0]
                      )
                    }
                  />

                </label>

                <button type="submit">
                  {editingId
                    ? 'Salvar alterações'
                    : 'Publicar notícia'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancelEditButton"
                    onClick={
                      clearForm
                    }
                  >
                    Cancelar edição
                  </button>
                )}

              </form>

            </div>

          </div>

          <div className="adminRight">

            <div className="adminBox">

              <div className="adminNewsList">

                {news.map(
                  (item, index) => (
                    <div
                      key={item._id}
                      className="adminNewsItem"
                    >

                      <img
                        src={
                          item.image
                            ? item.image
                            : '/favicon.png'
                        }
                        alt={
                          item.title
                        }
                      />

                      <div className="adminNewsInfo">

                        <span>
                          {
                            item.category
                          }
                        </span>

                        <h4>
                          {
                            item.title
                          }
                        </h4>

                        <p>
                          {
                            item.description
                          }
                        </p>

                      </div>

                      <div className="adminNewsActions">

                     <button
  className="moveButton"
  type="button"
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()

    moveNews(index, 'up')
  }}
>
  ↑
</button>

<button
  className="moveButton"
  type="button"
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()

    moveNews(index, 'down')
  }}
>
  ↓
</button>
                        <button
                          className="editButton"
                          type="button"
                          onClick={() =>
                            startEdit(
                              item
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="deleteButton"
                          type="button"
                          onClick={() =>
                            deleteNews(
                              item._id
                            )
                          }
                        >
                          Excluir
                        </button>

                      </div>

                    </div>
                  )
                )}

                {news.length === 0 && (
                  <div className="adminEmpty">
                    Nenhuma notícia cadastrada.
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )

}

export default Admin
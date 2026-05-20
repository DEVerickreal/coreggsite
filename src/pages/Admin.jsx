import '../styles/admin.css'

import { useEffect, useState } from 'react'

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
  const [homeBannerFile, setHomeBannerFile] = useState(null)

  async function loadSettings() {
    const response = await fetch(`${API_URL}/api/settings`)
    const data = await response.json()

    setSettings({
      siteName: data.siteName || 'COREGG',
      siteSubtitle: data.siteSubtitle || 'ORGANIZAÇÃO DE E-SPORTS',
      siteDescription: data.siteDescription || '',
      homeButtonText: data.homeButtonText || 'Conheça a COREGG',
      homeButtonLink: data.homeButtonLink || '/creators',
      homeBannerImage: data.homeBannerImage || '',
      discordLink: data.discordLink || '',
      instagramLink: data.instagramLink || '',
      tiktokLink: data.tiktokLink || '',
      youtubeLink: data.youtubeLink || '',
      contactEmail: data.contactEmail || ''
    })
  }

  async function loadNews() {
    const response = await fetch(`${API_URL}/api/news`)
    const data = await response.json()

    setNews(data)
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
    setEditingId(item.id)

    setTitle(item.title)
    setCategory(item.category)
    setDescription(item.description)
    setContent(item.content)

    setImage(null)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function uploadHomeImage(file) {
    const formData = new FormData()

    formData.append('image', file)

    const response = await fetch('${API_URL}/api/upload/home-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao enviar imagem')
    }

    return data.image
  }

  async function saveHomeBanner(e) {
    e.preventDefault()

    try {
      let updatedSettings = { ...settings }

      if (homeBannerFile) {
        const uploadedImage = await uploadHomeImage(homeBannerFile)

        updatedSettings = {
          ...updatedSettings,
          homeBannerImage: uploadedImage
        }
      }

      const response = await fetch('${API_URL}/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedSettings)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Erro ao salvar banner')
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
    const updatedSettings = {
      ...settings,
      homeBannerImage: ''
    }

    const response = await fetch('${API_URL}/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedSettings)
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || 'Erro ao resetar banner')
      return
    }

    setSettings(updatedSettings)

    alert('Banner restaurado!')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()

    formData.append('title', title)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('content', content)

    if (image) {
      formData.append('image', image)
    }

    let response

    if (editingId) {
      response = await fetch(`${API_URL}/api/news/${editingId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
    } else {
      response = await fetch('${API_URL}/api/news', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
    }

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || 'Erro ao salvar notícia')
      return
    }

    alert(
      editingId
        ? 'Notícia atualizada!'
        : 'Notícia publicada!'
    )

    clearForm()

    await loadNews()
  }

  async function deleteNews(id) {
    const confirmDelete = window.confirm(
      'Deseja excluir esta notícia?'
    )

    if (!confirmDelete) return

    const response = await fetch(`${API_URL}/api/news/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || 'Erro ao excluir notícia')
      return
    }

    await loadNews()

    alert('Notícia excluída!')
  }

  async function saveNewsOrder(updatedNews) {
    await fetch('${API_URL}/api/news/order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        news: updatedNews
      })
    })
  }

  async function moveNews(index, direction) {
    const updatedNews = [...news]

    if (direction === 'up' && index > 0) {
      ;[updatedNews[index], updatedNews[index - 1]] = [
        updatedNews[index - 1],
        updatedNews[index]
      ]
    }

    if (direction === 'down' && index < updatedNews.length - 1) {
      ;[updatedNews[index], updatedNews[index + 1]] = [
        updatedNews[index + 1],
        updatedNews[index]
      ]
    }

    setNews(updatedNews)

    await saveNewsOrder(updatedNews)
  }

  return (
    <div className="adminPage">
      {adminSection === 'dashboard' && (
        <div className="adminStats">
          <div className="adminStatCard">
            <span>Total de notícias</span>
            <h2>{news.length}</h2>
          </div>

          <div className="adminStatCard">
            <span>Status</span>
            <h2>ONLINE</h2>
          </div>

          <div className="adminStatCard">
            <span>Sistema</span>
            <h2>CMS PREMIUM</h2>
          </div>
        </div>
      )}

      {adminSection === 'settings' && (
        <div className="adminGrid">
          <div className="adminBox">
            <div className="adminBoxHeader">
              <h3>Banner da Home</h3>
            </div>

            <form
              className="adminForm"
              onSubmit={saveHomeBanner}
            >
              <label className="customUpload">
                <span>
                  {homeBannerFile
                    ? homeBannerFile.name
                    : 'Selecionar banner'}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setHomeBannerFile(e.target.files[0])
                  }
                />
              </label>

              <button type="submit">
                Salvar banner
              </button>

              <button
                type="button"
                className="cancelEditButton"
                onClick={resetHomeBanner}
              >
                Restaurar padrão
              </button>
            </form>

            <div className="adminBannerPreview">
              {homeBannerFile ? (
                <img
                  src={URL.createObjectURL(homeBannerFile)}
                  alt="preview"
                />
              ) : settings.homeBannerImage ? (
                <img
                  src={settings.homeBannerImage}
                  alt="banner"
                />
              ) : (
                <div className="adminEmpty">
                  Banner padrão do site.
                </div>
              )}
            </div>
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
                    setTitle(e.target.value)
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Categoria"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                />

                <textarea
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  required
                />

                <textarea
                  placeholder="Conteúdo"
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
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
                      setImage(e.target.files[0])
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
                    onClick={clearForm}
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
                {news.map((item, index) => (
                  <div
                    key={item.id}
                    className="adminNewsItem"
                  >
                    <img
                      src={
                        item.image
                          ? item.image
                          : '/favicon.png'
                      }
                      alt={item.title}
                    />

                    <div className="adminNewsInfo">
                      <span>{item.category}</span>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>

                    <div className="adminNewsActions">
                      <button
                        className="moveButton"
                        type="button"
                        onClick={() =>
                          moveNews(index, 'up')
                        }
                      >
                        ↑
                      </button>

                      <button
                        className="moveButton"
                        type="button"
                        onClick={() =>
                          moveNews(index, 'down')
                        }
                      >
                        ↓
                      </button>

                      <button
                        className="editButton"
                        type="button"
                        onClick={() => startEdit(item)}
                      >
                        Editar
                      </button>

                      <button
                        className="deleteButton"
                        type="button"
                        onClick={() =>
                          deleteNews(item.id)
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}

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

      {adminSection === 'preview' && (
        <div className="adminBox">
          <iframe
            className="adminPreview"
            src="/"
            title="COREGG Preview"
          />
        </div>
      )}
    </div>
  )
}

export default Admin
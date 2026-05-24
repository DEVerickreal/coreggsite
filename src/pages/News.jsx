import { useEffect, useState } from 'react'

import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import NewsCard from '../components/NewsCard'

import API_URL from '../api'

function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

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
      console.error(
        'Erro ao carregar notícias:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [])

  return (
    <PageTransition>
      <div className="newsPage">
        <Reveal>
          <div className="newsHeader">
            <h1>Notícias</h1>

            <p>
              Acompanhe os principais anúncios,
              novidades e atualizações da COREGG.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <p style={{ textAlign: 'center' }}>
            Carregando notícias...
          </p>
        ) : (
          <div className="newsPageGrid">
            {news.map((item, index) => (
              <Reveal
                key={item._id}
                delay={index * 0.12}
              >
                <NewsCard
                  id={item._id}
                  title={item.title}
                  category={item.category}
                  description={item.description}
                  date={item.created_at}
                  image={
                    item.image
                      ? item.image
                      : '/favicon.png'
                  }
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default News
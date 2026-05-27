import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import NewsCard from '../components/NewsCard'

import heroImage from '../assets/hero.png'

import API_URL from '../api'

function Home() {

  const [news, setNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)

  const [settings, setSettings] = useState({
    siteName: 'COREGG',
    siteSubtitle: 'ORGANIZAÇÃO DE E-SPORTS',
    homeButtonText: 'Conheça a COREGG',
    homeBannerImage: ''
  })

  async function loadSettings() {

    try {

      const response = await fetch(
        `${API_URL}/api/settings`,
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

        homeButtonText:
          data.homeButtonText ||
          'Conheça a COREGG',

        homeBannerImage:
          data.homeBannerImage || ''
      })

    } catch (error) {

      console.log(error)

    }

  }

  async function loadNews() {

    try {

      setLoadingNews(true)

      const response = await fetch(
        `${API_URL}/api/news`,
        {
          cache: 'no-store'
        }
      )

      const data = await response.json()

      if (Array.isArray(data)) {

        const orderedNews = data.sort(
          (a, b) => a.position - b.position
        )

        setNews(orderedNews.slice(0, 9))

      } else {

        setNews([])

      }

    } catch (error) {

      console.log(error)
      setNews([])

    } finally {

      setLoadingNews(false)

    }

  }

  useEffect(() => {

    loadSettings()
    loadNews()

  }, [])

  return (

    <PageTransition>

      <div>

        <section className="hero">

          <img
            src={
              settings.homeBannerImage
                ? settings.homeBannerImage
                : heroImage
            }
            alt="COREGG"
            className="heroImage"
          />

          <div className="overlay"></div>

          <div className="heroContent">

            <Reveal>
              <span className="heroMiniTitle">
                {settings.siteSubtitle}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h1>{settings.siteName}</h1>
            </Reveal>

            <Reveal delay={0.3}>

              <a
                href="/creators"
                className="heroButton"
              >

                <img
                  src="/favicon.png"
                  alt="COREGG"
                  className="heroButtonLogo"
                />

                {settings.homeButtonText ||
                  'Conheça a COREGG'}

              </a>

            </Reveal>

          </div>

        </section>

        <section className="homeNewsSection">

          <Reveal>

            <div className="homeSectionHeader">

              <span>NOVIDADES</span>

              <div>

                <h2>Últimas notícias</h2>

                <p>
                  Fique por dentro dos principais
                  anúncios, projetos e atualizações
                  da COREGG.
                </p>

              </div>

              <Link to="/news">
                Ver todas
              </Link>

            </div>

          </Reveal>

          {loadingNews ? (

            <div className="homeEmptyNews">
              Carregando notícias...
            </div>

          ) : news.length > 0 ? (

            <div className="homeNewsGrid">

              {news.map((item, index) => (

                <Reveal
                  key={item._id}
                  delay={index * 0.08}
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

          ) : (

            <div className="homeEmptyNews">
              Nenhuma notícia publicada ainda.
            </div>

          )}

        </section>

      </div>

    </PageTransition>

  )
}

export default Home
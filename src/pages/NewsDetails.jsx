import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import PageTransition from '../components/PageTransition'
import NewsCard from '../components/NewsCard'

import API_URL from '../api'

function NewsDetails() {
  const { id } = useParams()

  const [news, setNews] = useState([])
  const [article, setArticle] = useState(null)

  function formatDate(value) {
    if (!value) return ''

    return new Date(value).toLocaleDateString('pt-BR')
  }

  async function loadNews() {
    const response = await fetch(`${API_URL}/api/news`)
    const data = await response.json()

    setNews(data)

    const selectedArticle = data.find(
      (item) => String(item.id) === String(id)
    )

    setArticle(selectedArticle)
  }

  useEffect(() => {
    loadNews()
  }, [id])

  if (!article) {
    return (
      <PageTransition>
        <div className="newsDetailsPage">
          <h1>Notícia não encontrada</h1>

          <Link to="/news" className="heroButton">
            Voltar para notícias
          </Link>
        </div>
      </PageTransition>
    )
  }

  const relatedNews = news
    .filter((item) => item.id !== article.id)
    .slice(0, 4)

  return (
    <PageTransition>
      <div className="newsDetailsPage">
        <section className="newsDetailsHero">
          <img
           src={
  article.image
    ? article.image
    : '/favicon.png'
}
            alt={article.title}
          />

          <div className="newsDetailsOverlay"></div>

          <div className="newsDetailsHeroContent">
            <span>{article.category}</span>

            <h1>{article.title}</h1>

            <p>
              {formatDate(article.created_at)}
            </p>
          </div>
        </section>

        <article className="newsArticle">
          <p className="newsArticleDescription">
            {article.description}
          </p>

      <div className="noticia-texto">
  {article.content}
</div>
  
        </article>

        {relatedNews.length > 0 && (
          <section className="relatedNews">
            <h2>Relacionados</h2>

            <div className="relatedNewsGrid">
              {relatedNews.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
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
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  )
}

export default NewsDetails
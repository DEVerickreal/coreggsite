import { Link } from 'react-router-dom'

function NewsCard({ id, title, category, description, image, date }) {
  function formatDate(value) {
    if (!value) return ''

    return new Date(value).toLocaleDateString('pt-BR')
  }

  function limitText(text, limit = 170) {
    if (!text) return ''

    if (text.length <= limit) {
      return text
    }

    return text.slice(0, limit) + '...'
  }

  return (
    <Link to={`/news/${id}`} className="newsCard">
      <img src={image} alt={title} />

      <div className="newsContent">
        <span>{category}</span>

        <small className="newsDate">
          {formatDate(date)}
        </small>

        <h3>{title}</h3>

        <p>{limitText(description)}</p>
      </div>
    </Link>
  )
}

export default NewsCard
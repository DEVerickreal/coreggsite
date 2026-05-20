import { Link } from 'react-router-dom'

import PageTransition from '../components/PageTransition'

function NotFound() {
  return (
    <PageTransition>
      <div className="notFoundPage">
        <span>404</span>

        <h1>Página não encontrada</h1>

        <p>
          A página que você tentou acessar não existe ou foi movida.
        </p>

        <Link to="/" className="heroButton">
          Voltar para Home
        </Link>
      </div>
    </PageTransition>
  )
}

export default NotFound
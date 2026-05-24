import { useEffect } from 'react'
import {
  useNavigate,
  useLocation
} from 'react-router-dom'

function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.title = 'PainelAdm COREGG'
  }, [])

  function handleLogout() {
    localStorage.removeItem('coregg_token')
    navigate('/login')
  }

  const adminSection =
    location.pathname === '/admin/news'
      ? 'news'
      : location.pathname === '/admin/settings'
      ? 'settings'
      : location.pathname === '/admin/preview'
      ? 'preview'
      : 'dashboard'

  return (
    <div className="adminLayout">
      <aside className="adminSidebar">
        <div className="adminBrand">
          <div className="adminLogoMark">
            CC
          </div>

          <div>
            <h2>COREGG</h2>
            <span>Admin Center</span>
          </div>
        </div>

        <div className="adminUserBox">
          <div className="adminUserAvatar">
            EA
          </div>

          <div>
            <strong>Erick Almeida</strong>
            <span>Founder & CEO</span>
          </div>
        </div>

        <nav className="adminNav">
          <button
            className={
              adminSection === 'dashboard'
                ? 'activeAdmin'
                : ''
            }
            onClick={() =>
              navigate('/admin/dashboard')
            }
          >
            <span>01</span>
            Dashboard
          </button>

          <button
            className={
              adminSection === 'news'
                ? 'activeAdmin'
                : ''
            }
            onClick={() =>
              navigate('/admin/news')
            }
          >
            <span>02</span>
            Notícias
          </button>

          <button
            className={
              adminSection === 'settings'
                ? 'activeAdmin'
                : ''
            }
            onClick={() =>
              navigate('/admin/settings')
            }
          >
            <span>03</span>
            Home / Destaques
          </button>

          <button
            className={
              adminSection === 'preview'
                ? 'activeAdmin'
                : ''
            }
            onClick={() =>
              navigate('/admin/preview')
            }
          >
            <span>04</span>
            Prévia do site
          </button>
        </nav>

        <div className="adminSidebarFooter">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="adminViewSite"
          >
            Ver site oficial
          </a>

          <button
            className="logoutButton"
            onClick={handleLogout}
          >
            Sair do painel
          </button>
        </div>
      </aside>

      <main className="adminContent">
        <div className="adminTopbar">
          <div>
            <span>
              PAINEL ADMINISTRATIVO
            </span>

            <h1>Central COREGG</h1>
          </div>

          <div className="adminSystemStatus">
            <span></span>
            Sistema online
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}

export default AdminLayout
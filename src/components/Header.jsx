import { useState } from 'react'
import { Link } from 'react-router-dom'

import { FaDiscord, FaBars, FaTimes } from 'react-icons/fa'

const logo = '/logocoregg.png'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  function closeMenu() {
    setMobileOpen(false)
  }

  return (
    <header className="header">
      <div className="headerGlow"></div>

      <Link to="/" className="logoArea" onClick={closeMenu}>
        <img
          src={logo}
          alt="COREGG"
          className="headerLogo"
        />
      </Link>

      <nav className="menu">
        <Link to="/">Home</Link>
        <Link to="/news">Notícias</Link>
        <Link to="/teams">Times</Link>
        <Link to="/creators">Quem Somos</Link>
        <Link to="/partners">Parceiros</Link>
        <Link to="/contact">Contato</Link>
      </nav>

      <a
        href="https://discord.gg/xvfCnn4tVF"
        target="_blank"
        rel="noreferrer"
        className="discordButton"
      >
        <FaDiscord />
        Discord
      </a>

      <button
        type="button"
        className="mobileButton"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={mobileOpen ? 'mobileMenu active' : 'mobileMenu'}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/news" onClick={closeMenu}>
          Notícias
        </Link>

        <Link to="/teams" onClick={closeMenu}>
          Times
        </Link>

        <Link to="/creators" onClick={closeMenu}>
          Quem Somos
        </Link>

        <Link to="/partners" onClick={closeMenu}>
          Parceiros
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contato
        </Link>

        <a
          href="https://discord.gg/xvfCnn4tVF"
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          Discord
        </a>
      </nav>
    </header>
  )
}

export default Header
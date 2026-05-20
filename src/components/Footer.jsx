import { Link } from 'react-router-dom'

import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaDiscord
} from 'react-icons/fa'

const logo = '/logocoregg.png'

function Footer() {
  return (
    <footer className="footerModern">
      <div className="footerLogoArea">
        <img
          src={logo}
          alt="COREGG"
        />

        <div className="footerSocials">
          <a
            href="https://www.instagram.com/crazzycoregg/"
            target="_blank"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.tiktok.com/@crazzycoregg"
            target="_blank"
          >
            <FaTiktok />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
          >
            <FaYoutube />
          </a>

          <a
            href="https://discord.gg/GMubgSXdpD"
            target="_blank"
          >
            <FaDiscord />
          </a>
        </div>
      </div>

      <div className="footerLinks">
        <Link to="/">
          HOME
        </Link>

        <Link to="/news">
          NOTÍCIAS
        </Link>

        <Link to="/teams">
          TIMES
        </Link>

        <Link to="/creators">
          QUEM SOMOS
        </Link>

        <Link to="/partners">
          PARCEIROS
        </Link>

        <Link to="/contact">
          CONTATO
        </Link>
      </div>

      <div className="footerBottom">
        © 2026 COREGG — TODOS OS DIREITOS RESERVADOS
      </div>
    </footer>
  )
}

export default Footer
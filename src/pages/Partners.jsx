import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'

import ifynnaLogo from '../assets/ifynna.png'
import maisVidaLogo from '../assets/maisvida.png'

function Partners() {
  return (
    <PageTransition>
      <div className="partnersPage">
        <Reveal>
          <div className="partnersHeader">
            <h1>Parceiros</h1>

            <p>
              Marcas e projetos que caminham junto com a COREGG.
            </p>
          </div>
        </Reveal>

        {/* IFYNNA */}
        <Reveal delay={0.1}>
          <div className="partnerHeroCard">
            <div className="partnerHeroContent">
              <span className="partnerBadge">
                Parceira Oficial
              </span>

              <h2>IFYNNA</h2>

              <h3>
                Parceira oficial da COREGG
              </h3>

              <p>
                A IFYNNA chega para fortalecer a expansão da
                COREGG através de inovação, suporte e novas
                oportunidades para a comunidade.
              </p>

              <a
                href="https://www.instagram.com/ifynnastore/"
                target="_blank"
                rel="noreferrer"
                className="partnerButton"
              >
                Conhecer parceiro
              </a>
            </div>

            <div className="partnerHeroLogo">
              <img
                src={ifynnaLogo}
                alt="IFYNNA"
              />
            </div>
          </div>
        </Reveal>

        {/* Projeto Mais Vida */}
        <Reveal delay={0.2}>
          <div className="partnerHeroCard">
            <div className="partnerHeroContent">
              <span className="partnerBadge">
                Parceira Oficial
              </span>

              <h2>MAIS VIDA</h2>

              <h3>
                Transformando vidas através do esporte
              </h3>

              <p>
                O Projeto MAIS VIDA oferece aulas de
                Jiu-Jitsu para crianças, adolescentes,
                jovens e adultos da comunidade.
                Tudo isso de forma 100% gratuita,
                promovendo inclusão, disciplina e
                novas oportunidades para todos.
              </p>

              <a
                href="https://www.instagram.com/projeto.maisvida/"
                target="_blank"
                rel="noreferrer"
                className="partnerButton"
              >
                Conhecer projeto
              </a>
            </div>

            <div className="partnerHeroLogo">
              <img
                src={maisVidaLogo}
                alt="Projeto Mais Vida"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}

export default Partners
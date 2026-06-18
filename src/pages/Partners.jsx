import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'

import exitlagLogo from '../assets/exitlag.png'
import ifynnaLogo from '../assets/ifynna.png'
import paraibadocorte from '../assets/paraibadocorte.png'
import maisVidaLogo from '../assets/maisvida.png'

import API_URL from '../api'

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

        {/* EXITLAG */}
<Reveal delay={0.05}>
  <div className="partnerHeroCard">
    <div className="partnerHeroContent">
      <span className="partnerBadge">
        Patrocinadora Principal
      </span>

      <h2>EXITLAG</h2>

      <h3>  
        Parceira oficial da COREGG
      </h3>

      <p>
        A ExitLag é referência mundial em otimização de conexão
        para jogos online, oferecendo menor latência, maior
        estabilidade e melhor desempenho competitivo para
        jogadores e organizações de e-sports.
      </p>

      <a
        href="https://www.instagram.com/exitlagbrasil/"
        target="_blank"
        rel="noreferrer"
        className="partnerButton"
      >
        Conhecer parceiro
      </a>
    </div>

    <div className="partnerHeroLogo">
      <img
        src={exitlagLogo}
        alt="ExitLag"
      />
    </div>
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
{/* PARAÍBA DO CORTE */}
<Reveal delay={0.08}>
  <div className="partnerHeroCard">
    <div className="partnerHeroContent">
      <span className="partnerBadge">
        Parceira Oficial
      </span>

      <h2>PARAÍBA DO CORTE</h2>

      <h3>
        Barbearia parceira da COREGG
      </h3>

      <p>
        Com anos de experiência no mercado, a Paraíba do Corte
        é uma barbearia especializada que apoia o projeto da
        COREGG e acredita no crescimento dos eSports. Sempre
        pronta para atender torcedores, colaboradores e toda
        a comunidade da organização com qualidade, estilo e
        atendimento diferenciado.
      </p>

      <a
        href="https://www.instagram.com/barbeariaparaibadocorte/"
        target="_blank"
        rel="noreferrer"
        className="partnerButton"
      >
        Conhecer parceiro
      </a>
    </div>

    <div className="partnerHeroLogo">
      <img
        src={paraibaDoCorteLogo}
        alt="Paraíba do Corte"
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
                Transformando vidas através de Cultura e Esporte
              </h3>

              <p>
                O Projeto MAIS VIDA oferece aulas de Inglês,
                Jiu-Jitsu e Violão para crianças, adolescentes,
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
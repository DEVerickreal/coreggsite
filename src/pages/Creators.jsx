import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'

function Creators() {
  return (
    <PageTransition>
      <div className="aboutPage">
        <Reveal>
          <div className="aboutHero">
            <span className="aboutBadge">COREGG E-SPORTS</span>

            <h1>
              O que é a COREGG?
            </h1>

            <div className="aboutHeroText">
              <p>
                A COREGG foi fundada em 2025 por Erick Almeida, jovem empresário
                de 22 anos, CEO e Founder da organização, com o propósito de
                transformar sonhos em oportunidades dentro do cenário gamer e do
                entretenimento digital.
              </p>

              <p>
                Criada através da paixão pelos esports, pela criação de conteúdo
                e pelo desenvolvimento de talentos, a COREGG nasceu acreditando
                no potencial das pessoas, na força da comunidade e na importância
                da disciplina, foco e determinação para alcançar grandes
                objetivos.
              </p>

              <p>
                Mais do que uma organização, a COREGG representa evolução,
                inovação e conexão, reunindo players, criadores e projetos que
                compartilham a mesma visão de crescimento e profissionalismo
                dentro do cenário competitivo e digital.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="aboutGrid">
          <Reveal delay={0.1}>
            <div className="aboutCard">
              <h2>Missão</h2>
              <p>
                Desenvolver talentos, fortalecer a comunidade e criar
                oportunidades dentro do cenário competitivo e do entretenimento
                digital.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="aboutCard">
              <h2>Visão</h2>
              <p>
                Se tornar uma das organizações mais influentes do cenário
                nacional unindo performance, branding e impacto digital.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="aboutCard">
              <h2>Valores</h2>
              <p>
                Comprometimento, inovação, respeito, disciplina e evolução
                constante em todas as áreas da organização.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4}>
          <div className="aboutNumbers">
            <div className="aboutNumberCard">
              <h3>9+</h3>
              <span>Modalidades</span>
            </div>

            <div className="aboutNumberCard">
              <h3>80+</h3>
              <span>Criadores & Players</span>
            </div>

            <div className="aboutNumberCard">
              <h3>2025</h3>
              <span>Expansão da marca</span>
            </div>

            <div className="aboutNumberCard">
              <h3>100%</h3>
              <span>Foco em evolução</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="aboutFinal">
            <h2>O futuro está sendo construído agora.</h2>

            <p>
              A COREGG segue expandindo sua presença nos esports, no
              entretenimento digital e na criação de conteúdo, sempre buscando
              crescimento, profissionalismo e novas oportunidades.
            </p>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}

export default Creators
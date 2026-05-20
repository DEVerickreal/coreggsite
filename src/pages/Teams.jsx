import { Link } from 'react-router-dom'

import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import TeamCard from '../components/TeamCard'

import teams from '../data/teams'

import API_URL from '../api'

function Teams() {
  return (
    <PageTransition>
      <div className="teamsPage">
        <Reveal>
          <div className="teamsHeader">
            <h1>Nossos Times</h1>

            <p>
              Conheça as modalidades e projetos da COREGG.
            </p>
          </div>
        </Reveal>

        <div className="teamsGrid">
          {teams.map((team, index) => (
            <Reveal key={team.id} delay={index * 0.12}>
              <TeamCard
                image={team.image}
                game={team.game}
                title={team.title}
                description={team.description}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="joinCoregg">
            <h2>Quer fazer parte da COREGG?</h2>

            <p>
              Estamos sempre buscando novos talentos, criadores,
              jogadores e projetos para crescer junto conosco.
            </p>

            <Link to="/contact" className="joinCoreggButton">
              Quero fazer parte
            </Link>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}

export default Teams
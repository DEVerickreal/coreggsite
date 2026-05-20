import '../styles/contact.css'

import { useState } from 'react'

import {
  FaDiscord,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaHandshake,
  FaGamepad,
  FaUsers
} from 'react-icons/fa'

import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setStatus('')
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus(data.error || 'Erro ao enviar contato.')
        setLoading(false)
        return
      }

      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setStatus('Mensagem enviada com sucesso!')

      setLoading(false)
    } catch {
      setStatus('Erro ao conectar com o servidor.')
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <main className="contactPremiumPage">
        <section className="contactHeroPremium">
          <div className="contactHeroImage">
            <img
              src="/contact-banner.jpeg"
              alt="COREGG"
            />
          </div>

          <div className="contactHeroGlow"></div>

          <Reveal>
            <span className="contactMiniTitle">
              CONTATO OFICIAL
            </span>

            <h1>
              Fale com a COREGG
            </h1>

            <p>
              Parcerias, creators, esports, ativações comerciais
              e projetos digitais. Entre em contato com a nossa equipe.
            </p>

            <div className="contactHeroButtons">
              <a
                href="https://discord.gg/xvfCnn4tVF"
                target="_blank"
                rel="noreferrer"
                className="contactPrimaryButton"
              >
                Entrar no Discord
              </a>

              <a
                href="#contact-form"
                className="contactSecondaryButton"
              >
                Enviar e-mail
              </a>
            </div>
          </Reveal>
        </section>

        <section className="contactCardsGrid">
          <Reveal delay={0.1}>
            <div className="contactInfoCard">
              <div className="contactCardTop">
                <FaHandshake />

                <span>COMERCIAL</span>
              </div>

              <h3>Parcerias</h3>

              <p>
                Propostas comerciais, ativações de marca,
                patrocinadores e oportunidades institucionais.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="contactInfoCard">
              <div className="contactCardTop">
                <FaUsers />

                <span>CREATORS</span>
              </div>

              <h3>Streamers</h3>

              <p>
                Entrada de criadores, influenciadores,
                embaixadores e projetos de conteúdo.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="contactInfoCard">
              <div className="contactCardTop">
                <FaGamepad />

                <span>ESPORTS</span>
              </div>

              <h3>Competitivo</h3>

              <p>
                Times, line-ups, peneiras, jogadores
                e oportunidades no cenário competitivo.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="contactMainArea">
          <Reveal>
            <div
              className="contactFormBox"
              id="contact-form"
            >
              <div className="contactSectionHeader">
                <span>ENVIE SUA MENSAGEM</span>

                <h2>Contato direto</h2>

                <p>
                  Preencha as informações abaixo para falar com a COREGG.
                </p>
              </div>

              <form
                className="contactForm"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">
                    Selecione o assunto
                  </option>

                  <option value="Parceria comercial">
                    Parceria comercial
                  </option>

                  <option value="Streamer / Creator">
                    Streamer / Creator
                  </option>

                  <option value="Esports">
                    Esports
                  </option>

                  <option value="Outros">
                    Outros
                  </option>
                </select>

                <textarea
                  placeholder="Escreva sua mensagem"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>

                {status && (
                  <p className="contactStatus">
                    {status}
                  </p>
                )}

                <button type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar contato'}
                </button>
              </form>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="contactCommunityBox">
              <span>COMUNIDADE</span>

              <h2>Entre no nosso ecossistema</h2>

              <p>
                Acompanhe novidades, creators, eventos, times e projetos
                da COREGG através das nossas redes oficiais.
              </p>

              <div className="contactSocialGrid">
                <a href="https://www.instagram.com/crazzycoregg/" target="_blank" rel="noreferrer">
                  <FaInstagram />
                  Instagram
                </a>

                <a href="https://www.tiktok.com/@crazzycoregg" target="_blank" rel="noreferrer">
                  <FaTiktok />
                  TikTok
                </a>

                <a href="https://www.youtube.com/@crazzycoregg" target="_blank" rel="noreferrer">
                  <FaYoutube />
                  YouTube
                </a>

                <a href="https://discord.gg/xvfCnn4tVF" target="_blank" rel="noreferrer">
                  <FaDiscord />
                  Discord
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </PageTransition>
  )
}

export default Contact
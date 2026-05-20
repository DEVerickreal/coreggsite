function TeamCard({ image, game, title, description }) {
  return (
    <div className="teamCard">
      <img src={image} alt={title} />

      <div className="teamOverlay"></div>

      <div className="teamInfo">
        <span>{game}</span>

        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </div>
  )
}

export default TeamCard
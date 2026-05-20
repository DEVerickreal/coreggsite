import { useEffect, useState } from 'react'

function CursorGlow() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    function handleMouseMove(e) {
      setPosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      className="cursorGlow"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    />
  )
}

export default CursorGlow
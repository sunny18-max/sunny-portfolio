import { useEffect, useState } from 'react'
import './SpaceshipCursor.css'

const SpaceshipCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [trail, setTrail] = useState([])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Add trail effect
      setTrail(prev => [...prev.slice(-10), { x: e.clientX, y: e.clientY, id: Date.now() }])
      
      const target = e.target
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('planet-label')
      )
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="spaceship-trail"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: index / trail.length,
            transform: `translate(-50%, -50%) scale(${index / trail.length})`,
          }}
        />
      ))}
      
      {/* Spaceship Cursor */}
      <div
        className={`spaceship-cursor ${isPointer ? 'active' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L4 20L12 17L20 20L12 2Z"
            fill="url(#spaceship-gradient)"
            stroke="white"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="spaceship-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}

export default SpaceshipCursor

import { useState, useEffect } from 'react'
import Universe from './components/Universe'
import MatrixRain from './components/MatrixRain'
import SpaceshipCursor from './components/SpaceshipCursor'
import HolographicNav from './components/HolographicNav'
import './App.css'

function App() {
  const [greeting, setGreeting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [bootSequence, setBootSequence] = useState(0)

  useEffect(() => {
    // Greeting sequence
    setTimeout(() => {
      setGreeting(false)
      setLoading(true)
    }, 4000)
  }, [])

  useEffect(() => {
    if (!loading) return

    const bootMessages = [
      'INITIALIZING QUANTUM CORE...',
      'LOADING NEURAL NETWORKS...',
      'ESTABLISHING HYPERSPACE CONNECTION...',
      'CALIBRATING HOLOGRAPHIC INTERFACE...',
      'SYSTEM READY'
    ]

    const interval = setInterval(() => {
      setBootSequence(prev => {
        if (prev < bootMessages.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 500)
          return prev
        }
      })
    }, 400)

    return () => clearInterval(interval)
  }, [loading])

  if (greeting) {
    return (
      <div className="greeting-screen">
        <div className="greeting-content">
          <div className="windows-logo">
            <div className="logo-grid">
              <div className="logo-square square-1"></div>
              <div className="logo-square square-2"></div>
              <div className="logo-square square-3"></div>
              <div className="logo-square square-4"></div>
            </div>
          </div>
          <h1 className="greeting-title">Hi there</h1>
          <p className="greeting-subtitle">Welcome to Saathvik's Portfolio</p>
          <p className="greeting-description">We're setting up your experience...</p>
          <div className="greeting-progress">
            <div className="progress-bar"></div>
          </div>
          <div className="greeting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="boot-screen">
        <div className="boot-container">
          <div className="boot-logo">
            <div className="hexagon">
              <span className="initial">S</span>
            </div>
          </div>
          <div className="boot-text">
            <div className="boot-line">
              {['INITIALIZING QUANTUM CORE...', 'LOADING NEURAL NETWORKS...', 'ESTABLISHING HYPERSPACE CONNECTION...', 'CALIBRATING HOLOGRAPHIC INTERFACE...', 'SYSTEM READY'][bootSequence]}
            </div>
            <div className="boot-progress">
              <div className="boot-bar" style={{ width: `${(bootSequence + 1) * 20}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app universe-theme">
      <MatrixRain />
      <SpaceshipCursor />
      <HolographicNav />
      <Universe />
    </div>
  )
}

export default App

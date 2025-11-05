import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaFileDownload, FaRocket } from 'react-icons/fa'
import './HolographicNav.css'

const HolographicNav = () => {
  const [time, setTime] = useState(new Date())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const socialLinks = [
    { icon: <FaFileDownload />, href: '/images/My_Resume.pdf', label: 'Resume', download: true },
    { icon: <FaGithub />, href: 'https://github.com/sunny18-max', label: 'GitHub' },
    { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/saathvik-kalepu-17041228b/', label: 'LinkedIn' },
    { icon: <FaEnvelope />, href: 'mailto:saathvik202@gmail.com', label: 'Email' },
  ]

  return (
    <motion.nav
      className={`cosmic-nav ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="nav-container">
        {/* Animated Logo */}
        <motion.div 
          className="nav-brand"
          whileHover={{ scale: 1.05 }}
        >
          <div className="brand-icon">
            <FaRocket />
            <div className="orbit-ring"></div>
          </div>
          <div className="brand-text">
            <span className="brand-name">SAATHVIK</span>
            <span className="brand-subtitle">KALEPU</span>
          </div>
        </motion.div>

        {/* Cosmic Time Display */}
        <motion.div 
          className="cosmic-time"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="time-display">
            <span className="time-icon">🌍</span>
            <div className="time-info">
              <span className="time-label">LOCAL TIME</span>
              <span className="time-value">{time.toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <div className="nav-links">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              {...(link.download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
              className="nav-link"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -3 }}
              title={link.label}
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-label">{link.label}</span>
              <div className="link-glow"></div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

export default HolographicNav

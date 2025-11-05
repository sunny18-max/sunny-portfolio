import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Terminal.css'

const Terminal = ({ onClose }) => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    { type: 'system', text: 'SAATHVIK TERMINAL v2.0.0' },
    { type: 'system', text: 'Type "help" for available commands' },
    { type: 'prompt', text: '' }
  ])
  const inputRef = useRef(null)
  const terminalRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const commands = {
    help: () => [
      'Available commands:',
      '  about      - Learn about me',
      '  skills     - View my technical skills',
      '  projects   - List my projects',
      '  contact    - Get contact information',
      '  social     - View social media links',
      '  resume     - Download my resume',
      '  clear      - Clear terminal',
      '  exit       - Close terminal'
    ],
    about: () => [
      'Saathvik Kalepu',
      'Full Stack Developer & AI Specialist',
      '',
      'I create immersive digital experiences that blend',
      'innovation with purpose. Currently pursuing B.Tech',
      'in Computer Science at IIITDM Kurnool.',
      '',
      'Passionate about AI, Web Development, and creating',
      'solutions that make a difference.'
    ],
    skills: () => [
      'Technical Skills:',
      '  Frontend: React, Three.js, HTML/CSS, JavaScript',
      '  Backend: Node.js, Python, Express',
      '  AI/ML: TensorFlow, PyTorch, NLP',
      '  Database: MongoDB, PostgreSQL, MySQL',
      '  Tools: Git, Docker, AWS, Vercel',
      '  Design: Figma, Adobe XD'
    ],
    projects: () => [
      'Featured Projects:',
      '  1. E-commerce Analytics Dashboard',
      '  2. Supply Chain Optimizer (AI)',
      '  3. Sunny - AI Voice Assistant',
      '  4. Smart Recipe Finder',
      '  5. Mental Wellness Companion',
      '',
      'Visit GitHub: github.com/sunny18-max'
    ],
    contact: () => [
      'Contact Information:',
      '  Email: saathvik202@gmail.com',
      '  Phone: +91 9908179816',
      '  Location: Hyderabad, India',
      '',
      'Feel free to reach out!'
    ],
    social: () => [
      'Social Media:',
      '  GitHub: github.com/sunny18-max',
      '  LinkedIn: linkedin.com/in/saathvik-kalepu-17041228b',
      '  Twitter: x.com/home',
      '  Instagram: instagram.com/ifcsunny'
    ],
    resume: () => {
      window.open('/images/My_Resume.pdf', '_blank')
      return ['Opening resume...']
    },
    clear: () => {
      setHistory([
        { type: 'system', text: 'Terminal cleared' },
        { type: 'prompt', text: '' }
      ])
      return []
    },
    exit: () => {
      onClose()
      return ['Closing terminal...']
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const cmd = input.toLowerCase().trim()
    const newHistory = [...history]
    
    // Add command to history
    newHistory.push({ type: 'command', text: `$ ${input}` })

    // Execute command
    if (commands[cmd]) {
      const output = commands[cmd]()
      if (output.length > 0) {
        output.forEach(line => {
          newHistory.push({ type: 'output', text: line })
        })
      }
    } else {
      newHistory.push({ type: 'error', text: `Command not found: ${cmd}` })
      newHistory.push({ type: 'output', text: 'Type "help" for available commands' })
    }

    newHistory.push({ type: 'prompt', text: '' })
    setHistory(newHistory)
    setInput('')
  }

  return (
    <motion.div
      className="terminal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="terminal-window"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="btn-close" onClick={onClose}></span>
            <span className="btn-minimize"></span>
            <span className="btn-maximize"></span>
          </div>
          <div className="terminal-title">saathvik@portfolio:~$</div>
        </div>

        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index} className={`terminal-line ${item.type}`}>
              {item.type === 'prompt' ? (
                <form onSubmit={handleSubmit} className="terminal-input-form">
                  <span className="terminal-prompt">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="terminal-input"
                    autoFocus
                    spellCheck="false"
                  />
                </form>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Terminal

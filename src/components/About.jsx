import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaReact, FaNode, FaPython, FaDatabase } from 'react-icons/fa'
import { SiTensorflow, SiMongodb } from 'react-icons/si'
import './About.css'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skills = [
    { name: 'Frontend Development', level: 95, icon: <FaReact /> },
    { name: 'Backend Development', level: 90, icon: <FaNode /> },
    { name: 'Python/AI/ML', level: 85, icon: <FaPython /> },
    { name: 'Database Management', level: 88, icon: <FaDatabase /> },
  ]

  const technologies = [
    { name: 'React', icon: <FaReact />, color: '#61dafb' },
    { name: 'Node.js', icon: <FaNode />, color: '#68a063' },
    { name: 'Python', icon: <FaPython />, color: '#3776ab' },
    { name: 'TensorFlow', icon: <SiTensorflow />, color: '#ff6f00' },
    { name: 'MongoDB', icon: <SiMongodb />, color: '#47a248' },
  ]

  return (
    <section className="about" id="about" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="section-subtitle">Get to know the person behind the code</p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="image-wrapper">
              <img src="/images/me.jpg" alt="Saathvik Kalepu" />
              <div className="image-overlay"></div>
              <div className="stat-badge badge-1">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Lines of Code</span>
              </div>
              <div className="stat-badge badge-2">
                <span className="stat-number">20+</span>
                <span className="stat-label">Projects</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>
              Bridging Imagination <span className="gradient-text">with</span> Implementation
            </h3>
            <p>
              I'm a Full Stack Developer and AI Specialist with a passion for creating immersive
              digital experiences. With expertise spanning from frontend aesthetics to backend
              architecture and AI integration, I transform complex problems into elegant solutions.
            </p>
            <p>
              My approach combines technical precision with creative thinking, ensuring that every
              project not only functions flawlessly but also delivers an engaging user experience.
              I thrive at the intersection of technology and design.
            </p>

            <div className="skills-grid">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="skill-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <div className="skill-header">
                    <div className="skill-icon">{skill.icon}</div>
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="tech-stack">
              <h4>Tech Stack</h4>
              <div className="tech-icons">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className="tech-icon"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    style={{ color: tech.color }}
                  >
                    {tech.icon}
                    <span className="tech-tooltip">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="about-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <a href="/images/My_Resume.pdf" className="btn btn-primary" download>
                Download CV
              </a>
              <button 
                onClick={() => {
                  // Close current modal
                  const modalClose = document.querySelector('.modal-close')
                  if (modalClose) {
                    modalClose.click()
                    
                    // Wait for modal to close, then trigger contact section
                    setTimeout(() => {
                      // Dispatch custom event to open contact section
                      window.dispatchEvent(new CustomEvent('openPlanetSection', { 
                        detail: { sectionId: 'contact' } 
                      }))
                    }, 400)
                  }
                }}
                className="btn btn-outline"
              >
                Let's Talk
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About

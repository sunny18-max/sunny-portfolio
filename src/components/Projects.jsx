import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGithub, FaExternalLinkAlt, FaClock, FaChartLine } from 'react-icons/fa'
import './Projects.css'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [filter, setFilter] = useState('all')

  const projects = [
    {
      title: 'E-commerce Analytics Dashboard',
      category: 'web',
      description: 'Comprehensive analytics platform providing real-time insights into sales performance, customer behavior, and inventory management for e-commerce businesses.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      tags: ['React', 'Node.js', 'Chart.js', 'MongoDB'],
      github: 'https://github.com/sunny18-max/ecommerce-analytics',
      demo: 'http://eccomerce-analytics-ztf9.vercel.app',
      badge: 'Featured',
      stats: { metric: '30% increase', time: '3 months' }
    },
    {
      title: 'Supply Chain Optimizer',
      category: 'ai',
      description: 'Advanced optimization system that reduces logistics costs by 15-20% using linear programming and machine learning algorithms for route optimization.',
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80',
      tags: ['Python', 'Pandas', 'PuLP', 'Tableau'],
      github: 'https://github.com/sunny18-max/supply-chain-optimizer',
      demo: '#',
      badge: 'AI Solution',
      stats: { metric: '18% cost reduction', time: '1 month' }
    },
    {
      title: 'Sunny - AI Voice Assistant',
      category: 'ai',
      description: 'Intelligent voice-controlled assistant capable of performing complex tasks including system automation, media control, and natural language conversations.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
      tags: ['Python', 'NLP', 'SpeechRecognition', 'Automation'],
      github: 'https://github.com/sunny18-max/sunny-assistant',
      demo: '#',
      badge: 'Personal Project',
      stats: { metric: '95% accuracy', time: 'Ongoing' }
    },
    {
      title: 'Smart Recipe Finder',
      category: 'mobile',
      description: 'Mobile application that suggests recipes based on available ingredients, dietary restrictions, and cooking preferences with step-by-step guidance.',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      tags: ['HTML5', 'CSS3', 'Spoonacular API', 'Redux'],
      github: 'https://github.com/sunny18-max/recipe-finder',
      demo: 'https://sunny18-max.github.io/recipe-finder/',
      badge: 'Mobile App',
      stats: { metric: 'Helping others', time: '10 days' }
    },
    {
      title: 'Mental Wellness Companion',
      category: 'mobile',
      description: 'Comprehensive mental wellness application featuring mood tracking, guided meditations, CBT exercises, and personalized recommendations.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
      tags: ['JavaScript', 'PWA', 'LocalStorage', 'CSS3'],
      github: 'https://github.com/sunny18-max/serenity',
      demo: 'https://serenity-plum-gamma.vercel.app/',
      badge: 'Health Tech',
      stats: { metric: '200+ users', time: '20 days' }
    },
    {
      title: 'Social Media Content Planner',
      category: 'web',
      description: 'Comprehensive platform for scheduling, analyzing, and optimizing social media content across multiple platforms with performance analytics.',
      image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
      tags: ['React', 'Firebase', 'Social API', 'Chart.js'],
      github: '#',
      demo: '#',
      badge: 'Marketing Tool',
      stats: { metric: '30% engagement boost', time: '20 days' }
    },
  ]

  const filters = [
    { name: 'All', value: 'all' },
    { name: 'Web Apps', value: 'web' },
    { name: 'AI/ML', value: 'ai' },
    { name: 'Mobile', value: 'mobile' },
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            My <span className="gradient-text">Creations</span>
          </h2>
          <p className="section-subtitle">Innovative solutions to real-world challenges</p>
        </motion.div>

        <motion.div
          className="filter-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filters.map((btn) => (
            <button
              key={btn.value}
              className={`filter-btn ${filter === btn.value ? 'active' : ''}`}
              onClick={() => setFilter(btn.value)}
            >
              {btn.name}
            </button>
          ))}
        </motion.div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-links">
                    {project.demo !== '#' && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                        <FaExternalLinkAlt />
                      </a>
                    )}
                    {project.github !== '#' && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                        <FaGithub />
                      </a>
                    )}
                  </div>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="project-content">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className="project-badge">{project.badge}</span>
                </div>
                <p>{project.description}</p>
                <div className="project-stats">
                  <div className="stat">
                    <FaChartLine />
                    <span>{project.stats.metric}</span>
                  </div>
                  <div className="stat">
                    <FaClock />
                    <span>{project.stats.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="view-more"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <a href="https://github.com/sunny18-max" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Explore More Projects
            <span className="btn-arrow">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects

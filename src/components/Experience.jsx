import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase, FaGraduationCap, FaCheckCircle } from 'react-icons/fa'
import './Experience.css'

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const experiences = [
    {
      type: 'work',
      title: 'Freelance Full Stack Developer',
      company: 'Self-Employed | Remote',
      period: 'Present',
      description:
        'Developed custom web applications and AI solutions for diverse clients. Specialized in creating responsive, scalable applications with modern tech stacks including Python',
      achievements: [
        'Delivered 15+ projects with 100% client satisfaction',
        'Integrated AI features in 8 projects',
        'Reduced client operational costs by 30% on average',
      ],
      icon: <FaBriefcase />,
    },
    {
      type: 'education',
      title: 'B.Tech in Computer Science And Engineering',
      company: 'Indian Institute Of Information Technology Design And Manufacturing | Kurnool',
      period: '2023 - 2027',
      description:
        'Specialized in Artificial Intelligence and Web Technologies. Active participant in hackathons and coding competitions.',
      achievements: ['GPA: 8.2/10'],
      icon: <FaGraduationCap />,
    },
  ]

  return (
    <section className="experience" id="experience" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-subtitle">Professional milestones and learning experiences</p>
        </motion.div>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className={`timeline-item ${exp.type}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="timeline-content">
                <div className="timeline-icon">{exp.icon}</div>
                <div className="timeline-card">
                  <div className="timeline-period">{exp.period}</div>
                  <h3>{exp.title}</h3>
                  <p className="company">{exp.company}</p>
                  <p className="description">{exp.description}</p>
                  <ul className="achievements">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>
                        <FaCheckCircle />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience

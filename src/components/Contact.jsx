import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import './Contact.css'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const formRef = useRef()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    emailjs.init('M7Wb9judvJuQ2cZRn')
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      // Send notification to you (saathvikk202@gmail.com)
      const notificationResponse = await emailjs.send(
        'service_rqkh5ys',
        'template_qzgttb8',
        {
          user_name: formData.name,
          user_email: formData.email,
          subject: formData.subject || 'New Contact Form Message',
          message: formData.message,
        }
      )

      console.log('Notification sent:', notificationResponse)

      // Send auto-reply to user with beautiful template
      const autoReplyResponse = await emailjs.send(
        'service_rqkh5ys',
        'template_2tzr8pi',
        {
          user_name: formData.name,
          user_email: formData.email,
          subject: formData.subject || 'Your message',
        }
      )

      console.log('Auto-reply sent:', autoReplyResponse)

      setStatus({
        type: 'success',
        message: '🚀 Message sent successfully! Check your email for a confirmation from Saathvik.',
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('EmailJS Error Details:', error)
      setStatus({
        type: 'error',
        message: `❌ Failed to send message: ${error.text || error.message || 'Unknown error'}. Please try emailing me directly at saathvikk202@gmail.com`,
      })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email me at',
      value: 'saathvikk202@gmail.com',
      link: 'mailto:saathvikk202@gmail.com',
    },
    {
      icon: <FaPhone />,
      title: 'Call me at',
      value: '+91 9908179816',
      link: 'tel:+919908179816',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Find me at',
      value: 'Hyderabad, India',
      link: 'https://maps.google.com/?q=Hyderabad,India',
    },
  ]

  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/sunny18-max' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/saathvik-kalepu-17041228b/' },
    { icon: <FaTwitter />, url: 'https://x.com/home' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/ifcsunny/' },
  ]

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="section-subtitle">Have a project in mind or want to discuss opportunities?</p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Collaboration starts with a conversation</h3>
            <p>
              I'm currently available for freelance projects and full-time opportunities. Let's
              create something amazing together!
            </p>

            <div className="info-items">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="info-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="info-icon">{info.icon}</div>
                  <div className="info-details">
                    <span className="info-title">{info.title}</span>
                    <a href={info.link} target="_blank" rel="noopener noreferrer">
                      {info.value}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="social-section">
              <h4>Follow Me</h4>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
              <span className="btn-arrow">→</span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact

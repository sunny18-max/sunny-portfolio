import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Asteroids, ShootingStars, SpaceParticles, NebulaCloud } from './SpaceElements'
import About from './About'
import Experience from './Experience'
import Projects from './Projects'
import Contact from './Contact'
import './Universe.css'

// Realistic Planet Component with Textures
const Planet = ({ position, color, size, speed, onClick, label, rings, atmosphere, planetType }) => {
  const meshRef = useRef()
  const cloudsRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed
      if (hovered) {
        meshRef.current.scale.lerp({ x: size * 1.3, y: size * 1.3, z: size * 1.3 }, 0.1)
      } else {
        meshRef.current.scale.lerp({ x: size, y: size, z: size }, 0.1)
      }
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += speed * 1.2
    }
  })

  // Create realistic texture using canvas
  const createPlanetTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Base color
    const gradient = ctx.createLinearGradient(0, 0, 512, 512)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.5, adjustColor(color, 20))
    gradient.addColorStop(1, adjustColor(color, -20))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    // Add texture details based on planet type
    if (planetType === 'earth') {
      // Continents
      ctx.fillStyle = '#2d5016'
      for (let i = 0; i < 30; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 50 + 20, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (planetType === 'jupiter' || planetType === 'saturn') {
      // Bands
      for (let i = 0; i < 512; i += 40) {
        ctx.fillStyle = i % 80 === 0 ? adjustColor(color, 15) : adjustColor(color, -15)
        ctx.fillRect(0, i, 512, 20)
      }
    } else if (planetType === 'mars') {
      // Craters
      ctx.fillStyle = adjustColor(color, -30)
      for (let i = 0; i < 50; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 15 + 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Add noise
    const imageData = ctx.getImageData(0, 0, 512, 512)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20
      imageData.data[i] += noise
      imageData.data[i + 1] += noise
      imageData.data[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)
    
    return new THREE.CanvasTexture(canvas)
  }

  const adjustColor = (hex, amount) => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, Math.min(255, (num >> 16) + amount))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  const texture = createPlanetTexture()

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group position={position}>
        {/* Planet with texture */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={[size, size, size]}
        >
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.8}
            metalness={0.2}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.05}
          />
        </mesh>

        {/* Clouds for Earth */}
        {planetType === 'earth' && (
          <mesh ref={cloudsRef} scale={[size * 1.01, size * 1.01, size * 1.01]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.15}
              roughness={1}
            />
          </mesh>
        )}

        {/* Atmosphere glow */}
        {atmosphere && (
          <mesh scale={[size * 1.08, size * 1.08, size * 1.08]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={hovered ? 0.25 : 0.12}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Rings (for Saturn) */}
        {rings && (
          <mesh rotation={[Math.PI / 2.3, 0, 0]}>
            <ringGeometry args={[size * 1.3, size * 1.8, 64]} />
            <meshStandardMaterial
              color={rings}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              roughness={0.8}
            />
          </mesh>
        )}
      </group>
    </Float>
  )
}

// Orbital Ring Component
const OrbitalRing = ({ radius, color }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Sun Component
const Sun = ({ onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
      <mesh
        ref={meshRef}
        position={[-15, 0, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 2.2 : 2}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Sun glow */}
      <mesh position={[-15, 0, 0]} scale={hovered ? 2.6 : 2.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  )
}

// Rocket Component
const TravelingRocket = ({ startPos, endPos, isActive, onComplete }) => {
  const rocketRef = useRef()
  const trailRef = useRef([])
  const [progress, setProgress] = useState(0)
  
  useFrame(() => {
    if (isActive && rocketRef.current && startPos && endPos) {
      // Update progress
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.02, 1)
        
        // Calculate position along path
        const currentPos = new THREE.Vector3(
          startPos[0] + (endPos[0] - startPos[0]) * newProgress,
          startPos[1] + (endPos[1] - startPos[1]) * newProgress + Math.sin(newProgress * Math.PI) * 2,
          startPos[2] + (endPos[2] - startPos[2]) * newProgress
        )
        
        rocketRef.current.position.copy(currentPos)
        
        // Point rocket toward destination
        rocketRef.current.lookAt(new THREE.Vector3(...endPos))
        
        // Trigger completion
        if (newProgress >= 1 && onComplete) {
          setTimeout(() => onComplete(), 300)
        }
        
        return newProgress
      })
    }
  })
  
  if (!isActive) return null
  
  return (
    <group ref={rocketRef}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.5} />
      </mesh>
      {/* Rocket flame */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.8} />
      </mesh>
      {/* Trail particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={new Float32Array(60).fill(0)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#FFA500" transparent opacity={0.6} />
      </points>
    </group>
  )
}

// Camera Controller Component
const CameraController = ({ targetPosition, isZooming, onZoomComplete }) => {
  const { camera } = useThree()
  const hasCompleted = useRef(false)
  
  useFrame(() => {
    if (isZooming && targetPosition) {
      const targetPos = new THREE.Vector3(targetPosition[0], targetPosition[1] + 2, targetPosition[2] + 3)
      const distance = camera.position.distanceTo(targetPos)
      
      // Smooth camera movement
      camera.position.lerp(targetPos, 0.05)
      camera.lookAt(new THREE.Vector3(...targetPosition))
      
      // Check if close enough to target and hasn't completed yet
      if (distance < 0.5 && !hasCompleted.current && onZoomComplete) {
        hasCompleted.current = true
        onZoomComplete()
      }
    } else {
      hasCompleted.current = false
    }
  })
  
  return null
}

const Universe = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [targetPlanet, setTargetPlanet] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [rocketActive, setRocketActive] = useState(false)
  const [rocketStart, setRocketStart] = useState(null)
  const [rocketEnd, setRocketEnd] = useState(null)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Calculate positions based on device
  const getPositions = () => {
    if (isMobile) {
      // Circular orbit for mobile
      const radius = 8
      return [
        { angle: 0, radius: 0 }, // Sun at center
        { angle: 0, radius: radius * 0.4 },
        { angle: 45, radius: radius * 0.6 },
        { angle: 90, radius: radius * 0.8 },
        { angle: 135, radius: radius * 0.9 },
        { angle: 180, radius: radius * 1.1 },
        { angle: 225, radius: radius * 1.0 },
        { angle: 270, radius: radius * 0.85 },
        { angle: 315, radius: radius * 0.95 },
        { angle: 360, radius: radius * 0.7 },
      ].map(({ angle, radius }) => {
        const rad = (angle * Math.PI) / 180
        return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
      })
    } else if (isTablet) {
      // Semi-circular for tablet
      const radius = 10
      return [
        [-12, 0, 0], // Sun
        ...Array.from({ length: 9 }, (_, i) => {
          const angle = (i * 180) / 8 - 90
          const rad = (angle * Math.PI) / 180
          return [Math.cos(rad) * radius, Math.sin(rad) * radius * 0.3, 0]
        })
      ]
    } else {
      // Horizontal for desktop
      return [
        [-15, 0, 0],
        [-11, 0, 0],
        [-8, 0, 0],
        [-5, 0, 0],
        [-2, 0, 0],
        [2, 0, 0],
        [6, 0, 0],
        [10, 0, 0],
        [13, 0, 0],
        [16, 0, 0],
      ]
    }
  }

  const positions = getPositions()

  const celestialBodies = [
    { id: 'home', type: 'sun', label: '☀️ Home' },
    { id: 'about', type: 'planet', planetType: 'mercury', color: '#8C7853', size: 0.4, speed: 0.015, label: '☿️ About', atmosphere: false },
    { id: 'skills', type: 'planet', planetType: 'venus', color: '#FFC649', size: 0.6, speed: 0.012, label: '♀️ Skills', atmosphere: true },
    { id: 'experience', type: 'planet', planetType: 'earth', color: '#4A90E2', size: 0.65, speed: 0.01, label: '🌍 Experience', atmosphere: true },
    { id: 'projects', type: 'planet', planetType: 'mars', color: '#E27B58', size: 0.55, speed: 0.009, label: '♂️ Projects', atmosphere: true },
    { id: 'achievements', type: 'planet', planetType: 'jupiter', color: '#C88B3A', size: 1.1, speed: 0.006, label: '♃ Achievements', atmosphere: true },
    { id: 'education', type: 'planet', planetType: 'saturn', color: '#FAD5A5', size: 0.95, speed: 0.005, label: '♄ Education', rings: '#E6C79C', atmosphere: true },
    { id: 'certifications', type: 'planet', planetType: 'uranus', color: '#4FD0E7', size: 0.7, speed: 0.004, label: '♅ Certifications', atmosphere: true },
    { id: 'contact', type: 'planet', planetType: 'neptune', color: '#4166F5', size: 0.68, speed: 0.003, label: '♆ Contact', atmosphere: true },
    { id: 'resume', type: 'planet', planetType: 'pluto', color: '#D4A5A5', size: 0.35, speed: 0.002, label: '♇ Resume', atmosphere: false },
  ].map((body, index) => ({
    ...body,
    position: positions[index]
  }))

  const handlePlanetClick = (planetId, position) => {
    setActiveSection(planetId)
    setTargetPlanet(position)
    
    // Start rocket animation
    const cameraPos = isMobile ? [0, 12, 12] : isTablet ? [0, 8, 15] : [0, 5, 18]
    setRocketStart(cameraPos)
    setRocketEnd(position)
    setRocketActive(true)
    
    // Start camera zoom after a short delay
    setTimeout(() => {
      setIsZooming(true)
    }, 100)
  }

  useEffect(() => {
    const handleOpenSection = (event) => {
      const { sectionId } = event.detail
      const planet = celestialBodies.find(body => body.id === sectionId)
      if (planet) {
        handlePlanetClick(planet.id, planet.position)
      }
    }
    
    window.addEventListener('openPlanetSection', handleOpenSection)
    return () => window.removeEventListener('openPlanetSection', handleOpenSection)
  }, [celestialBodies])

  const handleRocketComplete = () => {
    setRocketActive(false)
  }

  const handleZoomComplete = () => {
    setShowModal(true)
    setIsZooming(false)
  }

  const closeSection = () => {
    setShowModal(false)
    setActiveSection(null)
    setTargetPlanet(null)
    setIsZooming(false)
    setRocketActive(false)
    setRocketStart(null)
    setRocketEnd(null)
  }

  return (
    <div className="universe-container">
      {/* 3D Universe */}
      <div className="universe-canvas">
        <Canvas camera={{ 
          position: isMobile ? [0, 12, 12] : isTablet ? [0, 8, 15] : [0, 5, 18], 
          fov: isMobile ? 60 : 75 
        }}>
          <Suspense fallback={null}>
            <CameraController 
              targetPosition={targetPlanet} 
              isZooming={isZooming}
              onZoomComplete={handleZoomComplete}
            />
            
            <TravelingRocket
              startPos={rocketStart}
              endPos={rocketEnd}
              isActive={rocketActive}
              onComplete={handleRocketComplete}
            />
            
            <ambientLight intensity={0.3} />
            {/* Sun light */}
            <pointLight 
              position={isMobile ? [0, 0, 0] : [-15, 0, 0]} 
              intensity={2.5} 
              color="#FDB813" 
              distance={40} 
            />
            <pointLight position={[0, 10, 10]} intensity={0.6} />
            <Stars 
              radius={isMobile ? 150 : 200} 
              depth={100} 
              count={isMobile ? 5000 : 10000} 
              factor={7} 
              saturation={0} 
              fade 
              speed={1} 
            />
            
            {/* Space Elements */}
            {!isMobile && (
              <>
                <Asteroids count={15} />
                <ShootingStars count={3} />
                <SpaceParticles count={80} />
                <NebulaCloud />
              </>
            )}
            
            {/* Orbital Rings */}
            {!isMobile && celestialBodies.map((body, index) => {
              if (body.type === 'planet') {
                const radius = Math.sqrt(
                  body.position[0] ** 2 + 
                  body.position[1] ** 2 + 
                  body.position[2] ** 2
                )
                return (
                  <OrbitalRing 
                    key={`orbit-${body.id}`} 
                    radius={radius} 
                    color={body.color}
                  />
                )
              }
              return null
            })}
            
            {/* Render Sun and Planets */}
            {celestialBodies.map((body) => (
              body.type === 'sun' ? (
                <Sun
                  key={body.id}
                  onClick={() => handlePlanetClick(body.id, body.position)}
                />
              ) : (
                <Planet
                  key={body.id}
                  position={body.position}
                  color={body.color}
                  size={body.size}
                  speed={body.speed}
                  rings={body.rings}
                  atmosphere={body.atmosphere}
                  planetType={body.planetType}
                  label={body.label}
                  onClick={() => handlePlanetClick(body.id, body.position)}
                />
              )
            ))}

            <OrbitControls
              enabled={!isZooming}
              enableZoom={!isZooming}
              enablePan={!isMobile && !isZooming}
              enableRotate={!isZooming}
              minDistance={isMobile ? 10 : 8}
              maxDistance={isMobile ? 20 : 25}
              autoRotate={!isMobile && !isZooming}
              autoRotateSpeed={0.2}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Zooming Indicator */}
      <AnimatePresence>
        {(isZooming || rocketActive) && (
          <motion.div
            className="zoom-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="zoom-text">
              <span className="zoom-icon">🚀</span>
              <p>{rocketActive ? 'Launching rocket...' : 'Approaching planet...'}</p>
              <div className="progress-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Modals */}
      <AnimatePresence>
        {activeSection && showModal && (
          <motion.div
            className="section-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSection}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeSection}>
                ✕
              </button>
              <div className="modal-body">
                {activeSection === 'home' && (
                  <div className="home-section">
                    <h1>Welcome to My Solar System! ☀️</h1>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem' }}>
                      Hi! I'm <strong>Saathvik Kalepu</strong>, a Full Stack Developer and AI Specialist.
                      <br/>Explore my solar system to discover my professional journey through the cosmos.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ marginBottom: '1.5rem', color: '#f8fafc' }}>🌌 Navigate the Planets:</h3>
                      <ul style={{ fontSize: '1.05rem', lineHeight: '2.2' }}>
                        <li>☿️ <strong>Mercury</strong> - About Me & Introduction</li>
                        <li>♀️ <strong>Venus</strong> - Skills & Technologies</li>
                        <li>🌍 <strong>Earth</strong> - Professional Experience</li>
                        <li>♂️ <strong>Mars</strong> - Projects & Portfolio</li>
                        <li>♃ <strong>Jupiter</strong> - Achievements & Awards</li>
                        <li>♄ <strong>Saturn</strong> - Education & Background</li>
                        <li>♅ <strong>Uranus</strong> - Certifications & Courses</li>
                        <li>♆ <strong>Neptune</strong> - Contact & Connect</li>
                        <li>♇ <strong>Pluto</strong> - Download Resume</li>
                      </ul>
                    </div>
                  </div>
                )}
                {activeSection === 'about' && <About />}
                {activeSection === 'skills' && <About />}
                {activeSection === 'experience' && <Experience />}
                {activeSection === 'projects' && <Projects />}
                {activeSection === 'achievements' && (
                  <div className="home-section">
                    <h1>🏆 Achievements & Awards</h1>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem' }}>
                      Recognition and milestones throughout my journey
                    </p>
                    <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #C88B3A' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🎯 100% Client Satisfaction</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Delivered 15+ projects with perfect client ratings and repeat business</p>
                      </div>
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #C88B3A' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🤖 AI Integration Expert</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Successfully integrated AI features in 8+ projects, improving efficiency by 40%</p>
                      </div>
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #C88B3A' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>💰 Cost Optimization</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Reduced operational costs by 30% on average through efficient solutions</p>
                      </div>
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #C88B3A' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🚀 Hackathon Participant</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Active participant in coding competitions and hackathons</p>
                      </div>
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #C88B3A' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>📈 Performance Excellence</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Maintained 8.2/10 GPA while working on multiple freelance projects</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === 'education' && (
                  <div className="home-section">
                    <h1>🎓 Education & Background</h1>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem' }}>
                      Academic foundation and learning journey
                    </p>
                    <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                      <div style={{ marginBottom: '2.5rem', padding: '2rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #FAD5A5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.5rem' }}>B.Tech in Computer Science & Engineering</h3>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Indian Institute of Information Technology Design and Manufacturing</p>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Kurnool, India</p>
                          </div>
                          <div style={{ padding: '0.5rem 1rem', background: 'rgba(102, 126, 234, 0.2)', borderRadius: '20px' }}>
                            <span style={{ color: '#a5b4fc', fontWeight: '600' }}>2023 - 2027</span>
                          </div>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1rem' }}>Specialized in Artificial Intelligence and Web Technologies</p>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            <span style={{ padding: '0.5rem 1rem', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '20px', color: '#c7d2fe', fontSize: '0.9rem' }}>GPA: 8.2/10</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '20px', color: '#c7d2fe', fontSize: '0.9rem' }}>AI & ML Focus</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '20px', color: '#c7d2fe', fontSize: '0.9rem' }}>Web Development</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '15px' }}>
                        <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '1.2rem' }}>Key Coursework</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          <li style={{ padding: '0.5rem 0', color: '#cbd5e1', fontSize: '1rem' }}>✓ Data Structures & Algorithms</li>
                          <li style={{ padding: '0.5rem 0', color: '#cbd5e1', fontSize: '1rem' }}>✓ Machine Learning & AI</li>
                          <li style={{ padding: '0.5rem 0', color: '#cbd5e1', fontSize: '1rem' }}>✓ Web Technologies & Frameworks</li>
                          <li style={{ padding: '0.5rem 0', color: '#cbd5e1', fontSize: '1rem' }}>✓ Database Management Systems</li>
                          <li style={{ padding: '0.5rem 0', color: '#cbd5e1', fontSize: '1rem' }}>✓ Software Engineering</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === 'certifications' && (
                  <div className="home-section">
                    <h1>📜 Certifications & Courses</h1>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem' }}>
                      Continuous learning and professional development
                    </p>
                    <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #4FD0E7' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🐍 Python for Data Science & AI</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.3rem' }}>IBM - Coursera</p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Advanced Python programming for data analysis and machine learning applications</p>
                      </div>
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #4FD0E7' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>⚛️ React - The Complete Guide</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Udemy</p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Comprehensive React development including Hooks, Context API, and Redux</p>
                      </div>
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #4FD0E7' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🤖 Machine Learning Specialization</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Stanford University - Coursera</p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Supervised and unsupervised learning, neural networks, and best practices</p>
                      </div>
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #4FD0E7' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🌐 Full Stack Web Development</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.3rem' }}>The Odin Project</p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Complete full-stack development with Node.js, Express, and MongoDB</p>
                      </div>
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #4FD0E7' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>☁️ AWS Cloud Practitioner</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Amazon Web Services</p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Cloud computing fundamentals and AWS services architecture</p>
                      </div>
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', borderLeft: '4px solid #4FD0E7' }}>
                        <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🎨 UI/UX Design Principles</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Google - Coursera</p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>User-centered design, wireframing, and prototyping best practices</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === 'contact' && <Contact />}
                {activeSection === 'resume' && (
                  <div className="home-section">
                    <h1>📄 Download My Resume</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                      Get a comprehensive overview of my skills, experience, and achievements.
                    </p>
                    <a 
                      href="/images/My_Resume.pdf" 
                      download
                      className="btn btn-primary"
                    >
                      Download Resume →
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Universe

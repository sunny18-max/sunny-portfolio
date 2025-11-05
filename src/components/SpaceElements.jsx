import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Floating Asteroids Component
export const Asteroids = ({ count = 20 }) => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005
    }
  })

  const asteroids = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const radius = 25 + Math.random() * 15
    const size = 0.1 + Math.random() * 0.3
    
    return {
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 20,
        Math.sin(angle) * radius
      ],
      size,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: 0.001 + Math.random() * 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, i) => (
        <Asteroid key={i} {...asteroid} />
      ))}
    </group>
  )
}

// Individual Asteroid
const Asteroid = ({ position, size, rotation, speed }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed
      meshRef.current.rotation.y += speed * 0.7
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color="#8b7355"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}

// Shooting Stars/Comets
export const ShootingStars = ({ count = 5 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 3
  }))

  return (
    <group>
      {stars.map(star => (
        <ShootingStar key={star.id} delay={star.delay} />
      ))}
    </group>
  )
}

const ShootingStar = ({ delay }) => {
  const meshRef = useRef()
  const trailRef = useRef()
  const startTime = useRef(Date.now() + delay * 1000)
  
  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000
    const duration = 3
    const progress = (elapsed % (duration + 5)) / duration
    
    if (progress <= 1 && meshRef.current) {
      const startX = -30 + Math.random() * 10
      const startY = 15 + Math.random() * 5
      const startZ = -20 + Math.random() * 10
      
      meshRef.current.position.x = startX + progress * 60
      meshRef.current.position.y = startY - progress * 30
      meshRef.current.position.z = startZ + progress * 20
      
      meshRef.current.visible = true
      if (trailRef.current) trailRef.current.visible = true
    } else {
      if (meshRef.current) meshRef.current.visible = false
      if (trailRef.current) trailRef.current.visible = false
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={trailRef} position={[-0.5, 0, 0]}>
        <coneGeometry args={[0.1, 2, 8]} />
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// Floating Space Particles
export const SpaceParticles = ({ count = 100 }) => {
  const pointsRef = useRef()
  
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = 30 + Math.random() * 20
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = (Math.random() - 0.5) * 40
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    
    const color = new THREE.Color()
    color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.7)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Nebula Cloud Effect
export const NebulaCloud = () => {
  const cloudRef = useRef()
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0001
      cloudRef.current.rotation.z += 0.0002
    }
  })

  return (
    <mesh ref={cloudRef} position={[0, 0, -30]}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial
        color="#764ba2"
        transparent
        opacity={0.05}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

export default { Asteroids, ShootingStars, SpaceParticles, NebulaCloud }

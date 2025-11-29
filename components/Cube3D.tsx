import React, { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Colors based on standard Rubik's scheme (Western Color Scheme)
// Yellow on Top (U), White on Bottom (D)
const COLORS = {
  U: '#fbbf24', // Up - Yellow
  D: '#ffffff', // Down - White
  F: '#22c55e', // Front - Green
  B: '#3b82f6', // Back - Blue
  R: '#ef4444', // Right - Red
  L: '#f97316', // Left - Orange
  CORE: '#0a0a0a' // Darker core
};

// Helper to generate initial positions
const generatePositions = () => {
  const pos: { id: number; position: THREE.Vector3; rotation: THREE.Euler }[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        pos.push({
          id: id++,
          position: new THREE.Vector3(x, y, z),
          rotation: new THREE.Euler(0, 0, 0),
        });
      }
    }
  }
  return pos;
};

const Cubie = ({ position, gridPosition }: { position: [number, number, number], gridPosition: THREE.Vector3 }) => {
  // Use gridPosition for determining sticker colors based on initial solved state
  const { x, y, z } = gridPosition;
  
  return (
    <group position={position}>
      {/* Core Block */}
      <RoundedBox args={[0.98, 0.98, 0.98]} radius={0.08} smoothness={4}>
        <meshStandardMaterial attach="material" color={COLORS.CORE} roughness={0.5} metalness={0.1} />
      </RoundedBox>
      
      {/* Face Stickers */}
      {/* Right (x+) */}
      <mesh position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={x > 0.5 ? COLORS.R : COLORS.CORE} />
      </mesh>
      {/* Left (x-) */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={x < -0.5 ? COLORS.L : COLORS.CORE} />
      </mesh>
      {/* Up (y+) */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={y > 0.5 ? COLORS.U : COLORS.CORE} />
      </mesh>
      {/* Down (y-) */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={y < -0.5 ? COLORS.D : COLORS.CORE} />
      </mesh>
      {/* Front (z+) */}
      <mesh position={[0, 0, 0.5]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={z > 0.5 ? COLORS.F : COLORS.CORE} />
      </mesh>
      {/* Back (z-) */}
      <mesh position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={z < -0.5 ? COLORS.B : COLORS.CORE} />
      </mesh>
    </group>
  );
};

export interface CubeRef {
  performMove: (moveNotation: string, duration?: number) => Promise<void>;
  reset: () => void;
  jumpTo: (moves: string[]) => void;
}

const Cube3D = forwardRef<CubeRef, {}>((props, ref) => {
  const initialCubies = useMemo(() => generatePositions(), []);

  const groupRef = useRef<THREE.Group>(null);
  const cubiesRef = useRef<(THREE.Object3D | null)[]>([]);
  const isAnimating = useRef(false);

  // Helper to get rotation axis and selection predicate from notation
  const getMoveParams = (notation: string) => {
    // Check for Wide moves: Lowercase (r, l, u...) or Rw, Lw
    const isWide = /^[a-z]/.test(notation) || notation.includes('w');
    const moveChar = notation.toUpperCase().replace('W', '')[0]; // Clean to base char 'R', 'L', etc.
    const isPrime = notation.includes("'");
    const isDouble = notation.includes("2");
    
    let axis: 'x' | 'y' | 'z' = 'x';
    let predicate: (v: THREE.Vector3) => boolean = () => false;
    
    // Base Direction Mapping
    // R (Clockwise) is Negative X rotation in Three.js (Right Hand Rule)
    let baseDir = 1; 

    switch (moveChar) {
      case 'R': 
        axis = 'x'; 
        // Normal: Right slice only. Wide: Right + Middle (Everything > -0.5)
        predicate = isWide ? (v) => v.x > -0.5 : (v) => v.x > 0.5; 
        baseDir = -1; 
        break;
      case 'L': 
        axis = 'x'; 
        // Normal: Left slice only. Wide: Left + Middle (Everything < 0.5)
        predicate = isWide ? (v) => v.x < 0.5 : (v) => v.x < -0.5; 
        baseDir = 1; 
        break; 
      case 'U': 
        axis = 'y'; 
        predicate = isWide ? (v) => v.y > -0.5 : (v) => v.y > 0.5; 
        baseDir = -1;
        break;
      case 'D': 
        axis = 'y'; 
        predicate = isWide ? (v) => v.y < 0.5 : (v) => v.y < -0.5; 
        baseDir = 1; 
        break;
      case 'F': 
        axis = 'z'; 
        predicate = isWide ? (v) => v.z > -0.5 : (v) => v.z > 0.5; 
        baseDir = -1;
        break;
      case 'B': 
        axis = 'z'; 
        predicate = isWide ? (v) => v.z < 0.5 : (v) => v.z < -0.5; 
        baseDir = 1; 
        break;
      case 'M': 
        axis = 'x'; 
        predicate = (v) => Math.abs(v.x) < 0.5; 
        baseDir = 1; // M follows L direction
        break; 
      case 'E': 
        axis = 'y'; 
        predicate = (v) => Math.abs(v.y) < 0.5; 
        baseDir = 1; // E follows D direction
        break; 
      case 'S': 
        axis = 'z'; 
        predicate = (v) => Math.abs(v.z) < 0.5; 
        baseDir = -1; // S follows F direction
        break; 
      case 'X': 
        axis = 'x'; 
        predicate = () => true; 
        baseDir = -1; // Follows R
        break; 
      case 'Y': 
        axis = 'y'; 
        predicate = () => true; 
        baseDir = -1; // Follows U
        break; 
      case 'Z': 
        axis = 'z'; 
        predicate = () => true; 
        baseDir = -1; // Follows F
        break; 
    }

    // Apply modifiers
    let angle = (Math.PI / 2) * baseDir;
    if (isPrime) angle *= -1;
    if (isDouble) angle *= 2;

    return { axis, predicate, angle };
  };

  const applyRotationInstant = (notation: string) => {
      if (!groupRef.current) return;
      const { axis, predicate, angle } = getMoveParams(notation);

      const activeCubies: THREE.Object3D[] = [];
      cubiesRef.current.forEach(c => {
        if (c) {
           const pos = c.position.clone(); 
           if (predicate(pos)) activeCubies.push(c);
        }
      });

      if (activeCubies.length === 0) return;

      const pivot = new THREE.Object3D();
      groupRef.current.add(pivot);
      activeCubies.forEach(c => pivot.attach(c));

      if (axis === 'x') pivot.rotation.x = angle;
      if (axis === 'y') pivot.rotation.y = angle;
      if (axis === 'z') pivot.rotation.z = angle;
      
      pivot.updateMatrixWorld();

      activeCubies.forEach(c => {
          groupRef.current?.attach(c);
          c.position.round(); 
          c.rotation.x = Math.round(c.rotation.x / (Math.PI/2)) * (Math.PI/2);
          c.rotation.y = Math.round(c.rotation.y / (Math.PI/2)) * (Math.PI/2);
          c.rotation.z = Math.round(c.rotation.z / (Math.PI/2)) * (Math.PI/2);
          c.updateMatrix();
      });

      groupRef.current.remove(pivot);
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
        const initialPos = generatePositions();
        cubiesRef.current.forEach((mesh, idx) => {
            if (mesh) {
                mesh.position.copy(initialPos[idx].position);
                mesh.rotation.set(0, 0, 0);
                mesh.updateMatrix();
            }
        });
    },
    jumpTo: (moves: string[]) => {
        const initialPos = generatePositions();
        cubiesRef.current.forEach((mesh, idx) => {
            if (mesh) {
                mesh.position.copy(initialPos[idx].position);
                mesh.rotation.set(0, 0, 0);
                mesh.updateMatrix();
            }
        });
        moves.forEach(move => applyRotationInstant(move));
    },
    performMove: (notation: string, duration = 300) => {
      return new Promise<void>((resolve) => {
        if (isAnimating.current || !groupRef.current) {
          resolve();
          return;
        }

        const { axis, predicate, angle } = getMoveParams(notation);
        isAnimating.current = true;

        const activeCubies: THREE.Object3D[] = [];
        cubiesRef.current.forEach(c => {
          if (c) {
             const pos = c.position.clone(); 
             if (predicate(pos)) activeCubies.push(c);
          }
        });

        if (activeCubies.length === 0) {
            isAnimating.current = false;
            resolve();
            return;
        }

        const pivot = new THREE.Object3D();
        groupRef.current.add(pivot);
        activeCubies.forEach(c => pivot.attach(c));

        const startTime = Date.now();
        
        const animate = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); 

          if (axis === 'x') pivot.rotation.x = angle * ease;
          if (axis === 'y') pivot.rotation.y = angle * ease;
          if (axis === 'z') pivot.rotation.z = angle * ease;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            if (axis === 'x') pivot.rotation.x = angle;
            if (axis === 'y') pivot.rotation.y = angle;
            if (axis === 'z') pivot.rotation.z = angle;
            
            pivot.updateMatrixWorld();

            activeCubies.forEach(c => {
                groupRef.current?.attach(c);
                c.position.round();
                c.rotation.x = Math.round(c.rotation.x / (Math.PI/2)) * (Math.PI/2);
                c.rotation.y = Math.round(c.rotation.y / (Math.PI/2)) * (Math.PI/2);
                c.rotation.z = Math.round(c.rotation.z / (Math.PI/2)) * (Math.PI/2);
                c.updateMatrix();
            });

            groupRef.current.remove(pivot);
            isAnimating.current = false;
            resolve();
          }
        };
        
        animate();
      });
    }
  }));

  return (
    <group ref={groupRef}>
      {initialCubies.map((c, i) => (
        <group 
            key={c.id} 
            ref={(el) => (cubiesRef.current[i] = el)} 
            position={c.position}
        >
            <Cubie position={[0,0,0]} gridPosition={c.position} />
        </group>
      ))}
    </group>
  );
});

export default Cube3D;
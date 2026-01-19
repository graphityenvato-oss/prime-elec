"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function NetworkSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { nodes, edges, nodeCount } = useMemo(() => {
    const nodePositions: THREE.Vector3[] = [];
    const edgePositions: number[] = [];

    const ico = new THREE.IcosahedronGeometry(1.2, 2);
    const posAttr = ico.attributes.position;

    const uniqueNodes = new Map<string, THREE.Vector3>();

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

      if (!uniqueNodes.has(key)) {
        uniqueNodes.set(key, new THREE.Vector3(x, y, z));
      }
    }

    nodePositions.push(...uniqueNodes.values());

    const threshold = 0.85;
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < threshold) {
          edgePositions.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z,
          );
        }
      }
    }

    return {
      nodes: nodePositions,
      edges: new Float32Array(edgePositions),
      nodeCount: nodePositions.length,
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !nodesRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.rotation.y = time * 0.15;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < nodeCount; i++) {
      const pulse = 1 + Math.sin(time * 3 + i * 0.5) * 0.2;
      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      nodesRef.current.setMatrixAt(i, dummy.matrix);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#5dade2" />
      </instancedMesh>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={edges}
            itemSize={3}
            args={[edges, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2980b9" transparent opacity={0.6} />
      </lineSegments>

      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial color="#1a5276" transparent opacity={0.05} />
      </mesh>

      <pointLight color="#3498db" intensity={1.5} distance={10} />
    </group>
  );
}

function CenterElectricSign() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const boltShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.lineTo(0.15, 0.5);
    shape.lineTo(0.05, 0.15);
    shape.lineTo(0.2, 0.15);
    shape.lineTo(-0.05, -0.5);
    shape.lineTo(0.05, -0.1);
    shape.lineTo(-0.1, -0.1);
    shape.closePath();
    return shape;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !glowRef.current) return;

    const time = state.clock.elapsedTime;
    const pulse = 0.95 + Math.sin(time * 3) * 0.05;
    groupRef.current.scale.setScalar(pulse * 1.2);

    const glowPulse = 0.2 + Math.sin(time * 4) * 0.1;
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowPulse;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
      <mesh>
        <shapeGeometry args={[boltShape]} />
        <meshBasicMaterial color="#ffd700" side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={glowRef} scale={1.4}>
        <shapeGeometry args={[boltShape]} />
        <meshBasicMaterial
          color="#fff8dc"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  speed,
  opacity,
}: {
  radius: number;
  speed: number;
  opacity: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI * 0.5, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color="#5dade2" transparent opacity={opacity} />
    </mesh>
  );
}

function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 80;

  const particles = useMemo(() => {
    const seeded = (seed: number) => {
      const value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r1 = seeded(i * 3.1);
      const r2 = seeded(i * 5.3);
      const r3 = seeded(i * 7.7);
      positions[i * 3] = (r1 - 0.5) * 14;
      positions[i * 3 + 1] = (r2 - 0.5) * 8;
      positions[i * 3 + 2] = (r3 - 0.5) * 8 - 2;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#85c1e9"
        transparent
        opacity={0.25}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#0a1628"]} />
      <fog attach="fog" args={["#0a1628", 10, 25]} />

      <ambientLight intensity={0.1} color="#1a5276" />
      <directionalLight position={[5, 5, 5]} intensity={0.25} color="#ecf0f1" />

      <group scale={1.35}>
        <NetworkSphere />
        <CenterElectricSign />
        <OrbitRing radius={2} speed={0.4} opacity={0.6} />
        <AmbientParticles />
      </group>

      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative h-65 w-full overflow-hidden rounded-3xl border border-border/60 bg-[#0a1628] shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:h-80 lg:h-90">
      <Canvas
        camera={{ position: [0, 1.2, 4.9], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        className="pointer-events-none"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

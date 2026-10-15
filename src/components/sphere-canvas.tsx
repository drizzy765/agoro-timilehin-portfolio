"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildSphere } from "./sphere-geometry";
import { useThemeVars } from "@/lib/use-theme-vars";

function NodeSphere({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const c = useThemeVars({ "--c-sphere": "#FF3B4E", "--background": "#000000" });
  const { positions, linePositions } = useMemo(() => {
    const { pts, edges } = buildSphere(420, 1.6, 3);
    const positions = new Float32Array(pts.flat());
    const linePositions = new Float32Array(edges.flatMap(([i, j]) => [...pts[i], ...pts[j]]));
    return { positions, linePositions };
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);
    g.rotation.y += d * 0.12;
    const p = pointer.current ?? { x: 0, y: 0 };
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, p.y * 0.35, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -p.x * 0.18, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, p.x * 0.12, 0.04);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={c["--c-sphere"]} size={0.035} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={c["--c-sphere"]} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[1.56, 32, 32]} />
        <meshBasicMaterial color={c["--background"]} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function SphereCanvas({ active, onReady }: { active: boolean; onReady?: () => void }) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <NodeSphere pointer={pointer} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.7} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

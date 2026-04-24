import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function ParticleCloud() {
  const ref = useRef<any>(null);

  const sphere = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 1.4;
      const sinPhi = Math.sin(phi);
      arr[i * 3]     = r * sinPhi * Math.cos(theta);
      arr[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 14;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 5]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.004}
          sizeAttenuation
          depthWrite={false}
          opacity={0.55}
        />
      </Points>
    </group>
  );
}

export default function ThreeDBackground({ dark }: { dark: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: dark ? 0.7 : 0.35,
        transition: "opacity 0.4s",
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
}

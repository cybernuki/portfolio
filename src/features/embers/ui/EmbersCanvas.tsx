"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useStore, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, type Group } from "three";

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uDpr;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_PointSize = aSize * uDpr;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    a *= a;
    vec3 c = mix(vec3(1.0, 0.75, 0.47), vec3(0.78, 0.27, 0.17), smoothstep(0.0, 0.8, d));
    gl_FragColor = vec4(c * a * vAlpha, a * vAlpha);
  }
`;

interface Ember {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  max: number;
  phase: number;
}

function spawn(w: number, h: number, anywhere: boolean): Ember {
  return {
    x: (Math.random() - 0.5) * w,
    y: anywhere ? (Math.random() - 0.5) * h : -h / 2 - Math.random() * 40,
    vy: 0.25 + Math.random() * 0.7,
    vx: (Math.random() - 0.5) * 0.25,
    life: anywhere ? Math.random() * 300 : 0,
    max: 300 + Math.random() * 400,
    phase: Math.random() * 6.28,
  };
}

function alphaOf(p: Ember): number {
  return Math.max(0, Math.sin(Math.PI * Math.min(1, p.life / p.max))) * 0.9;
}

interface Field {
  embers: Ember[];
  position: Float32Array;
  alpha: Float32Array;
  geometry: BufferGeometry;
}

/** One Points layer, additive blending. `animate` false renders a single still frame. Built imperatively: the simulation is mutable by nature. */
function Embers({ count, animate }: { count: number; animate: boolean }) {
  const gl = useThree((s) => s.gl);
  const store = useStore();
  const group = useRef<Group>(null);
  const field = useRef<Field | null>(null);

  useEffect(() => {
    const host = group.current;
    if (!host) return;
    const { width, height } = store.getState().size;
    const embers = Array.from({ length: count }, () => spawn(width, height, true));
    const position = new Float32Array(count * 3);
    const alpha = new Float32Array(count);
    const sizes = Float32Array.from({ length: count }, () => 10 + Math.random() * 22);
    embers.forEach((p, i) => {
      position[i * 3] = p.x;
      position[i * 3 + 1] = p.y;
      alpha[i] = alphaOf(p);
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(position, 3));
    geometry.setAttribute("aAlpha", new BufferAttribute(alpha, 1));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uDpr: { value: gl.getPixelRatio() } },
    });
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    host.add(points);
    field.current = { embers, position, alpha, geometry };
    return () => {
      host.remove(points);
      geometry.dispose();
      material.dispose();
      field.current = null;
    };
    // Seeded once per particle count; resizes only change the bounds used on respawn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, gl]);

  useFrame(({ size }, delta) => {
    const f = field.current;
    if (!animate || !f) return;
    const step = Math.min(delta, 0.05) * 60;
    const w = size.width;
    const h = size.height;
    for (let i = 0; i < f.embers.length; i++) {
      let p = f.embers[i]!;
      p.life += step;
      p.y += p.vy * step;
      p.x += (p.vx + Math.sin((p.life + p.phase * 50) / 40) * 0.25) * step;
      if (p.y > h / 2 + 20 || p.life > p.max) {
        p = spawn(w, h, false);
        f.embers[i] = p;
      }
      f.position[i * 3] = p.x;
      f.position[i * 3 + 1] = p.y;
      f.alpha[i] = alphaOf(p);
    }
    (f.geometry.getAttribute("position") as BufferAttribute).needsUpdate = true;
    (f.geometry.getAttribute("aAlpha") as BufferAttribute).needsUpdate = true;
  });

  return <group ref={group} />;
}

export interface EmbersCanvasProps {
  count: number;
  animate: boolean;
  /** Tab hidden or hero off-screen: stop rendering entirely. */
  paused: boolean;
  dpr: [number, number];
}

export default function EmbersCanvas({ count, animate, paused, dpr }: EmbersCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
      dpr={dpr}
      frameloop={paused ? "never" : animate ? "always" : "demand"}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Embers key={count} count={count} animate={animate} />
    </Canvas>
  );
}

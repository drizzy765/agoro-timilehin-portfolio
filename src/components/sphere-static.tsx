import { buildSphere } from "./sphere-geometry";

const { pts, edges } = buildSphere(260, 1.6, 3);

/** Static SVG version of the node sphere: reduced-motion / low-end fallback and pre-load placeholder. */
export function SphereStatic({ className }: { className?: string }) {
  const ry = 0.5,
    rx = -0.35;
  const proj = pts.map(([x, y, z]) => {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    return { x: 200 + x1 * 110, y: 200 - y2 * 110, z: z2 };
  });
  const a = (z: number) => (0.25 + ((z + 1.6) / 3.2) * 0.75).toFixed(2);
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id="sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "var(--c-sphere)" }} stopOpacity="0.14" />
          <stop offset="100%" style={{ stopColor: "var(--c-sphere)" }} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#sg)" />
      <g style={{ stroke: "var(--c-sphere)" }} strokeWidth="0.5">
        {edges.map(([i, j]) => (
          <line key={`${i}-${j}`} x1={proj[i].x.toFixed(1)} y1={proj[i].y.toFixed(1)} x2={proj[j].x.toFixed(1)} y2={proj[j].y.toFixed(1)} strokeOpacity={(Number(a((proj[i].z + proj[j].z) / 2)) * 0.35).toFixed(2)} />
        ))}
      </g>
      <g style={{ fill: "var(--c-sphere)" }}>
        {proj.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.z > 0 ? 1.6 : 1.1} fillOpacity={a(p.z)} />
        ))}
      </g>
    </svg>
  );
}

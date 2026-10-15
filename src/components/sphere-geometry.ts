/** Fibonacci-sphere nodes + nearest-neighbour edges (deterministic, shared by 3D + static SVG). */
export function buildSphere(n = 380, radius = 1.6, k = 3) {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push([Math.cos(th) * r * radius, y * radius, Math.sin(th) * r * radius]);
  }
  const edges = new Set<string>();
  for (let i = 0; i < n; i++) {
    const d = pts
      .map((p, j) => ({ j, d: (p[0] - pts[i][0]) ** 2 + (p[1] - pts[i][1]) ** 2 + (p[2] - pts[i][2]) ** 2 }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    for (const { j } of d) edges.add(i < j ? `${i}-${j}` : `${j}-${i}`);
  }
  return { pts, edges: [...edges].map((e) => e.split("-").map(Number) as [number, number]) };
}

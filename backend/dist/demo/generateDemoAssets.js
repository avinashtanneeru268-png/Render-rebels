import fs from "fs";
import path from "path";
const demoDir = path.resolve(process.cwd(), "..", "demo", "images");
if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir, { recursive: true });
}
// 1. Bridge Pier Baseline (Concrete pier with hairline diagonal crack and salt deposit)
const svgBridgeBaseline = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
      <feComposite in2="SourceGraphic" in="gl" operator="in" />
    </filter>
  </defs>

  <!-- Background concrete wall -->
  <rect width="1200" height="900" fill="url(#concreteGrad)" />
  <rect width="1200" height="900" fill="#64748b" opacity="0.12" filter="url(#noise)" />

  <!-- Construction Joint line -->
  <line x1="100" y1="180" x2="1100" y2="180" stroke="#0f172a" stroke-width="4" stroke-dasharray="8,4" />

  <!-- Efflorescence white crystalline staining -->
  <path d="M 240,175 Q 400,165 600,185 T 950,175 L 940,230 Q 650,250 420,210 Z" fill="#f8fafc" opacity="0.65" />
  <path d="M 300,190 Q 450,240 580,210 T 800,230" fill="none" stroke="#f1f5f9" stroke-width="8" opacity="0.8" filter="blur(2px)" />

  <!-- Baseline Hairline Diagonal Shear Crack -->
  <path d="M 400,380 Q 480,440 550,480 T 720,580" fill="none" stroke="#090d16" stroke-width="2.5" />
  <path d="M 520,460 Q 560,490 600,510" fill="none" stroke="#090d16" stroke-width="1.8" />

  <!-- Asset Labeling Stamp (Field Camera Overlay) -->
  <rect x="40" y="40" width="360" height="70" rx="8" fill="#000000" opacity="0.7" />
  <text x="60" y="70" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">SITESENTINEL FIELD CAPTURE</text>
  <text x="60" y="94" fill="#94a3b8" font-family="monospace" font-size="13">ASSET: BR-401 | SPAN 4 | BASELINE</text>
</svg>
`;
// 2. Bridge Pier Re-inspection (Propagated, widened crack and new bottom concrete spall)
const svgBridgeReinspection = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="concreteGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="900" fill="url(#concreteGrad2)" />

  <!-- Construction Joint line -->
  <line x1="100" y1="180" x2="1100" y2="180" stroke="#0f172a" stroke-width="4" stroke-dasharray="8,4" />

  <!-- Efflorescence deposit (unchanged/persisted) -->
  <path d="M 240,175 Q 400,165 600,185 T 950,175 L 940,230 Q 650,250 420,210 Z" fill="#f8fafc" opacity="0.65" />

  <!-- Worsened Crack (Widened, jagged edges, extended by 18cm) -->
  <path d="M 380,360 Q 470,430 550,475 T 740,590 T 820,680" fill="none" stroke="#020617" stroke-width="5" />
  <path d="M 470,430 L 490,460" fill="none" stroke="#020617" stroke-width="3" />
  <path d="M 550,475 L 590,520" fill="none" stroke="#020617" stroke-width="3" />
  <path d="M 740,590 L 780,640" fill="none" stroke="#020617" stroke-width="3.5" />

  <!-- NEW Defect: Concrete Spalling with exposed rebar shadow -->
  <path d="M 760,660 Q 820,640 890,670 T 960,740 Q 910,810 830,790 Z" fill="#1e1b18" stroke="#78350f" stroke-width="3" />
  <!-- Exposed oxidized rebar -->
  <rect x="800" y="700" width="110" height="18" rx="4" fill="#9a3412" stroke="#451a03" stroke-width="2" />
  <line x1="820" y1="700" x2="820" y2="718" stroke="#451a03" stroke-width="2" />
  <line x1="850" y1="700" x2="850" y2="718" stroke="#451a03" stroke-width="2" />
  <line x1="880" y1="700" x2="880" y2="718" stroke="#451a03" stroke-width="2" />

  <!-- Field Camera Overlay -->
  <rect x="40" y="40" width="380" height="70" rx="8" fill="#000000" opacity="0.7" />
  <text x="60" y="70" fill="#f59e0b" font-family="monospace" font-size="16" font-weight="bold">SITESENTINEL RE-INSPECTION</text>
  <text x="60" y="94" fill="#94a3b8" font-family="monospace" font-size="13">ASSET: BR-401 | SPAN 4 | RE-VISIT</text>
</svg>
`;
// 3. Pipeline Flange Corrosion
const svgPipelineFlange = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <radialGradient id="metalPipe" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="70%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
  </defs>

  <rect width="1200" height="900" fill="#0b0f17" />

  <!-- Pipe Spool Cylinders -->
  <rect x="100" y="320" width="380" height="260" fill="url(#metalPipe)" stroke="#475569" stroke-width="3" />
  <rect x="720" y="320" width="380" height="260" fill="url(#metalPipe)" stroke="#475569" stroke-width="3" />

  <!-- Flange Rings -->
  <ellipse cx="500" cy="450" rx="40" ry="190" fill="#1e293b" stroke="#64748b" stroke-width="4" />
  <ellipse cx="680" cy="450" rx="40" ry="190" fill="#1e293b" stroke="#64748b" stroke-width="4" />

  <!-- Connecting Studs and Heavy Rust Scaling -->
  <rect x="460" y="300" width="260" height="300" rx="10" fill="#78350f" opacity="0.85" />
  <circle cx="590" cy="360" r="18" fill="#451a03" stroke="#b45309" stroke-width="4" />
  <circle cx="590" cy="450" r="18" fill="#451a03" stroke="#b45309" stroke-width="4" />
  <circle cx="590" cy="540" r="18" fill="#451a03" stroke="#ea580c" stroke-width="4" />

  <!-- Exfoliation Rust Crust -->
  <path d="M 440,320 Q 580,270 720,320 T 680,580 Q 560,630 450,570 Z" fill="#9a3412" opacity="0.75" />

  <!-- Field Camera Overlay -->
  <rect x="40" y="40" width="360" height="70" rx="8" fill="#000000" opacity="0.7" />
  <text x="60" y="70" fill="#ef4444" font-family="monospace" font-size="16" font-weight="bold">FEEDLINE CRITICAL AUDIT</text>
  <text x="60" y="94" fill="#94a3b8" font-family="monospace" font-size="13">ASSET: PL-022 | LOOP 1 | FLANGE</text>
</svg>
`;
// 4. Facade Masonry Spall & Ivy
const svgFacadeMasonry = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#7f1d1d" opacity="0.85" />

  <!-- Brick Grid Patterns -->
  <g stroke="#e2e8f0" stroke-width="3" opacity="0.4">
    <line x1="0" y1="150" x2="1200" y2="150" />
    <line x1="0" y1="250" x2="1200" y2="250" />
    <line x1="0" y1="350" x2="1200" y2="350" />
    <line x1="0" y1="450" x2="1200" y2="450" />
    <line x1="0" y1="550" x2="1200" y2="550" />
    <line x1="0" y1="650" x2="1200" y2="650" />
    <line x1="0" y1="750" x2="1200" y2="750" />
  </g>

  <!-- Dislodged Loose Brick Spall -->
  <rect x="520" y="190" width="190" height="90" fill="#991b1b" stroke="#fca5a5" stroke-width="4" transform="rotate(7 520 190)" />

  <!-- Intrusive Woody Root Growth -->
  <path d="M 280,750 Q 320,550 380,420 T 450,260" fill="none" stroke="#14532d" stroke-width="14" stroke-linecap="round" />
  <path d="M 380,420 Q 440,380 490,340" fill="none" stroke="#166534" stroke-width="9" />
  <path d="M 340,510 Q 290,440 260,380" fill="none" stroke="#166534" stroke-width="7" />

  <!-- Field Camera Overlay -->
  <rect x="40" y="40" width="360" height="70" rx="8" fill="#000000" opacity="0.7" />
  <text x="60" y="70" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">MUNICIPAL FACADE SCAN</text>
  <text x="60" y="94" fill="#94a3b8" font-family="monospace" font-size="13">ASSET: FAC-10 | ELEVATION EAST</text>
</svg>
`;
// 5. Roof Membrane Ponding
const svgRoofPonding = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#cbd5e1" />

  <!-- TPO Membrane Seams -->
  <line x1="0" y1="380" x2="1200" y2="380" stroke="#64748b" stroke-width="6" />
  <line x1="0" y1="620" x2="1200" y2="620" stroke="#64748b" stroke-width="6" />

  <!-- Saturated Ponding Water Depression -->
  <ellipse cx="600" cy="460" rx="360" ry="140" fill="#0284c7" opacity="0.65" />
  <ellipse cx="580" cy="450" rx="240" ry="90" fill="#0369a1" opacity="0.8" />

  <!-- Open Unwelded Seam Fissure -->
  <path d="M 380,380 Q 600,390 850,380" fill="none" stroke="#0f172a" stroke-width="8" stroke-dasharray="16,6" />

  <!-- Field Camera Overlay -->
  <rect x="40" y="40" width="360" height="70" rx="8" fill="#000000" opacity="0.7" />
  <text x="60" y="70" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">CARGO TERMINAL ROOF</text>
  <text x="60" y="94" fill="#94a3b8" font-family="monospace" font-size="13">ASSET: RF-008 | BAY 3 TROUGH</text>
</svg>
`;
// 6. Utility Transmission Tower
const svgUtilityTower = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#1e293b" />

  <!-- Galvanized Lattice Angle Braces -->
  <line x1="200" y1="100" x2="350" y2="850" stroke="#94a3b8" stroke-width="16" />
  <line x1="1000" y1="100" x2="850" y2="850" stroke="#94a3b8" stroke-width="16" />
  <line x1="240" y1="350" x2="960" y2="350" stroke="#94a3b8" stroke-width="12" />

  <!-- Buckled Diagonal Cross Brace -->
  <path d="M 240,350 Q 560,570 880,720" fill="none" stroke="#e2e8f0" stroke-width="14" />
  <!-- Gusset Node Plate -->
  <polygon points="760,620 920,620 890,750 740,730" fill="#64748b" stroke="#334155" stroke-width="4" />
  <!-- Missing Nut on Bolt -->
  <circle cx="820" cy="670" r="14" fill="#f59e0b" stroke="#b45309" stroke-width="4" />

  <!-- Field Camera Overlay -->
  <rect x="40" y="40" width="360" height="70" rx="8" fill="#000000" opacity="0.7" />
  <text x="60" y="70" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">TRANSMISSION TOWER 14</text>
  <text x="60" y="94" fill="#94a3b8" font-family="monospace" font-size="13">ASSET: UT-114 | TIER 2 LATTICE</text>
</svg>
`;
const files = [
    { name: "bridge_span_baseline.jpg", content: svgBridgeBaseline },
    { name: "bridge_span_reinspection.jpg", content: svgBridgeReinspection },
    { name: "pipeline_flange_corrosion.jpg", content: svgPipelineFlange },
    { name: "facade_masonry_spall.jpg", content: svgFacadeMasonry },
    { name: "roof_membrane_ponding.jpg", content: svgRoofPonding },
    { name: "utility_tower_deformation.jpg", content: svgUtilityTower },
];
for (const f of files) {
    const filePath = path.join(demoDir, f.name);
    fs.writeFileSync(filePath, f.content.trim(), "utf-8");
}
console.log("✅ Synthetic demo inspection image assets generated successfully in /demo/images.");
//# sourceMappingURL=generateDemoAssets.js.map
const COLOR_MAP = {
  H: "#7dd3fc",
  O: "#f87171",
  N: "#60a5fa",
  C: "#374151",
  S: "#facc15",
  P: "#f59e0b",
  F: "#a3e635",
  Cl: "#22c55e",
  Br: "#fb923c",
  I: "#a78bfa",
  Na: "#93c5fd",
  K: "#c4b5fd"
};

const LABEL_MAP = {
  H: "מימן",
  O: "חמצן",
  N: "חנקן",
  C: "פחמן",
  S: "גופרית",
  P: "זרחן",
  F: "פלואור",
  Cl: "כלור",
  Br: "ברום",
  I: "יוד",
  Na: "נתרן",
  K: "אשלגן"
};

function expandFormula(formula) {
  const tokens = [];
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;

  while ((match = regex.exec(formula)) !== null) {
    const symbol = match[1];
    const count = match[2] ? Number(match[2]) : 1;
    for (let i = 0; i < count; i++) {
      tokens.push(symbol);
    }
  }

  return tokens;
}

function getPositions(count) {
  const presets = {
    2: [[90, 110], [230, 110]],
    3: [[70, 110], [160, 55], [250, 110]],
    4: [[90, 60], [230, 60], [90, 160], [230, 160]],
    5: [[160, 40], [70, 95], [250, 95], [110, 180], [210, 180]],
    8: [[80, 60], [160, 35], [240, 60], [270, 130], [240, 200], [160, 225], [80, 200], [50, 130]]
  };

  if (presets[count]) return presets[count];

  return Array.from({ length: count }, (_, i) => [60 + i * 50, 110]);
}

function buildSvg(formula) {
  const atoms = expandFormula(formula);
  const positions = getPositions(atoms.length);

  const lines = positions.map((pos, i) => {
    const next = positions[(i + 1) % positions.length];
    if (i === positions.length - 1 && positions.length < 4) return "";
    if (positions.length === 2 && i === 1) return "";
    return `<line x1="${pos[0]}" y1="${pos[1]}" x2="${next[0]}" y2="${next[1]}" class="bond-line" />`;
  }).join("");

  const circles = atoms.map((atom, i) => {
    const [x, y] = positions[i];
    const fill = COLOR_MAP[atom] || "#94a3b8";
    return `
      <g>
        <circle cx="${x}" cy="${y}" r="28" fill="${fill}" class="atom-node"></circle>
        <text x="${x}" y="${y + 7}" text-anchor="middle" class="atom-label">${atom}</text>
      </g>
    `;
  }).join("");

  return `
    <svg viewBox="0 0 320 260" class="molecule-svg" aria-label="מולקולה ${formula}">
      ${lines}
      ${circles}
    </svg>
  `;
}

export function renderMoleculeViewer(formula, mountEl, legendEl) {
  if (!mountEl || !legendEl) return;

  const atoms = expandFormula(formula);
  const uniqueAtoms = [...new Set(atoms)];

  mountEl.innerHTML = `
    <div class="molecule-viewer-card">
      <div class="molecule-viewer-card__title">${formula}</div>
      ${buildSvg(formula)}
    </div>
  `;

  legendEl.innerHTML = uniqueAtoms.map(atom => {
    return `
      <div class="legend-chip">
        <span class="legend-chip__dot" style="background:${COLOR_MAP[atom] || "#94a3b8"}"></span>
        <span>${LABEL_MAP[atom] || atom} (${atom})</span>
      </div>
    `;
  }).join("");
}
// DoseAlert - Core "WOW" Feature: The Interaction Map Component
// Dynamic interactive SVG Knowledge Graph connecting polypharmacy pills with severity-coded animated links

export class InteractionMap {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = options;
    this.onSelectNode = options.onSelectNode || (() => {});
    this.onSelectEdge = options.onSelectEdge || (() => {});
    this.selectedNodeId = null;
    this.selectedEdgeId = null;
    this.data = { medicines: [], findings: [] };
  }

  render(medicines = [], findings = []) {
    this.data = { medicines, findings };
    if (!this.container) return;

    const width = this.container.clientWidth || 560;
    const height = Math.max(320, Math.min(420, width * 0.65));

    // Calculate node coordinates in a circular/oval layout with center clearance
    const count = medicines.length;
    if (count === 0) {
      this.container.innerHTML = `<div class="empty-map-hint">No medicines loaded to map.</div>`;
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = Math.min(width * 0.38, 220);
    const radiusY = Math.min(height * 0.36, 130);

    const nodes = medicines.map((med, idx) => {
      const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      return { ...med, x, y };
    });

    // Match findings to node pairs
    const edges = findings.map(f => {
      const nodeA = nodes.find(n => n.id === f.medA.id || n.generic_code === f.medA.generic_code);
      const nodeB = nodes.find(n => n.id === f.medB.id || n.generic_code === f.medB.generic_code);
      return {
        finding: f,
        source: nodeA,
        target: nodeB,
        severity: f.severity,
        severityMeta: f.severityMeta
      };
    }).filter(e => e.source && e.target);

    // Build SVG Markup
    let svgHtml = `
      <svg class="interaction-map-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" aria-label="Medication Interaction Graph">
        <defs>
          <!-- Glow filters for highest severity links -->
          <filter id="glow-contraindicated" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-major" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Connecting Links (Draw in with staggered animation) -->
        <g class="graph-edges-group">
    `;

    edges.forEach((edge, index) => {
      const isContra = edge.severity === "contraindicated";
      const isMajor = edge.severity === "major";
      const strokeColor = edge.severityMeta ? edge.severityMeta.color : "#B91C1C";
      const strokeWidth = isContra ? 4 : isMajor ? 3.5 : 2.5;
      const filterAttr = isContra ? 'filter="url(#glow-contraindicated)"' : isMajor ? 'filter="url(#glow-major)"' : '';
      const animDelay = (index * 0.18).toFixed(2);

      // Arc curve through center
      const midX = (edge.source.x + edge.target.x) / 2;
      const midY = (edge.source.y + edge.target.y) / 2;
      // Slight bend away from center
      const dx = edge.target.x - edge.source.x;
      const dy = edge.target.y - edge.source.y;
      const normalX = -dy * 0.12;
      const normalY = dx * 0.12;
      const ctrlX = midX + normalX;
      const ctrlY = midY + normalY;

      const pathData = `M ${edge.source.x} ${edge.source.y} Q ${ctrlX} ${ctrlY} ${edge.target.x} ${edge.target.y}`;
      const pathLength = 500; // standard approx for dasharray

      // Severity icon symbol
      const iconSymbol = isContra ? "⛔" : isMajor ? "⚠️" : "⚡";

      svgHtml += `
        <g class="graph-edge ${edge.severity} ${isContra ? 'pulse-link' : ''}" data-finding-id="${edge.finding.id}">
          <path d="${pathData}"
                class="edge-path ${edge.severity}"
                stroke="${strokeColor}"
                stroke-width="${strokeWidth}"
                stroke-linecap="round"
                fill="none"
                ${filterAttr}
                style="stroke-dasharray: ${pathLength}; stroke-dashoffset: ${pathLength}; animation: drawPath 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s forwards;"
          />
          <!-- Badge on Center of Edge -->
          <g transform="translate(${ctrlX}, ${ctrlY})" class="edge-badge-marker" style="opacity: 0; animation: fadeInMarker 0.4s ease ${animDelay + 0.3}s forwards;">
            <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2" />
            <text x="0" y="4" text-anchor="middle" font-size="12" font-family="sans-serif">${iconSymbol}</text>
          </g>
        </g>
      `;
    });

    svgHtml += `</g><!-- Nodes Group -->
      <g class="graph-nodes-group">
    `;

    // Render Medication Pill Nodes
    nodes.forEach((node, idx) => {
      const animDelay = (idx * 0.08).toFixed(2);
      // Check if node is involved in any finding
      const nodeFindings = findings.filter(f => f.medA.id === node.id || f.medB.id === node.id || f.medA.generic_code === node.generic_code || f.medB.generic_code === node.generic_code);
      const highestSeverity = nodeFindings.length > 0 ? nodeFindings[0].severity : "none";
      const hasSevereRisk = highestSeverity === "contraindicated" || highestSeverity === "major";

      const pillWidth = 120;
      const pillHeight = 44;
      const halfW = pillWidth / 2;
      const halfH = pillHeight / 2;

      svgHtml += `
        <g class="graph-node-pill ${highestSeverity}" 
           data-node-id="${node.id}" 
           transform="translate(${node.x - halfW}, ${node.y - halfH})"
           style="opacity: 0; animation: popNode 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${animDelay}s forwards;">
          
          <!-- Pill Box Surface -->
          <rect width="${pillWidth}" height="${pillHeight}" rx="22" 
                class="pill-surface ${hasSevereRisk ? 'has-risk' : ''}"
                fill="#FFFFFF" 
                stroke="${hasSevereRisk ? (highestSeverity === 'contraindicated' ? '#7F1D1D' : '#DC2626') : '#0F766E'}" 
                stroke-width="2.2"
                filter="drop-shadow(0px 3px 6px rgba(15, 23, 42, 0.09))"
          />

          <!-- Small icon indicator -->
          <circle cx="18" cy="22" r="10" fill="${hasSevereRisk ? (highestSeverity === 'contraindicated' ? '#FEE2E2' : '#FEF2F2') : '#F0FDFA'}" />
          <text x="18" y="26" text-anchor="middle" font-size="11">${hasSevereRisk ? '⚠️' : '💊'}</text>

          <!-- Brand name (Primary bold) -->
          <text x="34" y="18" font-size="13" font-weight="700" fill="#0F172A" font-family="Noto Sans, sans-serif">
            ${node.brand ? node.brand.split(' ')[0] : node.generic}
          </text>

          <!-- Generic name (Secondary subtle) -->
          <text x="34" y="32" font-size="10.5" font-weight="500" fill="#64748B" font-family="Noto Sans, sans-serif">
            ${node.generic.length > 12 ? node.generic.substring(0, 11) + '…' : node.generic}
          </text>
        </g>
      `;
    });

    svgHtml += `</g></svg>`;

    this.container.innerHTML = svgHtml;
    this.attachEvents();
  }

  attachEvents() {
    // Click on node
    const pills = this.container.querySelectorAll('.graph-node-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const nodeId = pill.getAttribute('data-node-id');
        this.selectedNodeId = nodeId;
        pills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        this.onSelectNode(nodeId);
      });
    });

    // Click on edge
    const edges = this.container.querySelectorAll('.graph-edge');
    edges.forEach(edge => {
      edge.addEventListener('click', () => {
        const findingId = edge.getAttribute('data-finding-id');
        this.selectedEdgeId = findingId;
        edges.forEach(e => e.classList.remove('is-active'));
        edge.classList.add('is-active');
        this.onSelectEdge(findingId);
      });
    });
  }
}

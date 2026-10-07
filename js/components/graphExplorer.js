// DoseAlert - Interactive Knowledge Graph Explorer (Judges & Clinical Deliverable)
// Visualizes full graph relationships: Drugs, Brands, Drug Classes, Food Interactions, and Alternatives

import { DRUG_DICTIONARY } from '../data/drugDictionary.js';
import { DRUG_INTERACTIONS, DRUG_FOOD_INTERACTIONS, SEVERITY_LEVELS } from '../data/knowledgeGraph.js';

export class GraphExplorer {
  constructor(containerElement) {
    this.container = containerElement;
    this.filterClass = "all";
    this.selectedItem = null;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="explorer-card">
        <div class="explorer-header">
          <div>
            <h3 class="explorer-title">🌐 Clinical Knowledge Graph Explorer</h3>
            <p class="explorer-subtitle">Inspect underlying ontologies, pairwise interactions, food edges, and evidence sources.</p>
          </div>
          <div class="explorer-controls">
            <label for="classFilter" class="sr-only">Filter by class</label>
            <select id="classFilter" class="explorer-select">
              <option value="all">All Drug Classes</option>
              <option value="Anticoagulant">Anticoagulants & Antiplatelets</option>
              <option value="NSAID">NSAIDs & Analgesics</option>
              <option value="Cardiovascular">Cardiovascular & Statins</option>
              <option value="Antibiotic">Antibiotics</option>
            </select>
          </div>
        </div>

        <div class="explorer-layout">
          <!-- Graph Canvas Area -->
          <div class="explorer-graph-area" id="explorerGraphView"></div>

          <!-- Inspector Panel -->
          <div class="explorer-detail-panel" id="explorerDetailView">
            <div class="panel-empty-state">
              <span class="icon">🔍</span>
              <p>Select any node or interaction edge in the graph to view clinical metadata, RxNorm IDs, and evidence citations.</p>
            </div>
          </div>
        </div>

        <!-- Graph Schema Legend -->
        <div class="explorer-legend">
          <span class="legend-item"><span class="dot drug-dot"></span> Drug / Ingredient</span>
          <span class="legend-item"><span class="dot brand-dot"></span> Indian Brand Name</span>
          <span class="legend-item"><span class="dot food-dot"></span> Food / Drink Item</span>
          <span class="legend-item"><span class="line contra-line"></span> Contraindicated</span>
          <span class="legend-item"><span class="line major-line"></span> Major Risk</span>
          <span class="legend-item"><span class="line mod-line"></span> Moderate</span>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderGraph();
  }

  bindEvents() {
    const filter = this.container.querySelector('#classFilter');
    if (filter) {
      filter.addEventListener('change', (e) => {
        this.filterClass = e.target.value;
        this.renderGraph();
      });
    }
  }

  renderGraph() {
    const graphView = this.container.querySelector('#explorerGraphView');
    if (!graphView) return;

    // Filter drugs
    let drugs = DRUG_DICTIONARY;
    if (this.filterClass === "Anticoagulant") {
      drugs = drugs.filter(d => d.class.includes("Anticoagulant") || d.class.includes("Antiplatelet"));
    } else if (this.filterClass === "NSAID") {
      drugs = drugs.filter(d => d.class.includes("NSAID") || d.class.includes("Analgesic"));
    } else if (this.filterClass === "Cardiovascular") {
      drugs = drugs.filter(d => d.class.includes("Statin") || d.class.includes("Channel") || d.class.includes("ACE") || d.class.includes("Cardiac"));
    } else if (this.filterClass === "Antibiotic") {
      drugs = drugs.filter(d => d.class.includes("Antibiotic"));
    }

    const width = graphView.clientWidth || 640;
    const height = 380;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width * 0.36, 150);

    const nodes = drugs.map((d, i) => {
      const angle = (i / drugs.length) * 2 * Math.PI;
      return {
        ...d,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Match interactions
    const edges = [];
    for (const ddi of DRUG_INTERACTIONS) {
      const source = nodes.find(n => n.id === ddi.drugs[0]);
      const target = nodes.find(n => n.id === ddi.drugs[1]);
      if (source && target) {
        edges.push({ ddi, source, target });
      }
    }

    let svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="explorer-svg">
        <g class="edges">
    `;

    edges.forEach(edge => {
      const color = edge.ddi.severity === "contraindicated" ? "#7F1D1D" : edge.ddi.severity === "major" ? "#B91C1C" : "#B45309";
      const width = edge.ddi.severity === "contraindicated" ? 3.5 : 2;
      svg += `
        <line x1="${edge.source.x}" y1="${edge.source.y}" x2="${edge.target.x}" y2="${edge.target.y}"
              stroke="${color}" stroke-width="${width}" opacity="0.85"
              class="explorer-edge-line" data-edge-id="${edge.ddi.id}" />
      `;
    });

    svg += `</g><g class="nodes">`;

    nodes.forEach(node => {
      svg += `
        <g class="explorer-node" data-node-id="${node.id}" transform="translate(${node.x}, ${node.y})">
          <circle cx="0" cy="0" r="22" fill="#0F766E" stroke="#FFFFFF" stroke-width="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"/>
          <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="bold" fill="#FFFFFF">${node.generic.substring(0, 4)}</text>
          <text x="0" y="36" text-anchor="middle" font-size="11" font-weight="600" fill="#0F172A">${node.generic}</text>
        </g>
      `;
    });

    svg += `</g></svg>`;

    graphView.innerHTML = svg;

    // Attach click events
    graphView.querySelectorAll('.explorer-node').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-node-id');
        const drug = DRUG_DICTIONARY.find(d => d.id === id);
        this.showDrugDetail(drug);
      });
    });

    graphView.querySelectorAll('.explorer-edge-line').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-edge-id');
        const ddi = DRUG_INTERACTIONS.find(d => d.id === id);
        this.showInteractionDetail(ddi);
      });
    });
  }

  showDrugDetail(drug) {
    const detail = this.container.querySelector('#explorerDetailView');
    if (!detail || !drug) return;

    // Find related interactions
    const relatedDDIs = DRUG_INTERACTIONS.filter(d => d.drugs.includes(drug.id));
    const relatedFood = DRUG_FOOD_INTERACTIONS.filter(f => f.generic_code === drug.id);

    detail.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-tag">${drug.class}</span>
          <h4 class="panel-title">${drug.generic}</h4>
          <div class="code-chips">
            <span class="chip">ATC: ${drug.atc}</span>
            <span class="chip">RxNorm: ${drug.rxnorm}</span>
          </div>
        </div>
        
        <div class="panel-section">
          <strong>Indian Brands in Database:</strong>
          <p class="brand-list">${drug.brands.join(", ")}</p>
        </div>

        <div class="panel-section">
          <strong>Identified Interactions (${relatedDDIs.length}):</strong>
          <ul class="mini-list">
            ${relatedDDIs.map(d => `<li class="severity-${d.severity}"><strong>${d.drugNames.join(" + ")}</strong>: ${d.severity.toUpperCase()}</li>`).join('')}
          </ul>
        </div>

        ${relatedFood.length > 0 ? `
          <div class="panel-section">
            <strong>Dietary Precautions:</strong>
            <p class="food-text">${relatedFood.map(f => `⚠️ ${f.foodName}: ${f.advicePatientEn}`).join('<br>')}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  showInteractionDetail(ddi) {
    const detail = this.container.querySelector('#explorerDetailView');
    if (!detail || !ddi) return;

    detail.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <span class="severity-badge severity-${ddi.severity}">${ddi.severity.toUpperCase()} INTERACTION</span>
          <h4 class="panel-title">${ddi.drugNames.join(" + ")}</h4>
        </div>

        <div class="panel-section">
          <strong>Pharmacological Mechanism:</strong>
          <p>${ddi.mechanism}</p>
        </div>

        <div class="panel-section">
          <strong>Clinical Effect:</strong>
          <p>${ddi.clinical_effect}</p>
        </div>

        <div class="panel-section">
          <strong>Evidence Source:</strong>
          <p><a href="${ddi.source.url}" target="_blank" rel="noopener">${ddi.source.name}</a> (Ref: ${ddi.source.referenceId})</p>
        </div>
      </div>
    `;
  }
}

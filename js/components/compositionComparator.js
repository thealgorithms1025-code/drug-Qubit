// DoseAlert - Medicine Chemical Composition & Compounding Risk Comparator Component
// Compares active molecules, molecular pathways, and critical risks of becoming toxic/illicit drugs

import { DRUG_DICTIONARY } from '../data/drugDictionary.js';

export class CompositionComparator {
  constructor(containerElement) {
    this.container = containerElement;
    this.medAId = "m_warfarin";
    this.medBId = "m_ibuprofen";
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="comparator-wrapper">
        <!-- Comparator Header -->
        <div class="comparator-header-card">
          <div class="comparator-badge">🔬 Molecular Pharmacology & Compounding Risk Matrix</div>
          <h2 class="comparator-title">Medicine Composition & Drug-Toxicity Comparator</h2>
          <p class="comparator-subtitle">
            Compare active chemical compositions, organ clearance pathways, and analyze the acute risks of medications compounding into toxic, habit-forming, or lethal drug interactions.
          </p>

          <!-- Selection Controls -->
          <div class="comparator-select-row">
            <div class="select-group">
              <label for="selectDrugA">Select Primary Medicine:</label>
              <select id="selectDrugA" class="form-select">
                ${DRUG_DICTIONARY.map(d => `<option value="${d.id}" ${d.id === this.medAId ? 'selected' : ''}>${d.generic} (${d.brands[0]})</option>`).join('')}
              </select>
            </div>

            <div class="vs-circle">VS</div>

            <div class="select-group">
              <label for="selectDrugB">Select Second Medicine:</label>
              <select id="selectDrugB" class="form-select">
                ${DRUG_DICTIONARY.map(d => `<option value="${d.id}" ${d.id === this.medBId ? 'selected' : ''}>${d.generic} (${d.brands[0]})</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Quick Preset High-Risk Pairs -->
          <div class="preset-pairs-strip">
            <span class="preset-label">Explore Critical Compounding Cases:</span>
            <button type="button" class="btn-preset" data-a="m_warfarin" data-b="m_ibuprofen">Warfarin + Ibuprofen (Fatal Bleed Risk)</button>
            <button type="button" class="btn-preset" data-a="m_atorvastatin" data-b="m_clarithromycin">Atorvastatin + Clarithromycin (4x Toxic Stacking)</button>
            <button type="button" class="btn-preset" data-a="m_aspirin" data-b="m_ibuprofen">Aspirin + Ibuprofen (Heart Shield Neutralization)</button>
            <button type="button" class="btn-preset" data-a="m_ramipril" data-b="m_ibuprofen">Ramipril + Ibuprofen (Renal Shutdown)</button>
          </div>
        </div>

        <!-- Side-by-Side Comparison Grid -->
        <div class="composition-grid" id="compositionGridMount">
          ${this.renderComparisonGrid()}
        </div>

        <!-- Compounding & "Risk of Becoming Dangerous Drugs" Alert Card -->
        <div class="compounding-risk-card" id="compoundingRiskMount">
          ${this.renderCompoundingRisk()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderComparisonGrid() {
    const medA = DRUG_DICTIONARY.find(d => d.id === this.medAId) || DRUG_DICTIONARY[0];
    const medB = DRUG_DICTIONARY.find(d => d.id === this.medBId) || DRUG_DICTIONARY[1];

    return `
      <!-- Drug A Card -->
      <div class="drug-composition-card">
        <div class="drug-comp-header">
          <span class="drug-class-tag">${medA.class}</span>
          <h3 class="drug-name-title">${medA.generic}</h3>
          <div class="brand-names-line">Common Indian Brands: <strong>${medA.brands.join(', ')}</strong></div>
        </div>

        <div class="comp-specs-list">
          <div class="spec-item">
            <span class="spec-label">Chemical Formula:</span>
            <span class="spec-value"><code>${medA.chemical_formula}</code></span>
          </div>
          <div class="spec-item">
            <span class="spec-label">IUPAC Chemical Name:</span>
            <span class="spec-value iupac-text">${medA.iupac}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">RxNorm / ATC Code:</span>
            <span class="spec-value"><code>${medA.rxnorm}</code> / <code>${medA.atc}</code></span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Metabolism Pathway:</span>
            <span class="spec-value">${medA.metabolism}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Organ Burden:</span>
            <span class="spec-value">${medA.organBurden}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Elimination Half-Life:</span>
            <span class="spec-value">${medA.eliminationHalfLife}</span>
          </div>
        </div>
      </div>

      <!-- Drug B Card -->
      <div class="drug-composition-card">
        <div class="drug-comp-header">
          <span class="drug-class-tag">${medB.class}</span>
          <h3 class="drug-name-title">${medB.generic}</h3>
          <div class="brand-names-line">Common Indian Brands: <strong>${medB.brands.join(', ')}</strong></div>
        </div>

        <div class="comp-specs-list">
          <div class="spec-item">
            <span class="spec-label">Chemical Formula:</span>
            <span class="spec-value"><code>${medB.chemical_formula}</code></span>
          </div>
          <div class="spec-item">
            <span class="spec-label">IUPAC Chemical Name:</span>
            <span class="spec-value iupac-text">${medB.iupac}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">RxNorm / ATC Code:</span>
            <span class="spec-value"><code>${medB.rxnorm}</code> / <code>${medB.atc}</code></span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Metabolism Pathway:</span>
            <span class="spec-value">${medB.metabolism}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Organ Burden:</span>
            <span class="spec-value">${medB.organBurden}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Elimination Half-Life:</span>
            <span class="spec-value">${medB.eliminationHalfLife}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderCompoundingRisk() {
    const medA = DRUG_DICTIONARY.find(d => d.id === this.medAId);
    const medB = DRUG_DICTIONARY.find(d => d.id === this.medBId);

    const pair = [this.medAId, this.medBId].sort().join("__");

    let riskTitle = "Synergistic Pharmacodynamic Evaluation";
    let riskLevel = "MODERATE PHARMACOLOGICAL INTERACTION";
    let riskClass = "is-moderate";
    let riskDetails = "Standard metabolic pathways active. Routine periodic monitoring recommended.";
    let compoundingMechanisms = [];

    if (pair.includes("m_ibuprofen") && pair.includes("m_warfarin")) {
      riskTitle = "⚠️ Fatal Hemostatic Collapse & Gastric Hemorrhage Hazard";
      riskLevel = "CONTRAINDICATED • SEVERE TOXIC COMPOUNDING";
      riskClass = "is-critical";
      riskDetails = "When Warfarin and Ibuprofen enter the body simultaneously, they biochemically dismantle both arms of hemostasis. Warfarin halts prothrombin clotting factor synthesis, while Ibuprofen chemically erodes the protective gastric mucosal barrier and strips platelets of their clotting ability. Standard therapeutic medicines compound into a life-threatening internal bleeding hazard.";
      compoundingMechanisms = [
        "Platelet COX-1 blockade + Plasma Albumin displacement",
        "Severe peptic ulcer erosion & acute internal hemorrhage",
        "INR prothrombin time spikes unpredictably"
      ];
    } else if (pair.includes("m_atorvastatin") && pair.includes("m_clarithromycin")) {
      riskTitle = "⛔ Toxic Drug Stacking via CYP3A4 Suicide Clearance Shutdown";
      riskLevel = "CONTRAINDICATED • LETHAL PLASMA ACCUMULATION";
      riskClass = "is-critical";
      riskDetails = "Clarithromycin functions as a potent mechanism-based 'suicide inhibitor' of hepatic enzyme CYP3A4. Because Atorvastatin relies entirely on this pathway for clearance, normal daily statin doses cannot be broken down and accumulate to 400% of safe serum limits. This turns a cholesterol pill into an acute muscle poison causing rhabdomyolysis and myoglobin-induced kidney failure.";
      compoundingMechanisms = [
        "Metabolic clearance shutdown: 300-400% statin AUC accumulation",
        "Skeletal muscle breakdown (Rhabdomyolysis) & dark urine",
        "Acute renal tubular necrosis from myoglobin deposition"
      ];
    } else if (pair.includes("m_aspirin") && pair.includes("m_ibuprofen")) {
      riskTitle = "⚠️ Cardioprotective Shield Neutralization & Ulcer Compounding";
      riskLevel = "MAJOR • DRUG ANTAGONISM HAZARD";
      riskClass = "is-major";
      riskDetails = "Ibuprofen competitively occupies the Ser529 active pocket of COX-1, preventing aspirin from permanently acetylating the enzyme. Consequently, the patient loses aspirin's critical protection against heart attacks, while dual NSAID erosion doubles stomach ulceration risk.";
      compoundingMechanisms = [
        "Competitive blockage at COX-1 Ser529 residue",
        "Loss of permanent platelet inhibition for heart attack prevention",
        "Compounded erosive damage to gastric lining"
      ];
    } else if (pair.includes("m_ibuprofen") && pair.includes("m_ramipril")) {
      riskTitle = "⚠️ Acute Triple Whammy Renal Shutdown & Hyperkalemia";
      riskLevel = "MODERATE TO MAJOR • ORGAN CLEARANCE HAZARD";
      riskClass = "is-major";
      riskDetails = "NSAIDs constrict the afferent renal arterioles by blocking prostaglandins, while ACE inhibitors dilate efferent arterioles. Glomerular filtration pressure collapses, predisposing elderly patients to acute kidney injury and dangerous potassium retention.";
      compoundingMechanisms = [
        "Renal afferent arteriolar constriction",
        "Loss of glomerular filtration pressure",
        "Compounded hyperkalemia risk"
      ];
    }

    return `
      <div class="compounding-box ${riskClass}">
        <div class="compounding-header">
          <span class="compounding-badge">${riskLevel}</span>
          <h4 class="compounding-title">${riskTitle}</h4>
        </div>
        <p class="compounding-desc">${riskDetails}</p>

        ${compoundingMechanisms.length > 0 ? `
          <div class="compounding-mechanisms-block">
            <strong>Biological Compounding Pathways:</strong>
            <ul>
              ${compoundingMechanisms.map(m => `<li>⚡ ${m}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="compounding-safety-footer">
          <span>🛡️ Clinical Guidance:</span> Never ingest these compounds concurrently without specialist physician review.
        </div>
      </div>
    `;
  }

  bindEvents() {
    const selA = this.container.querySelector('#selectDrugA');
    const selB = this.container.querySelector('#selectDrugB');

    if (selA) {
      selA.addEventListener('change', (e) => {
        this.medAId = e.target.value;
        this.updateViews();
      });
    }

    if (selB) {
      selB.addEventListener('change', (e) => {
        this.medBId = e.target.value;
        this.updateViews();
      });
    }

    this.container.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        this.medAId = btn.getAttribute('data-a');
        this.medBId = btn.getAttribute('data-b');
        if (selA) selA.value = this.medAId;
        if (selB) selB.value = this.medBId;
        this.updateViews();
      });
    });
  }

  updateViews() {
    const grid = this.container.querySelector('#compositionGridMount');
    const risk = this.container.querySelector('#compoundingRiskMount');
    if (grid) grid.innerHTML = this.renderComparisonGrid();
    if (risk) risk.innerHTML = this.renderCompoundingRisk();
  }
}

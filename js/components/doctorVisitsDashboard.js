// DoseAlert - Patient Doctor Visits & Multi-Prescriber Dashboard Component
// Visualizes patient visits across multiple specialists with cross-doctor conflict flags

import { PATIENT_DOCTOR_VISITS } from '../data/drugDictionary.js';

export class DoctorVisitsDashboard {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.visits = [...PATIENT_DOCTOR_VISITS];
    this.activeFilter = "all";
    this.onAnalyzeSelected = options.onAnalyzeSelected || (() => {});
    this.onAddVisit = options.onAddVisit || (() => {});
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="doctor-visits-wrapper">
        <!-- Dashboard Header & Patient Banner -->
        <div class="visits-dashboard-header">
          <div class="patient-profile-strip">
            <div class="patient-avatar-box">👴</div>
            <div class="patient-meta">
              <h2 class="patient-name">Ramesh Chander (68 M)</h2>
              <p class="patient-history">Polypharmacy Patient Profile • 5 Active Specialists • 9 Prescribed Agents</p>
            </div>
            <div class="visits-quick-action">
              <button type="button" class="btn-primary btn-run-all-analysis" id="btnAnalyzeAllVisits">
                <span>🛡️</span> Check All 5 Doctors' Prescriptions
              </button>
            </div>
          </div>
        </div>

        <!-- Cross-Doctor Alert Ribbon -->
        <div class="cross-prescriber-warning-ribbon">
          <div class="ribbon-icon">⚠️</div>
          <div class="ribbon-content">
            <strong>Cross-Prescriber Care Fragmentation Detected:</strong>
            <p>5 independent doctors have prescribed medications without a shared record. Multiple prescriptions directly clash (e.g., Orthopaedist prescribed NSAID conflicting with Cardiologist's anticoagulant, and Pulmonologist prescribed antibiotic causing severe statin toxicity).</p>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="visits-filter-strip">
          <div class="filter-buttons">
            <button type="button" class="filter-chip is-active" data-filter="all">All Visits (5)</button>
            <button type="button" class="filter-chip" data-filter="cardio">Cardiology</button>
            <button type="button" class="filter-chip" data-filter="ortho">Orthopaedics</button>
            <button type="button" class="filter-chip" data-filter="diab">Diabetology</button>
            <button type="button" class="filter-chip" data-filter="gp">General Med</button>
            <button type="button" class="filter-chip" data-filter="pulmo">Pulmonology</button>
          </div>
          <button type="button" class="btn-secondary btn-add-doctor-visit" id="btnOpenAddVisitModal">
            <span>➕</span> Add Doctor Visit
          </button>
        </div>

        <!-- Doctor Visit Timeline Cards -->
        <div class="visits-card-timeline" id="visitsCardsMount">
          ${this.renderVisitCards()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderVisitCards() {
    const filtered = this.activeFilter === "all"
      ? this.visits
      : this.visits.filter(v => v.specialtyCode === this.activeFilter);

    if (filtered.length === 0) {
      return `<div class="empty-visits">No visits found for this filter.</div>`;
    }

    return filtered.map((visit, idx) => `
      <div class="visit-card" data-visit-id="${visit.id}">
        <!-- Visit Card Header -->
        <div class="visit-card-header">
          <div class="doc-info-block">
            <div class="doc-avatar" style="background-color: ${visit.badgeColor}15; border-color: ${visit.badgeColor};">
              ${visit.avatar}
            </div>
            <div>
              <h3 class="doc-name">${visit.doctorName}</h3>
              <div class="doc-specialty-line">
                <span class="specialty-badge" style="background-color: ${visit.badgeColor}; color: #FFFFFF;">${visit.specialty}</span>
                <span class="hospital-name">${visit.hospital}</span>
              </div>
            </div>
          </div>
          <div class="visit-date-badge">
            <span class="date-str">📅 ${visit.date}</span>
            <span class="days-ago">(${visit.daysAgo})</span>
          </div>
        </div>

        <!-- Diagnosis & Prescription Preview -->
        <div class="visit-diagnosis-row">
          <strong>Diagnosis:</strong> <span>${visit.diagnosis}</span>
        </div>

        <div class="visit-medicines-section">
          <strong>Prescribed Medicines (${visit.medicines.length}):</strong>
          <div class="visit-med-chips">
            ${visit.medicines.map(m => `
              <span class="visit-med-chip">
                💊 <strong>${m.brand}</strong> <small>(${m.generic})</small>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Conflict Badge Notice -->
        <div class="visit-conflict-notice ${visit.conflictNotice.includes('⛔') ? 'is-contra' : ''}">
          ${visit.conflictNotice}
        </div>

        <!-- Footer Actions -->
        <div class="visit-card-footer">
          <button type="button" class="btn-text-link btn-view-rx-photo" data-rx-img="${visit.rxImage}">
            <span>📄 View Doctor's Prescription Photo</span>
          </button>
          <button type="button" class="btn-secondary btn-select-for-check" data-rx-id="${visit.rxId}" style="min-height: 40px; font-size: 14px; padding: 4px 14px;">
            <span>🛡️ Check with Other Prescriptions</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  bindEvents() {
    // Filter chips
    this.container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        this.activeFilter = chip.getAttribute('data-filter');
        const mount = this.container.querySelector('#visitsCardsMount');
        if (mount) mount.innerHTML = this.renderVisitCards();
        this.bindEvents(); // re-bind card buttons
      });
    });

    // Run All Analysis
    const btnAll = this.container.querySelector('#btnAnalyzeAllVisits');
    if (btnAll) {
      btnAll.addEventListener('click', () => {
        this.onAnalyzeSelected(this.visits.map(v => v.rxId));
      });
    }

    // Select single Rx to check
    this.container.querySelectorAll('.btn-select-for-check').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rxId = btn.getAttribute('data-rx-id');
        this.onAnalyzeSelected([rxId, 'rx_cardio']); // pairwise with cardio baseline
      });
    });

    // View Rx Photo
    this.container.querySelectorAll('.btn-view-rx-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const img = btn.getAttribute('data-rx-img');
        alert(`Opening high-resolution scanned prescription from ${btn.closest('.visit-card').querySelector('.doc-name').textContent}`);
      });
    });

    // Open Add Visit Modal
    const btnAdd = this.container.querySelector('#btnOpenAddVisitModal');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        this.onAddVisit();
      });
    }
  }

  addNewVisit(visitData) {
    this.visits.unshift(visitData);
    this.render();
  }
}

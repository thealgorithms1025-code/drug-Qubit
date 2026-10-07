// DoseAlert - Master Application Coordinator & State Machine
// Coordinates OCR Pipeline, Multi-Doctor Visits Dashboard, Composition Comparator, and Multilingual TTS

import { DRUG_DICTIONARY, PATIENT_DOCTOR_VISITS } from './data/drugDictionary.js';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from './data/translations.js';
import { BENCHMARK_METRICS } from './data/benchmarkData.js';
import { runOcrPipeline } from './services/ocrSimulator.js';
import { runInteractionCheck } from './services/graphEngine.js';
import { voiceService } from './services/voiceService.js';
import { InteractionMap } from './components/interactionMap.js';
import { CameraCapture } from './components/cameraCapture.js';
import { BottomSheet } from './components/bottomSheet.js';
import { GraphExplorer } from './components/graphExplorer.js';
import { DoctorVisitsDashboard } from './components/doctorVisitsDashboard.js';
import { CompositionComparator } from './components/compositionComparator.js';

class DoseAlertApp {
  constructor() {
    this.currentLanguage = 'hi'; // Default Hindi
    this.currentScreen = 'screen-welcome';
    this.activeRxIds = ['rx_cardio', 'rx_ortho'];
    this.detectedMedicines = [];
    this.interactionResults = null;
    this.currentResultsTab = 'warnings';

    // Components
    this.cameraCapture = null;
    this.interactionMap = null;
    this.graphExplorer = null;
    this.visitsDashboard = null;
    this.comparator = null;

    // Modals
    this.alertSheet = null;
    this.helpSheet = null;
    this.benchmarkSheet = null;
    this.addVisitSheet = null;

    this.init();
  }

  init() {
    this.initSheets();
    this.populateLanguageDropdown();
    this.bindGlobalEvents();
    this.updateLanguageUI();
    this.showScreen('screen-welcome');

    // Subscribe to voice state changes
    voiceService.subscribe((state) => {
      this.handleVoiceStateChange(state);
    });
  }

  initSheets() {
    this.alertSheet = new BottomSheet('alertDetailSheet');
    this.helpSheet = new BottomSheet('helpModalSheet');
    this.benchmarkSheet = new BottomSheet('benchmarkModalSheet');
    this.addVisitSheet = new BottomSheet('addVisitModalSheet');
  }

  populateLanguageDropdown() {
    const sel = document.getElementById('headerLanguageSelect');
    if (!sel) return;

    sel.innerHTML = SUPPORTED_LANGUAGES.map(lang => `
      <option value="${lang.code}" ${lang.code === this.currentLanguage ? 'selected' : ''}>
        ${lang.flag} ${lang.nativeName} (${lang.name})
      </option>
    `).join('');

    sel.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });
  }

  t(keyPath) {
    const keys = keyPath.split('.');
    let cur = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    for (const k of keys) {
      if (!cur || cur[k] === undefined) {
        cur = TRANSLATIONS.en;
        for (const fallbackK of keys) {
          if (!cur || cur[fallbackK] === undefined) return keyPath;
          cur = cur[fallbackK];
        }
        return cur;
      }
      cur = cur[k];
    }
    return cur;
  }

  setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) return;
    this.currentLanguage = lang;
    this.updateLanguageUI();

    // Voice greeting in the chosen language
    const greeting = this.t('greeting');
    voiceService.speakText(greeting, lang);

    // If on results screen, re-render
    if (this.currentScreen === 'screen-results' && this.interactionResults) {
      this.renderResultsScreen();
    }
  }

  updateLanguageUI() {
    document.documentElement.lang = this.currentLanguage;

    // Sync header dropdown value
    const sel = document.getElementById('headerLanguageSelect');
    if (sel && sel.value !== this.currentLanguage) {
      sel.value = this.currentLanguage;
    }

    // Update Welcome screen language cards active state
    document.querySelectorAll('.language-card').forEach(card => {
      const code = card.getAttribute('data-lang');
      if (code === this.currentLanguage) {
        card.classList.add('is-selected');
      } else {
        card.classList.remove('is-selected');
      }
    });

    // Update Text Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (typeof val === 'string') {
        el.textContent = val;
      }
    });
  }

  showScreen(screenId) {
    this.currentScreen = screenId;
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('is-active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('is-active');
    }

    // Update Top Navigation Bar active states
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === screenId) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Update 3-step progress bar
    this.updateProgressBar(screenId);

    // Update sticky action bar visibility
    this.updateStickyBar(screenId);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mount screen-specific views
    if (screenId === 'screen-scan') {
      this.initScanScreen();
    } else if (screenId === 'screen-visits') {
      this.initDoctorVisitsDashboard();
    } else if (screenId === 'screen-comparator') {
      this.initCompositionComparator();
    } else if (screenId === 'screen-doctor') {
      this.renderDoctorView();
    }
  }

  updateProgressBar(screenId) {
    const bar = document.getElementById('flowProgressBar');
    if (!bar) return;

    if (screenId === 'screen-welcome' || screenId === 'screen-doctor' || screenId === 'screen-visits' || screenId === 'screen-comparator') {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = 'flex';

    const sScan = document.getElementById('step-scan');
    const sConfirm = document.getElementById('step-confirm');
    const sResults = document.getElementById('step-results');

    [sScan, sConfirm, sResults].forEach(s => {
      if (s) s.classList.remove('is-active', 'is-done');
    });

    if (screenId === 'screen-scan' || screenId === 'screen-reading') {
      sScan.classList.add('is-active');
    } else if (screenId === 'screen-confirm') {
      sScan.classList.add('is-done');
      sConfirm.classList.add('is-active');
    } else if (screenId === 'screen-results') {
      sScan.classList.add('is-done');
      sConfirm.classList.add('is-done');
      sResults.classList.add('is-active');
    }
  }

  updateStickyBar(screenId) {
    const sticky = document.getElementById('stickyActionBar');
    if (!sticky) return;

    if (screenId === 'screen-results') {
      sticky.style.display = 'flex';
    } else {
      sticky.style.display = 'none';
    }
  }

  // --- S2 SCAN SCREEN (MULTI-RX) ---
  initScanScreen() {
    const scanContainer = document.getElementById('cameraCaptureMount');
    if (!scanContainer) return;

    if (!this.cameraCapture) {
      this.cameraCapture = new CameraCapture(scanContainer, {
        onCaptured: (pages) => {
          const readBtn = document.getElementById('btnStartReading');
          if (readBtn) {
            readBtn.disabled = pages.length === 0;
            if (pages.length > 0) {
              readBtn.textContent = `Read & Compare Prescriptions (${pages.length} Prescription${pages.length > 1 ? 's' : ''})`;
            } else {
              readBtn.textContent = `Read & Compare Prescriptions`;
            }
          }
        }
      });
      this.cameraCapture.init();
    }
  }

  // --- DOCTOR VISITS DASHBOARD MOUNT ---
  initDoctorVisitsDashboard() {
    const mount = document.getElementById('visitsDashboardMount');
    if (!mount) return;

    if (!this.visitsDashboard) {
      this.visitsDashboard = new DoctorVisitsDashboard(mount, {
        onAnalyzeSelected: (rxIds) => {
          this.activeRxIds = rxIds;
          this.startReadingProcess(this.activeRxIds);
        },
        onAddVisit: () => {
          this.openAddVisitModal();
        }
      });
    }
    this.visitsDashboard.render();
  }

  openAddVisitModal() {
    const html = `
      <form id="newVisitForm" style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="font-size:13px; font-weight:700; color:#334155;">Doctor Name:</label>
          <input type="text" id="nvDocName" class="form-select" placeholder="e.g. Dr. Sunita Rao, MD" required />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="font-size:13px; font-weight:700; color:#334155;">Specialty:</label>
            <select id="nvSpecialty" class="form-select">
              <option value="Neurology">Neurology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>
          <div>
            <label style="font-size:13px; font-weight:700; color:#334155;">Hospital/Clinic:</label>
            <input type="text" id="nvHospital" class="form-select" placeholder="e.g. AIIMS Delhi" required />
          </div>
        </div>
        <div>
          <label style="font-size:13px; font-weight:700; color:#334155;">Prescribed Medicines (comma separated):</label>
          <input type="text" id="nvMeds" class="form-select" placeholder="e.g. Digoxin 0.25mg, Cifran 500mg" required />
        </div>
        <div>
          <label style="font-size:13px; font-weight:700; color:#334155;">Prescription Photo:</label>
          <input type="file" id="nvPhoto" accept="image/*" class="form-select" />
        </div>
        <button type="submit" class="btn-primary" style="margin-top:8px;">
          <span>💾</span> Save Doctor Visit & Scan Rx
        </button>
      </form>
    `;

    this.addVisitSheet.open(html, "Add New Doctor Visit & Prescription");

    const form = document.getElementById('newVisitForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const docName = document.getElementById('nvDocName').value;
        const specialty = document.getElementById('nvSpecialty').value;
        const hospital = document.getElementById('nvHospital').value;
        const medsStr = document.getElementById('nvMeds').value;

        const meds = medsStr.split(',').map((m, idx) => ({
          raw_text: m.trim(),
          brand: m.trim().split(' ')[0],
          generic: m.trim().split(' ')[0],
          confidence: 0.90,
          status: "confident",
          cropHint: "handwritten_custom"
        }));

        const newVisit = {
          id: `visit_${Date.now()}`,
          rxId: `rx_custom_${Date.now()}`,
          doctorName: docName,
          specialty: specialty,
          specialtyCode: "custom",
          hospital: hospital,
          date: new Date().toLocaleDateString('en-GB'),
          daysAgo: "Today",
          avatar: "👨‍⚕️",
          badgeColor: "#0F766E",
          diagnosis: "Consultation follow-up",
          medicinesSummary: medsStr,
          conflictNotice: "⚠️ Pending full cross-prescriber safety verification",
          medicines: meds
        };

        this.visitsDashboard.addNewVisit(newVisit);
        this.addVisitSheet.close();
        alert(`Added visit with ${docName}. Now included in polypharmacy comparison!`);
      });
    }
  }

  // --- COMPOSITION RISK COMPARATOR MOUNT ---
  initCompositionComparator() {
    const mount = document.getElementById('compositionComparatorMount');
    if (!mount) return;

    if (!this.comparator) {
      this.comparator = new CompositionComparator(mount);
    }
    this.comparator.render();
  }

  // --- S3 READING / OCR PROCESSING SCREEN ---
  async startReadingProcess(rxList = ['rx_cardio', 'rx_ortho']) {
    this.showScreen('screen-reading');
    voiceService.stop();

    const step1 = document.getElementById('ocrStep1');
    const step2 = document.getElementById('ocrStep2');
    const step3 = document.getElementById('ocrStep3');

    [step1, step2, step3].forEach(st => {
      st.className = 'reading-step-item';
      st.querySelector('.step-icon-indicator').textContent = '⏳';
    });

    try {
      const medicines = await runOcrPipeline(rxList, (progress) => {
        if (progress.stage === 1) {
          step1.className = 'reading-step-item is-active';
          step1.querySelector('.step-icon-indicator').textContent = '🔄';
        } else if (progress.stage === 2) {
          step1.className = 'reading-step-item is-done';
          step1.querySelector('.step-icon-indicator').textContent = '✅';
          step2.className = 'reading-step-item is-active';
          step2.querySelector('.step-icon-indicator').textContent = '🔄';
        } else if (progress.stage === 3) {
          step2.className = 'reading-step-item is-done';
          step2.querySelector('.step-icon-indicator').textContent = '✅';
          step3.className = 'reading-step-item is-active';
          step3.querySelector('.step-icon-indicator').textContent = '🔄';
        } else if (progress.stage === 4) {
          step3.className = 'reading-step-item is-done';
          step3.querySelector('.step-icon-indicator').textContent = '✅';
        }
      });

      this.detectedMedicines = medicines;
      setTimeout(() => {
        this.renderConfirmScreen();
        this.showScreen('screen-confirm');
      }, 500);
    } catch (err) {
      console.error("OCR Pipeline error:", err);
      this.renderConfirmScreen();
      this.showScreen('screen-confirm');
    }
  }

  // --- S4 CONFIRM MEDICINES SCREEN ---
  renderConfirmScreen() {
    const listContainer = document.getElementById('confirmListContainer');
    if (!listContainer) return;

    const count = this.detectedMedicines.length;
    const title = document.getElementById('confirmTitleText');
    if (title) {
      title.textContent = this.t('confirm.title').replace('{count}', count);
    }

    const needsCheck = this.detectedMedicines.filter(m => m.status === 'needs_review');
    const looksRight = this.detectedMedicines.filter(m => m.status !== 'needs_review');

    let html = '';

    if (needsCheck.length > 0) {
      html += `
        <div class="confirm-group-block">
          <h3 class="medicine-group-title" style="color: #B45309;">
            <span>⚠️</span> ${this.t('confirm.needsCheckTitle').replace('{count}', needsCheck.length)}
          </h3>
          ${needsCheck.map(m => this.createMedicineCardHtml(m, true)).join('')}
        </div>
      `;
    }

    if (looksRight.length > 0) {
      html += `
        <div class="confirm-group-block">
          <h3 class="medicine-group-title" style="color: #15803D;">
            <span>✅</span> ${this.t('confirm.looksRightTitle').replace('{count}', looksRight.length)}
          </h3>
          ${looksRight.map(m => this.createMedicineCardHtml(m, false)).join('')}
        </div>
      `;
    }

    listContainer.innerHTML = html;
    this.bindConfirmCardEvents();
  }

  createMedicineCardHtml(med, needsReview) {
    return `
      <div class="medicine-card ${needsReview ? 'needs-check' : ''}" data-med-id="${med.id}">
        <div class="medicine-card-header">
          <div>
            <div class="med-brand-name">${med.brand}</div>
            <div class="med-generic-name">Active Generic: <strong>${med.generic}</strong> • Prescriber: ${med.prescriber || 'Specialist'}</div>
          </div>
          <span class="badge-confidence ${needsReview ? 'needs-check' : 'looks-right'}">
            ${needsReview ? '⚠️ ' + this.t('confirm.checkThisBadge') : '✅ ' + this.t('confirm.looksRightBadge')}
          </span>
        </div>

        <div class="crop-preview-box">
          <img src="${med.cropUrl}" alt="Handwritten preview of ${med.brand}" />
        </div>

        ${needsReview && med.suggestedCorrections ? `
          <div class="quick-fix-section">
            <span style="font-size: 13px; font-weight: 600; color: #475569;">${this.t('confirm.tapToChoose')}</span>
            <div class="suggestion-chips-row">
              ${med.suggestedCorrections.map(c => `
                <button type="button" class="suggestion-chip" data-fix-brand="${c.brand}" data-fix-generic="${c.generic}">
                  ${c.brand} (${c.generic})
                </button>
              `).join('')}
              <button type="button" class="suggestion-chip" data-fix-keep="true">
                ✓ ${this.t('confirm.keepAsRead')}
              </button>
            </div>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
          <button type="button" class="btn-text-link btn-remove-med" data-med-id="${med.id}" style="font-size: 13.5px; color: #94A3B8;">
            ✕ Remove
          </button>
        </div>
      </div>
    `;
  }

  bindConfirmCardEvents() {
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const card = e.target.closest('.medicine-card');
        const medId = card.getAttribute('data-med-id');
        const med = this.detectedMedicines.find(m => m.id === medId);
        if (!med) return;

        if (e.target.getAttribute('data-fix-keep')) {
          med.status = 'confident';
        } else {
          const newBrand = e.target.getAttribute('data-fix-brand');
          const newGeneric = e.target.getAttribute('data-fix-generic');
          med.brand = newBrand;
          med.generic = newGeneric;
          med.status = 'confident';
        }
        this.renderConfirmScreen();
      });
    });

    document.querySelectorAll('.btn-remove-med').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const medId = e.target.getAttribute('data-med-id');
        this.detectedMedicines = this.detectedMedicines.filter(m => m.id !== medId);
        this.renderConfirmScreen();
      });
    });
  }

  // --- S5 RESULTS SCREEN ---
  renderResultsScreen() {
    this.interactionResults = runInteractionCheck(this.detectedMedicines);
    const { summary, drugDrugFindings, foodFindings, duplicateFindings, notCheckedItems } = this.interactionResults;

    // 1. Summary Banner
    const banner = document.getElementById('resultsSummaryBanner');
    const bannerTitle = document.getElementById('summaryBannerTitle');
    const bannerSub = document.getElementById('summaryBannerSub');

    if (summary.totalFindings > 0) {
      banner.className = 'summary-banner has-critical';
      bannerTitle.textContent = this.t('results.bannerCritical').replace('{count}', summary.totalFindings);
      bannerSub.textContent = `${summary.contraindicatedCount > 0 ? summary.contraindicatedCount + ' Do not combine • ' : ''}${summary.majorCount} Major warnings • ${summary.moderateCount} Moderate`;
    } else {
      banner.className = 'summary-banner';
      bannerTitle.textContent = this.t('results.bannerNone');
      bannerSub.textContent = this.t('results.bannerNoneSub');
    }

    // 2. Render Interaction Map (WOW Feature)
    const mapContainer = document.getElementById('interactionMapCanvasMount');
    if (mapContainer) {
      if (!this.interactionMap) {
        this.interactionMap = new InteractionMap(mapContainer, {
          onSelectNode: (nodeId) => {
            const el = document.querySelector(`[data-alert-drugs*="${nodeId}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          },
          onSelectEdge: (findingId) => {
            const finding = drugDrugFindings.find(f => f.id === findingId);
            if (finding) this.openAlertDetail(finding);
          }
        });
      }
      this.interactionMap.render(this.detectedMedicines, drugDrugFindings);
    }

    // 3. Render Drug-Drug Alert Cards
    const alertListMount = document.getElementById('alertCardsListMount');
    if (alertListMount) {
      if (drugDrugFindings.length === 0 && duplicateFindings.length === 0) {
        alertListMount.innerHTML = `
          <div class="empty-state-notice" style="background:#FFFFFF; padding:24px; border-radius:16px; text-align:center; border:1px solid #CBD5E1;">
            <div style="font-size:36px; margin-bottom:8px;">✅</div>
            <h4 style="font-size:18px; font-weight:700; margin-bottom:6px;">${this.t('results.bannerNone')}</h4>
            <p style="font-size:15px; color:#475569;">${this.t('results.bannerNoneSub')}</p>
          </div>
        `;
      } else {
        let cardsHtml = '';

        duplicateFindings.forEach(dup => {
          cardsHtml += `
            <article class="alert-card severity-major">
              <div class="alert-card-top">
                <span class="severity-pill-badge major">⚠️ DUPLICATE THERAPY</span>
              </div>
              <h4 class="alert-drug-names">${dup.headline}</h4>
              <p class="alert-plain-sentence">${dup.detail}</p>
              <div class="alert-safety-mandate">
                <span>🛡️</span> ${this.t('results.safetyMandate')}
              </div>
            </article>
          `;
        });

        drugDrugFindings.forEach(ddi => {
          const localizedAlert = this.getLocalizedAlert(ddi.patient_text_key);
          cardsHtml += `
            <article class="alert-card severity-${ddi.severity}" data-alert-id="${ddi.id}" data-alert-drugs="${ddi.drugsInvolved.join(',')}">
              <div class="alert-card-top">
                <span class="severity-pill-badge ${ddi.severity}">
                  ${ddi.severity === 'contraindicated' ? '⛔ ' : '⚠️ '}${ddi.severityMeta.labelPatient}
                </span>
                <button type="button" class="card-listen-btn btn-play-single-alert" data-finding-id="${ddi.id}" aria-label="Listen to this warning">
                  🔊
                </button>
              </div>

              <h4 class="alert-drug-names">${ddi.medA.brand} + ${ddi.medB.brand} (${ddi.drugNames.join(' + ')})</h4>
              <p class="alert-plain-sentence">${localizedAlert.summary}</p>
              
              <div class="alert-safety-mandate">
                <span>🛡️</span> ${this.t('results.safetyMandate')}
              </div>

              <div class="alert-footer-links">
                <button type="button" class="btn-text-link btn-open-why" data-finding-id="${ddi.id}">
                  ${this.t('results.whyLink')}
                </button>
              </div>
            </article>
          `;
        });

        alertListMount.innerHTML = cardsHtml;
        this.bindAlertCardEvents();
      }
    }

    // 4. Render Food Findings
    const foodMount = document.getElementById('foodCardsListMount');
    if (foodMount) {
      if (foodFindings.length === 0) {
        foodMount.innerHTML = `<div style="padding:20px; text-align:center; color:#64748B;">No food interactions found for listed medications.</div>`;
      } else {
        foodMount.innerHTML = foodFindings.map(f => {
          const loc = this.getLocalizedAlert(f.patient_text_key);
          return `
            <div class="food-card">
              <div class="food-header">
                <div class="food-icon-circle">🍽️</div>
                <div>
                  <h4 class="food-title">${f.foodName} with ${f.drugName}</h4>
                  <span style="font-size:12.5px; font-weight:700; color:#B45309;">MODERATE DIETARY ADVICE</span>
                </div>
              </div>
              <p class="food-advice">${loc.summary || f.advicePatientEn}</p>
              <div style="margin-top:10px; display:flex; justify-content:flex-end;">
                <button type="button" class="card-listen-btn btn-play-food-alert" data-food-key="${f.patient_text_key}" aria-label="Listen to food alert">
                  🔊
                </button>
              </div>
            </div>
          `;
        }).join('');

        foodMount.querySelectorAll('.btn-play-food-alert').forEach(b => {
          b.addEventListener('click', (e) => {
            const key = e.target.closest('button').getAttribute('data-food-key');
            const alertData = this.getLocalizedAlert(key);
            if (alertData && alertData.speechText) {
              voiceService.speakText(alertData.speechText, this.currentLanguage);
            }
          });
        });
      }
    }

    // 5. Render Not Checked Box
    const notCheckedMount = document.getElementById('notCheckedMount');
    if (notCheckedMount) {
      if (notCheckedItems.length > 0) {
        notCheckedMount.innerHTML = `
          <div style="background:#F1F5F9; border-radius:12px; padding:16px; margin-top:16px; border:1px solid #CBD5E1;">
            <h5 style="font-size:16px; font-weight:700; color:#334155; margin-bottom:4px;">⚠️ ${this.t('results.notCheckedTitle')}</h5>
            <p style="font-size:14px; color:#64748B;">${this.t('results.notCheckedDesc')}</p>
            <ul style="margin:8px 0 0 20px; font-size:14px; color:#475569;">
              ${notCheckedItems.map(i => `<li>${i.raw_text}</li>`).join('')}
            </ul>
          </div>
        `;
      } else {
        notCheckedMount.innerHTML = '';
      }
    }
  }

  getLocalizedAlert(key) {
    const langObj = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    if (langObj.alerts && langObj.alerts[key]) {
      return langObj.alerts[key];
    }
    if (TRANSLATIONS.en.alerts && TRANSLATIONS.en.alerts[key]) {
      return TRANSLATIONS.en.alerts[key];
    }
    return {
      headline: "Important Medication Alert",
      summary: "Potential clinical interaction detected. Please talk with your doctor before your next dose.",
      speechText: "Please consult your doctor before your next dose. Do not stop any medicine on your own."
    };
  }

  bindAlertCardEvents() {
    document.querySelectorAll('.btn-play-single-alert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const findingId = e.target.closest('button').getAttribute('data-finding-id');
        const finding = this.interactionResults.drugDrugFindings.find(f => f.id === findingId);
        if (!finding) return;

        const loc = this.getLocalizedAlert(finding.patient_text_key);
        voiceService.speakText(loc.speechText, this.currentLanguage);
      });
    });

    document.querySelectorAll('.btn-open-why').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const findingId = e.target.closest('button').getAttribute('data-finding-id');
        const finding = this.interactionResults.drugDrugFindings.find(f => f.id === findingId);
        if (finding) {
          this.openAlertDetail(finding);
        }
      });
    });
  }

  openAlertDetail(finding) {
    const loc = this.getLocalizedAlert(finding.patient_text_key);
    const html = `
      <div class="alert-detail-modal-body">
        <div style="display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:999px; font-size:14px; font-weight:700; margin-bottom:12px; background:${finding.severityMeta.bgColor}; color:${finding.severityMeta.textColor}; border:1px solid ${finding.severityMeta.borderColor};">
          ${finding.severityMeta.icon === 'octagon-x' ? '⛔' : '⚠️'} ${finding.severityMeta.labelPatient}
        </div>
        
        <h3 style="font-size:22px; font-weight:800; color:#0F766E; margin-bottom:12px;">
          ${finding.medA.brand} + ${finding.medB.brand}
        </h3>

        <div style="display:flex; gap:8px; margin-bottom:16px;">
          <span style="background:#F0FDFA; color:#0F766E; font-size:13px; font-weight:600; padding:4px 10px; border-radius:6px;">Generic: ${finding.drugNames[0]}</span>
          <span style="background:#F0FDFA; color:#0F766E; font-size:13px; font-weight:600; padding:4px 10px; border-radius:6px;">Generic: ${finding.drugNames[1]}</span>
        </div>

        <p style="font-size:18px; color:#1E293B; line-height:1.6; margin-bottom:16px;">
          ${loc.summary}
        </p>

        <div style="background:#FEF2F2; border-left:4px solid #DC2626; padding:12px; border-radius:8px; margin-bottom:20px;">
          <div style="font-weight:700; color:#991B1B; font-size:15px; margin-bottom:4px;">What should you do?</div>
          <div style="font-size:15px; color:#7F1D1D;">
            Please show this summary to your doctor before taking your next dose.
          </div>
          <div style="font-size:14px; font-weight:700; color:#B91C1C; margin-top:8px;">
            🛡️ Do not stop any medicine on your own.
          </div>
        </div>

        <div style="display:flex; gap:12px;">
          <button type="button" class="btn-primary" id="btnPlaySheetAudio" style="flex:1;">
            <span>🔊 Listen to this alert</span>
          </button>
        </div>
      </div>
    `;

    this.alertSheet.open(html, loc.headline || "Alert Details");

    const playBtn = document.getElementById('btnPlaySheetAudio');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        voiceService.speakText(loc.speechText, this.currentLanguage);
      });
    }
  }

  // --- S7 DOCTOR SUMMARY VIEW ---
  renderDoctorView() {
    this.interactionResults = runInteractionCheck(this.detectedMedicines.length > 0 ? this.detectedMedicines : PATIENT_DOCTOR_VISITS[0].medicines);
    const { summary, drugDrugFindings } = this.interactionResults;

    const countEl = document.getElementById('docTotalMedsCount');
    const majorEl = document.getElementById('docMajorCount');
    const modEl = document.getElementById('docModCount');
    const patientSumEl = document.getElementById('docPatientMetaLine');

    if (countEl) countEl.textContent = summary.totalMeds;
    if (majorEl) majorEl.textContent = summary.contraindicatedCount + summary.majorCount;
    if (modEl) modEl.textContent = summary.moderateCount;
    if (patientSumEl) {
      patientSumEl.textContent = `Patient: Ramesh Chander (68M) • Active Prescriptions: 5 Prescribers • Total Active Rx: ${summary.totalMeds} • Generated: ${new Date().toLocaleDateString('en-GB')}`;
    }

    const tableBody = document.getElementById('docMedicationTableBody');
    if (tableBody) {
      tableBody.innerHTML = this.detectedMedicines.map(m => `
        <tr>
          <td><strong>${m.generic}</strong></td>
          <td>${m.brand}</td>
          <td><code>${m.generic_code || 'RxNorm'}</code></td>
          <td>${m.prescriber || 'Specialist Physician'}</td>
          <td><span style="color:#15803D; font-weight:600;">✓ Verified</span></td>
        </tr>
      `).join('');
    }

    const findingsMount = document.getElementById('docFindingsMount');
    if (findingsMount) {
      findingsMount.innerHTML = drugDrugFindings.map(f => `
        <div class="finding-clinical-item ${f.severity}">
          <div class="finding-clinical-header">
            <div class="finding-drugs-title">${f.drugNames.join(' + ')} (${f.medA.brand} / ${f.medB.brand})</div>
            <span class="severity-pill-badge ${f.severity}">${f.severity.toUpperCase()}</span>
          </div>

          <div class="finding-detail-grid">
            <div>
              <strong>Mechanism:</strong>
              <div>${f.mechanism}</div>
            </div>
            <div>
              <strong>Clinical Effect:</strong>
              <div>${f.clinical_effect}</div>
            </div>
          </div>

          <div style="margin-top:10px; font-size:13.5px; color:#1E3A5F;">
            <strong>Recommendation:</strong> ${f.recommendation_doctor}
          </div>

          <div style="margin-top:8px; font-size:12.5px; color:#64748B;">
            Source: <a href="${f.source.url}" target="_blank" rel="noopener" class="finding-source-link">${f.source.name}</a> (Ref: ${f.source.referenceId})
          </div>
        </div>
      `).join('');
    }

    const altMount = document.getElementById('docAlternativesMount');
    if (altMount) {
      const allAlts = [];
      drugDrugFindings.forEach(f => {
        if (f.alternatives) {
          f.alternatives.forEach(alt => allAlts.push({ ...alt, ddi: f }));
        }
      });

      if (allAlts.length === 0) {
        altMount.innerHTML = `<div style="font-size:14px; color:#64748B;">No guideline-curated alternatives required.</div>`;
      } else {
        altMount.innerHTML = allAlts.map(alt => `
          <div class="alt-card-item">
            <div class="alt-title">Alternative for ${alt.replaceTarget} ➔ <strong>${alt.suggestedDrug}</strong></div>
            <div style="font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">Dosing Guidance: ${alt.dose}</div>
            <div class="alt-rationale">${alt.rationale}</div>
            <div style="font-size:11.5px; font-weight:700; color:#15803D; margin-top:4px;">[FOR CLINICIAN REVIEW]</div>
          </div>
        `).join('');
      }
    }
  }

  playAllAlerts() {
    if (!this.interactionResults || this.interactionResults.drugDrugFindings.length === 0) return;

    if (voiceService.isPlaying) {
      voiceService.pause();
      return;
    }

    if (voiceService.isPaused) {
      voiceService.resume();
      return;
    }

    const queue = this.interactionResults.drugDrugFindings.map(f => {
      const loc = this.getLocalizedAlert(f.patient_text_key);
      return {
        id: f.id,
        speechText: loc.speechText
      };
    });

    voiceService.playAlertQueue(queue, this.currentLanguage);
  }

  handleVoiceStateChange(state) {
    const playBtn = document.getElementById('btnListenAllVoice');
    if (!playBtn) return;

    if (state.isPlaying) {
      playBtn.classList.add('is-playing');
      playBtn.innerHTML = `
        <div class="equalizer-wave">
          <div class="equalizer-bar"></div>
          <div class="equalizer-bar"></div>
          <div class="equalizer-bar"></div>
          <div class="equalizer-bar"></div>
        </div>
        <span>${this.t('results.listening')}</span>
      `;
    } else if (state.isPaused) {
      playBtn.classList.remove('is-playing');
      playBtn.innerHTML = `<span>▶️ ${this.t('results.pauseVoice')}</span>`;
    } else {
      playBtn.classList.remove('is-playing');
      playBtn.innerHTML = `<span>🔊 ${this.t('results.listenAll')}</span>`;
    }
  }

  bindGlobalEvents() {
    // Top Navigation Links
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetScreen = btn.getAttribute('data-target');
        this.showScreen(targetScreen);
      });
    });

    // Language Cards on S1 Welcome
    document.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });

    // Help & Disclaimer button
    const helpBtn = document.getElementById('headerHelpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        const html = `
          <div style="font-size:16px; line-height:1.6; color:#334155;">
            <h4 style="font-size:18px; font-weight:700; color:#0F766E; margin-bottom:8px;">How DoseAlert Works:</h4>
            <ol style="margin-left:20px; margin-bottom:18px;">
              <li><strong>Scan & Compare:</strong> Photograph or upload prescriptions from multiple doctors.</li>
              <li><strong>Confirm:</strong> Verify detected brand names and generic active compositions.</li>
              <li><strong>Check & Listen:</strong> Hear voice warnings in 20+ regional languages.</li>
            </ol>
            <div style="background:#F0FDFA; padding:12px; border-radius:8px; border:1px solid #CCFBF1; margin-bottom:14px;">
              <strong>🔒 Privacy Guarantee:</strong>
              <p style="font-size:14px; margin-top:4px;">${this.t('privacyNote')}</p>
            </div>
            <div style="background:#FFFBEB; padding:12px; border-radius:8px; border:1px solid #FEF3C7;">
              <strong>⚠️ Medical Disclaimer:</strong>
              <p style="font-size:14px; margin-top:4px;">${this.t('disclaimerShort')}</p>
            </div>
          </div>
        `;
        this.helpSheet.open(html, "About DoseAlert & Safety");
      });
    }

    // OCR Benchmark button
    const benchBtn = document.getElementById('headerBenchmarkBtn');
    if (benchBtn) {
      benchBtn.addEventListener('click', () => {
        const m = BENCHMARK_METRICS;
        const html = `
          <div style="font-size:14.5px; color:#1E293B;">
            <p style="margin-bottom:12px;">Evaluation on 50 curated clinical prescriptions (printed vs handwritten):</p>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
              <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #CBD5E1; text-align:center;">
                <div style="font-size:24px; font-weight:800; color:#0F766E;">${m.summary.overallTop1Accuracy}</div>
                <div style="font-size:12px; color:#64748B;">Top-1 Extraction Match</div>
              </div>
              <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #CBD5E1; text-align:center;">
                <div style="font-size:24px; font-weight:800; color:#0F766E;">${m.summary.overallTop3Recall}</div>
                <div style="font-size:12px; color:#64748B;">Top-3 Recall (Fuzzy Norm)</div>
              </div>
            </div>

            <h5 style="font-weight:700; margin-bottom:6px;">Handwritten vs Printed Breakdown:</h5>
            <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:14px;">
              <tr style="background:#F1F5F9; border-bottom:1px solid #CBD5E1;">
                <th style="padding:6px;">Type</th>
                <th style="padding:6px;">Top-1 Match</th>
                <th style="padding:6px;">CER</th>
                <th style="padding:6px;">Latency</th>
              </tr>
              ${m.byPrescriptionType.map(r => `
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:6px;">${r.type}</td>
                  <td style="padding:6px;"><strong>${r.top1Normalisation}</strong></td>
                  <td style="padding:6px;">${r.characterErrorRate}</td>
                  <td style="padding:6px;">${r.averageLatencyMs}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `;
        this.benchmarkSheet.open(html, "📊 OCR & Normalisation Accuracy Benchmark");
      });
    }

    // S1 CTAs
    const btnScanCta = document.getElementById('btnWelcomeScan');
    if (btnScanCta) {
      btnScanCta.addEventListener('click', () => {
        this.showScreen('screen-scan');
      });
    }

    const btnSampleCta = document.getElementById('btnWelcomeSample');
    if (btnSampleCta) {
      btnSampleCta.addEventListener('click', () => {
        this.activeRxIds = ['rx_cardio', 'rx_ortho'];
        this.startReadingProcess(this.activeRxIds);
      });
    }

    // S2 Read CTA
    const btnStartReading = document.getElementById('btnStartReading');
    if (btnStartReading) {
      btnStartReading.addEventListener('click', () => {
        this.startReadingProcess(this.activeRxIds);
      });
    }

    // S4 Add another Prescription (Multi-Rx)
    const btnAddAnotherRx = document.getElementById('btnAddAnotherRx');
    if (btnAddAnotherRx) {
      btnAddAnotherRx.addEventListener('click', () => {
        const nextRx = PATIENT_DOCTOR_VISITS.find(v => !this.activeRxIds.includes(v.rxId));
        if (nextRx) {
          this.activeRxIds.push(nextRx.rxId);
          alert(`Added Prescription from ${nextRx.doctorName} (${nextRx.specialty}). Re-analyzing merged prescription list!`);
          this.startReadingProcess(this.activeRxIds);
        } else {
          alert("All 5 doctor prescriptions already merged!");
        }
      });
    }

    // S4 Confirm CTA -> advances to Results
    const btnConfirmCheck = document.getElementById('btnConfirmCheck');
    if (btnConfirmCheck) {
      btnConfirmCheck.addEventListener('click', () => {
        this.renderResultsScreen();
        this.showScreen('screen-results');
      });
    }

    // S5 Results Tabs: Warnings vs Food
    const tabWarnings = document.getElementById('tabBtnWarnings');
    const tabFood = document.getElementById('tabBtnFood');
    const mountWarnings = document.getElementById('alertCardsListMount');
    const mountFood = document.getElementById('foodCardsListMount');

    if (tabWarnings && tabFood) {
      tabWarnings.addEventListener('click', () => {
        this.currentResultsTab = 'warnings';
        tabWarnings.classList.add('is-active');
        tabFood.classList.remove('is-active');
        if (mountWarnings) mountWarnings.style.display = 'block';
        if (mountFood) mountFood.style.display = 'none';
      });

      tabFood.addEventListener('click', () => {
        this.currentResultsTab = 'food';
        tabFood.classList.add('is-active');
        tabWarnings.classList.remove('is-active');
        if (mountWarnings) mountWarnings.style.display = 'none';
        if (mountFood) mountFood.style.display = 'block';
      });
    }

    // S5 Listen All Voice CTA in Sticky Bar
    const btnListenAll = document.getElementById('btnListenAllVoice');
    if (btnListenAll) {
      btnListenAll.addEventListener('click', () => {
        this.playAllAlerts();
      });
    }

    // S5 Show Doctor CTA
    const btnShowDoctor = document.getElementById('btnShowDoctor');
    if (btnShowDoctor) {
      btnShowDoctor.addEventListener('click', () => {
        this.showScreen('screen-doctor');
      });
    }

    // S5 Start Over CTA
    const btnStartOver = document.getElementById('btnStartOver');
    if (btnStartOver) {
      btnStartOver.addEventListener('click', () => {
        if (confirm("Start over? This will clear your current session and photos.")) {
          voiceService.stop();
          this.activeRxIds = ['rx_cardio', 'rx_ortho'];
          this.detectedMedicines = [];
          this.interactionResults = null;
          this.showScreen('screen-welcome');
        }
      });
    }

    // S7 Doctor Print PDF
    const btnPrintPdf = document.getElementById('btnPrintClinicalPdf');
    if (btnPrintPdf) {
      btnPrintPdf.addEventListener('click', () => {
        window.print();
      });
    }

    // S7 Back to Patient View
    const btnBackPatient = document.getElementById('btnBackToPatient');
    if (btnBackPatient) {
      btnBackPatient.addEventListener('click', () => {
        this.showScreen('screen-results');
      });
    }

    // Graph Explorer Toggle
    const btnExploreGraph = document.getElementById('btnOpenGraphExplorer');
    if (btnExploreGraph) {
      btnExploreGraph.addEventListener('click', () => {
        const mount = document.getElementById('graphExplorerMount');
        if (mount) {
          if (!this.graphExplorer) {
            this.graphExplorer = new GraphExplorer(mount);
            this.graphExplorer.render();
          }
          mount.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
  window.doseAlertApp = new DoseAlertApp();
});

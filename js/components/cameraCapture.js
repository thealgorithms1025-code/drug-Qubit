// DoseAlert - Camera Capture & Multi-Prescription Comparison Tray
// Supports capturing and comparing 1, 2, 3, 4, 5+ prescription photos simultaneously

import { PATIENT_DOCTOR_VISITS } from '../data/drugDictionary.js';

export class CameraCapture {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = options;
    this.stream = null;
    this.capturedPages = [];
    this.onCaptured = options.onCaptured || (() => {});
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="camera-capture-wrapper">
        <!-- Live Viewfinder or Upload Box -->
        <div class="viewfinder-container" id="viewfinderArea">
          <video id="cameraVideo" autoplay playsinline muted class="camera-video is-hidden"></video>
          <canvas id="captureCanvas" class="is-hidden"></canvas>
          
          <!-- Framing Guide Overlay -->
          <div class="framing-guide" id="framingGuide">
            <div class="guide-corner top-left"></div>
            <div class="guide-corner top-right"></div>
            <div class="guide-corner bottom-left"></div>
            <div class="guide-corner bottom-right"></div>
            <div class="framing-hint-text">
              <span class="guide-icon">📄</span> Position prescription inside frame
            </div>
          </div>

          <!-- Quality Feedback Chip -->
          <div class="quality-chip-badge" id="qualityBadge">
            <span class="quality-dot status-good"></span>
            <span class="quality-text">Good lighting • Hold steady</span>
          </div>

          <!-- Preview Overlay -->
          <div class="image-preview-overlay is-hidden" id="imagePreview">
            <img id="previewImg" src="" alt="Captured Prescription" />
            <button class="retake-btn" id="retakeBtn" type="button">
              <span>🔄 Retake photo</span>
            </button>
          </div>
        </div>

        <!-- Camera Controls -->
        <div class="capture-controls-bar">
          <label class="gallery-upload-btn" title="Upload multiple prescription photos">
            <input type="file" id="fileInput" accept="image/*" multiple class="sr-only" />
            <span class="icon">📁</span>
            <span class="btn-label">Batch Upload (Multi-Rx)</span>
          </label>

          <!-- Large Shutter Button -->
          <button class="shutter-button" id="shutterBtn" type="button" aria-label="Take Photo">
            <div class="shutter-inner"></div>
          </button>

          <button class="sample-rx-btn" id="useSampleBtn" type="button" title="Load multiple realistic prescriptions">
            <span class="icon">📋</span>
            <span class="btn-label">Load 5 Doctor Rxs</span>
          </button>
        </div>

        <!-- Multi-Prescription Comparison & Thumbnail Tray -->
        <div class="multi-rx-tray-header">
          <div style="font-size: 14.5px; font-weight: 700; color: #1E293B;">
            Prescriptions Added for Comparison: <span id="rxPageCountBadge" class="rx-counter-badge">0 Pages</span>
          </div>
          <span style="font-size: 12.5px; color: #64748B;">You can add 1 to 5+ prescriptions from different doctors</span>
        </div>

        <div class="thumbnails-container" id="thumbnailStrip">
          <div class="thumbnail-list" id="thumbnailList"></div>
        </div>

        <!-- Capture Tips Banner -->
        <div class="capture-tips-banner">
          <div class="tip-item"><span class="tip-icon">💡</span> Good light</div>
          <div class="tip-item"><span class="tip-icon">📐</span> Keep page flat</div>
          <div class="tip-item"><span class="tip-icon">📸</span> Add multiple doctor prescriptions</div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const shutterBtn = this.container.querySelector('#shutterBtn');
    const fileInput = this.container.querySelector('#fileInput');
    const useSampleBtn = this.container.querySelector('#useSampleBtn');
    const retakeBtn = this.container.querySelector('#retakeBtn');

    if (shutterBtn) {
      shutterBtn.addEventListener('click', () => this.handleShutter());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleBatchUpload(e));
    }

    if (useSampleBtn) {
      useSampleBtn.addEventListener('click', () => this.loadAllSamplePrescriptions());
    }

    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => this.retake());
    }

    this.startCameraStream();
  }

  async startCameraStream() {
    const video = this.container.querySelector('#cameraVideo');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.showStaticFallback();
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (video) {
        video.srcObject = this.stream;
        video.classList.remove('is-hidden');
      }
    } catch (err) {
      this.showStaticFallback();
    }
  }

  showStaticFallback() {
    const viewfinder = this.container.querySelector('#viewfinderArea');
    if (viewfinder) {
      viewfinder.classList.add('camera-fallback-mode');
    }
  }

  handleShutter() {
    const video = this.container.querySelector('#cameraVideo');
    const canvas = this.container.querySelector('#captureCanvas');
    
    if (this.stream && video && !video.classList.contains('is-hidden')) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      this.addCapturedPage(dataUrl, `Prescription ${this.capturedPages.length + 1}`);
    } else {
      this.loadSamplePrescription();
    }
  }

  handleBatchUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.addCapturedPage(e.target.result, `Rx ${this.capturedPages.length + 1}: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  }

  loadAllSamplePrescriptions() {
    this.capturedPages = [];
    PATIENT_DOCTOR_VISITS.forEach(visit => {
      this.capturedPages.push({
        id: `page_${visit.rxId}`,
        rxId: visit.rxId,
        label: `${visit.specialty} (${visit.doctorName.split(',')[0]})`,
        url: visit.rxImage || "assets/prescriptions/sample_rx_preview.svg"
      });
    });
    this.renderThumbnails();
    this.onCaptured(this.capturedPages);
  }

  loadSamplePrescription() {
    const nextIdx = this.capturedPages.length % PATIENT_DOCTOR_VISITS.length;
    const visit = PATIENT_DOCTOR_VISITS[nextIdx];
    this.addCapturedPage(
      visit.rxImage || "assets/prescriptions/sample_rx_preview.svg",
      `${visit.specialty} (${visit.doctorName.split(',')[0]})`,
      visit.rxId
    );
  }

  addCapturedPage(imageUrl, label, rxId = "rx_cardio") {
    const pageObj = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      rxId,
      label,
      url: imageUrl
    };
    this.capturedPages.push(pageObj);
    this.renderThumbnails();
    this.showPreview(imageUrl);
    this.onCaptured(this.capturedPages);
  }

  showPreview(url) {
    const preview = this.container.querySelector('#imagePreview');
    const img = this.container.querySelector('#previewImg');
    const guide = this.container.querySelector('#framingGuide');
    if (preview && img) {
      img.src = url;
      preview.classList.remove('is-hidden');
      if (guide) guide.classList.add('is-hidden');
    }
  }

  retake() {
    const preview = this.container.querySelector('#imagePreview');
    const guide = this.container.querySelector('#framingGuide');
    if (preview) preview.classList.add('is-hidden');
    if (guide) guide.classList.remove('is-hidden');
    this.capturedPages = [];
    this.renderThumbnails();
    this.onCaptured([]);
  }

  renderThumbnails() {
    const list = this.container.querySelector('#thumbnailList');
    const badge = this.container.querySelector('#rxPageCountBadge');
    if (!list) return;

    if (badge) {
      badge.textContent = `${this.capturedPages.length} Prescriptions`;
    }

    if (this.capturedPages.length === 0) {
      list.innerHTML = `<div style="font-size: 13px; color: #94A3B8; padding: 12px 0;">No prescription photos captured yet. Take photo or load sample prescriptions.</div>`;
      return;
    }

    list.innerHTML = this.capturedPages.map((p, idx) => `
      <div class="thumb-card multi-rx-thumb" data-id="${p.id}">
        <img src="${p.url}" alt="${p.label}" class="thumb-img" />
        <span class="thumb-tag">${p.label}</span>
        <button type="button" class="btn-remove-thumb" data-remove-id="${p.id}" title="Remove this page">✕</button>
      </div>
    `).join('') + `
      <button class="thumb-add-tile" type="button" id="addMorePageBtn" title="Add another doctor's prescription">
        <span class="add-icon">+</span>
        <span class="add-text">Add another doctor's Rx</span>
      </button>
    `;

    const addBtn = list.querySelector('#addMorePageBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.loadSamplePrescription();
      });
    }

    list.querySelectorAll('.btn-remove-thumb').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const remId = btn.getAttribute('data-remove-id');
        this.capturedPages = this.capturedPages.filter(p => p.id !== remId);
        this.renderThumbnails();
        this.onCaptured(this.capturedPages);
      });
    });
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

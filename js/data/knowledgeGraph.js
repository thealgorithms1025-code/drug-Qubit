// DoseAlert - Authoritative Drug & Food Interaction Knowledge Graph
// Curated based on DDInter, FDA DailyMed Labels, and Beers Criteria guidelines

export const SEVERITY_LEVELS = {
  CONTRAINDICATED: {
    level: "contraindicated",
    labelEn: "Do not combine",
    labelPatient: "Do not combine",
    color: "#7F1D1D",
    bgColor: "#7F1D1D",
    textColor: "#FFFFFF",
    badgeBg: "#7F1D1D",
    badgeText: "#FFFFFF",
    borderColor: "#7F1D1D",
    icon: "octagon-x",
    priority: 1,
    tone: "critical"
  },
  MAJOR: {
    level: "major",
    labelEn: "Important warning",
    labelPatient: "Important warning",
    color: "#B91C1C",
    bgColor: "#FEF2F2",
    textColor: "#991B1B",
    badgeBg: "#FEE2E2",
    badgeText: "#B91C1C",
    borderColor: "#EF4444",
    icon: "triangle-alert",
    priority: 2,
    tone: "serious"
  },
  MODERATE: {
    level: "moderate",
    labelEn: "Be careful",
    labelPatient: "Be careful",
    color: "#B45309",
    bgColor: "#FFFBEB",
    textColor: "#92400E",
    badgeBg: "#FEF3C7",
    badgeText: "#B45309",
    borderColor: "#F59E0B",
    icon: "circle-alert",
    priority: 3,
    tone: "caution"
  },
  MINOR: {
    level: "minor",
    labelEn: "Good to know",
    labelPatient: "Good to know",
    color: "#475569",
    bgColor: "#F1F5F9",
    textColor: "#334155",
    badgeBg: "#E2E8F0",
    badgeText: "#475569",
    borderColor: "#94A3B8",
    icon: "info-circle",
    priority: 4,
    tone: "informational"
  }
};

// Pairwise Drug-Drug Interactions across comprehensive clinical classes
export const DRUG_INTERACTIONS = [
  {
    id: "ddi_warfarin_ibuprofen",
    drugs: ["m_warfarin", "m_ibuprofen"],
    drugNames: ["Warfarin", "Ibuprofen"],
    severity: "contraindicated",
    patient_text_key: "warfarin_ibuprofen_bleed",
    mechanism: "Pharmacodynamic synergism: Ibuprofen inhibits platelet COX-1 and displaces warfarin from plasma albumin while irritating gastric mucosa.",
    clinical_effect: "Severe gastrointestinal hemorrhage, peptic ulcer perforation, and unregulated prolongation of prothrombin time (INR).",
    recommendation_doctor: "Avoid concurrent use. Discontinue systemic NSAID immediately. Switch to Paracetamol (Acetaminophen) max 2 g/day or topical gel.",
    source: {
      name: "DDInter & American College of Cardiology Polypharmacy Consensus",
      url: "https://ddinter.scbdd.com/ddi/DDInter-00124",
      referenceId: "DDI-REV-8492"
    },
    alternatives: [
      {
        replaceTarget: "Ibuprofen",
        suggestedDrug: "Paracetamol (Dolo / Crocin)",
        dose: "500 mg - 650 mg as needed (Max 2 g/day)",
        rationale: "Negligible platelet inhibition, safe with oral anticoagulants when kept under 2-3 g/day.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_atorvastatin_clarithromycin",
    drugs: ["m_atorvastatin", "m_clarithromycin"],
    drugNames: ["Atorvastatin", "Clarithromycin"],
    severity: "contraindicated",
    patient_text_key: "atorva_clarithro_rhabdo",
    mechanism: "Clarithromycin is a potent mechanism-based suicide inhibitor of hepatic CYP3A4, causing 300-400% elevation of atorvastatin plasma concentrations.",
    clinical_effect: "Marked increase in rhabdomyolysis risk, extreme CK elevation, acute tubular necrosis, and acute renal failure.",
    recommendation_doctor: "Contraindicated combination. Temporarily withhold atorvastatin during clarithromycin treatment, or substitute antibiotic (e.g. Azithromycin).",
    source: {
      name: "FDA Black Box Interaction Warnings & DDInter",
      url: "https://ddinter.scbdd.com/ddi/DDInter-00088",
      referenceId: "FDA-BBOX-STATIN"
    },
    alternatives: [
      {
        replaceTarget: "Clarithromycin",
        suggestedDrug: "Azithromycin",
        dose: "500 mg Day 1, then 250 mg Days 2-5",
        rationale: "Azithromycin exhibits negligible CYP3A4 inhibition.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_digoxin_clarithromycin",
    drugs: ["m_digoxin", "m_clarithromycin"],
    drugNames: ["Digoxin", "Clarithromycin"],
    severity: "contraindicated",
    patient_text_key: "digoxin_clarithro_arrhythmia",
    mechanism: "Clarithromycin strongly inhibits renal and intestinal P-glycoprotein (P-gp), the primary efflux transporter for digoxin clearance, and eliminates Eubacterium lentum gut flora.",
    clinical_effect: "Serum digoxin levels double or triple into severe toxicity range, triggering life-threatening ventricular arrhythmias, heart block, and visual disturbances.",
    recommendation_doctor: "Reduce digoxin dose by 50% and monitor serum levels closely, or select an alternative antibiotic.",
    source: {
      name: "AHA Heart Failure Scientific Statement & DailyMed",
      url: "https://dailymed.nlm.nih.gov",
      referenceId: "AHA-DDI-DIGOXIN"
    },
    alternatives: [
      {
        replaceTarget: "Clarithromycin",
        suggestedDrug: "Amoxicillin-Clavulanate or Cefuroxime",
        dose: "As indicated for infection",
        rationale: "Does not inhibit P-glycoprotein efflux pump.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_tramadol_alprazolam",
    drugs: ["m_tramadol", "m_alprazolam"],
    drugNames: ["Tramadol", "Alprazolam"],
    severity: "contraindicated",
    patient_text_key: "tramadol_alprax_cns",
    mechanism: "Synergistic Central Nervous System and respiratory depression: Opioid receptor stimulation compounded by GABA-A receptor positive allosteric modulation.",
    clinical_effect: "Profound sedation, respiratory depression, coma, and elevated fatality risk from combined CNS depression.",
    recommendation_doctor: "Avoid concurrent prescribing of opioids and benzodiazepines whenever possible. Limit dosages and duration to minimum required.",
    source: {
      name: "FDA Black Box Warning: Concomitant Use of Opioids and Benzodiazepines",
      url: "https://www.fda.gov/drugs/drug-safety-and-availability",
      referenceId: "FDA-BBOX-OPIOID-BENZO"
    },
    alternatives: [
      {
        replaceTarget: "Tramadol",
        suggestedDrug: "Acetaminophen or Topical Therapy",
        dose: "650 mg as needed",
        rationale: "Avoids respiratory depressive synergy with anxiolytics.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_warfarin_aspirin",
    drugs: ["m_warfarin", "m_aspirin"],
    drugNames: ["Warfarin", "Aspirin"],
    severity: "major",
    patient_text_key: "warfarin_aspirin_bleed",
    mechanism: "Combined platelet aggregation inhibition (Aspirin COX-1) with coagulation factor depletion (Warfarin factors II, VII, IX, X).",
    clinical_effect: "Synergistic elevation of major bleeding risk, particularly GI bleeding and hemorrhagic stroke.",
    recommendation_doctor: "Evaluate indication for dual antithrombotic therapy. If post-PTCA beyond required window, consider Warfarin monotherapy under cardiologist advice. Ensure gastric acid suppression (PPI co-prescription).",
    source: {
      name: "FDA DailyMed & CHEST Antithrombotic Guidelines",
      url: "https://dailymed.nlm.nih.gov",
      referenceId: "CHEST-AT-2023"
    },
    alternatives: [
      {
        replaceTarget: "Aspirin",
        suggestedDrug: "Warfarin Monotherapy (Target INR 2.0 - 2.5)",
        dose: "Adjust per monthly PT/INR",
        rationale: "Mitigates hemorrhagic risk once coronary stent endothelization is established.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_aspirin_ibuprofen",
    drugs: ["m_aspirin", "m_ibuprofen"],
    drugNames: ["Aspirin", "Ibuprofen"],
    severity: "major",
    patient_text_key: "aspirin_ibuprofen_stomach",
    mechanism: "Ibuprofen competitively blocks aspirin's access to the Ser529 residue of COX-1, antagonizing aspirin's irreversible cardioprotective platelet inhibition.",
    clinical_effect: "Diminished cardiovascular protection from aspirin and 2-4x elevated risk of gastroduodenal ulceration.",
    recommendation_doctor: "Take immediate-release aspirin at least 2 hours before ibuprofen, or prefer paracetamol.",
    source: {
      name: "FDA Drug Safety Communication",
      url: "https://www.fda.gov",
      referenceId: "FDA-DSC-2019"
    },
    alternatives: [
      {
        replaceTarget: "Ibuprofen",
        suggestedDrug: "Paracetamol (Acetaminophen)",
        dose: "650 mg post meal",
        rationale: "Preserves aspirin cardioprotection without competing at COX-1 Ser529.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_clopidogrel_omeprazole",
    drugs: ["m_clopidogrel", "m_omeprazole"],
    drugNames: ["Clopidogrel", "Omeprazole"],
    severity: "major",
    patient_text_key: "clopidogrel_omeprazole_thrombosis",
    mechanism: "Omeprazole competitively inhibits hepatic CYP2C19, the primary enzyme required to bioactivate the prodrug clopidogrel into its active thiol metabolite.",
    clinical_effect: "Substantial blunting of clopidogrel antiplatelet effect, leading to heightened risk of stent thrombosis and recurrent myocardial infarction.",
    recommendation_doctor: "Switch PPI to Pantoprazole, which exhibits minimal CYP2C19 inhibition.",
    source: {
      name: "FDA Drug Safety Warning: Clopidogrel and Omeprazole",
      url: "https://www.fda.gov",
      referenceId: "FDA-CLOP-OME-WARN"
    },
    alternatives: [
      {
        replaceTarget: "Omeprazole",
        suggestedDrug: "Pantoprazole (Pan 40)",
        dose: "40 mg once daily",
        rationale: "Does not significantly compete with CYP2C19, preserving clopidogrel activation.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_ciprofloxacin_warfarin",
    drugs: ["m_ciprofloxacin", "m_warfarin"],
    drugNames: ["Ciprofloxacin", "Warfarin"],
    severity: "major",
    patient_text_key: "cipro_warfarin_bleed",
    mechanism: "Ciprofloxacin inhibits hepatic CYP1A2 (which metabolizes R-warfarin) and eradicates Vitamin K-synthesizing gut microbiota.",
    clinical_effect: "Abrupt rise in INR prothrombin time, precipitating major spontaneous hematuria and GI bleeding.",
    recommendation_doctor: "Monitor INR within 48-72 hours of starting ciprofloxacin and reduce warfarin dose by 25-33%.",
    source: {
      name: "British National Formulary & DDInter",
      url: "https://ddinter.scbdd.com",
      referenceId: "BNF-CIPRO-WARFARIN"
    },
    alternatives: [
      {
        replaceTarget: "Ciprofloxacin",
        suggestedDrug: "Amoxicillin-Clavulanate or Cephalexin",
        dose: "Per clinical indication",
        rationale: "Lower impact on warfarin clearance enzymes.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_atorvastatin_amlodipine",
    drugs: ["m_atorvastatin", "m_amlodipine"],
    drugNames: ["Atorvastatin", "Amlodipine"],
    severity: "moderate",
    patient_text_key: "atorva_amlo_metabolism",
    mechanism: "Amlodipine is a weak inhibitor of CYP3A4, the primary hepatic metabolic pathway for atorvastatin.",
    clinical_effect: "Slight increase (~18%) in atorvastatin exposure; monitor for unexplained muscle pain.",
    recommendation_doctor: "Monitor patient for muscle pain or tenderness; limit atorvastatin dose if myalgia occurs.",
    source: {
      name: "Lexicomp & British National Formulary",
      url: "https://online.lexi.com",
      referenceId: "LEX-DDI-3921"
    },
    alternatives: [
      {
        replaceTarget: "Atorvastatin",
        suggestedDrug: "Rosuvastatin",
        dose: "10 mg - 20 mg once daily",
        rationale: "Bypasses CYP3A4 pathways.",
        clinician_review: true
      }
    ]
  },
  {
    id: "ddi_ramipril_ibuprofen",
    drugs: ["m_ramipril", "m_ibuprofen"],
    drugNames: ["Ramipril", "Ibuprofen"],
    severity: "moderate",
    patient_text_key: "ramipril_ibuprofen_kidney",
    mechanism: "NSAIDs inhibit renal vasodilatory prostaglandin synthesis, reducing the antihypertensive effect of ACE inhibitors.",
    clinical_effect: "Blunted blood pressure control and elevated risk of acute renal function decline and hyperkalemia.",
    recommendation_doctor: "Avoid chronic NSAIDs. Monitor blood pressure and renal function.",
    source: {
      name: "Beers Criteria & KDIGO Guidelines",
      url: "https://kdigo.org",
      referenceId: "KDIGO-AKI-2022"
    },
    alternatives: [
      {
        replaceTarget: "Ibuprofen",
        suggestedDrug: "Paracetamol",
        dose: "650 mg as needed",
        rationale: "Does not interfere with renal prostaglandin synthesis.",
        clinician_review: true
      }
    ]
  }
];

// Drug-Food and Lifestyle Interactions
export const DRUG_FOOD_INTERACTIONS = [
  {
    id: "food_atorvastatin_grapefruit",
    generic_code: "m_atorvastatin",
    drugName: "Atorvastatin (Atorva)",
    foodName: "Grapefruit / Grapefruit Juice",
    foodHindi: "चकोतरा (Grapefruit)",
    severity: "moderate",
    patient_text_key: "grapefruit_statin",
    mechanism: "Grapefruit furanocoumarins irreversibly inhibit intestinal CYP3A4, raising circulating statin levels.",
    advicePatientEn: "Avoid eating grapefruit or drinking grapefruit juice while taking Atorvastatin. It can cause medicine to build up in your body and cause severe muscle pain.",
    adviceDoctorEn: "Furanocoumarins inhibit intestinal CYP3A4; even a single 200ml glass can elevate atorvastatin plasma AUC by 80-250%. Advise avoidance or switch to Rosuvastatin.",
    icon: "citrus"
  },
  {
    id: "food_warfarin_greens",
    generic_code: "m_warfarin",
    drugName: "Warfarin (Warf)",
    foodName: "Vitamin K Rich Leafy Greens (Palak, Saag, Kale, Broccoli)",
    foodHindi: "हरी पत्तेदार सब्जियां (पालक, साग, पत्तागोभी)",
    severity: "moderate",
    patient_text_key: "greens_warfarin",
    advicePatientEn: "Keep your intake of green leafy vegetables (like palak, spinach, sarson ka saag) steady every week. Large sudden changes in these vegetables weaken your blood thinner and could trigger blood clots.",
    adviceDoctorEn: "Exogenous Vitamin K directly counteracts Warfarin inhibition of VKORC1, causing fluctuating INR levels. Maintain consistent dietary intake.",
    icon: "leaf"
  },
  {
    id: "food_ibuprofen_alcohol",
    generic_code: "m_ibuprofen",
    drugName: "Ibuprofen (Brufen)",
    foodName: "Alcohol / Spirit",
    foodHindi: "शराब (Alcohol)",
    severity: "major",
    patient_text_key: "alcohol_ibuprofen",
    advicePatientEn: "Do not drink alcohol while taking pain medicines like Brufen. Alcohol irritates your stomach lining and greatly increases your risk of internal bleeding and stomach ulcers.",
    adviceDoctorEn: "Synergistic gastric mucosal ulceration and enhanced upper gastrointestinal hemorrhage risk.",
    icon: "wine"
  },
  {
    id: "food_ramipril_salt",
    generic_code: "m_ramipril",
    drugName: "Ramipril (Cardace)",
    foodName: "Potassium Salt Substitutes (Low-Sodium Salt)",
    foodHindi: "लो-सोडियम नमक (पोटैशियम सॉल्ट)",
    severity: "moderate",
    patient_text_key: "salt_ramipril",
    advicePatientEn: "Be careful with salt substitutes marketed as 'low sodium' or 'heart salt'. They contain high potassium which can dangerously raise potassium levels in your blood when taken with blood pressure medicine.",
    adviceDoctorEn: "ACE inhibition reduces aldosterone-mediated potassium excretion; additive potassium intake via KCl salt substitutes can induce symptomatic hyperkalemia.",
    icon: "salt"
  }
];

export const DUPLICATE_RULES = [
  {
    class: "NSAID",
    ingredients: ["m_ibuprofen", "m_aspirin", "m_diclofenac", "m_aceclofenac"],
    severity: "major",
    note: "Multiple anti-inflammatory/pain medicines detected concurrently. Taking both doubles stomach ulcer risk without additional pain relief."
  },
  {
    class: "Paracetamol",
    ingredients: ["m_paracetamol"],
    severity: "major",
    note: "Duplicate Paracetamol molecules detected across different brand names. Exceeding 3-4g daily causes acute liver toxicity."
  }
];

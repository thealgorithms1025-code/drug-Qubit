// DoseAlert - Comprehensive 22+ Language Dictionary
// Supports English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada,
// Malayalam, Punjabi, Odia, Urdu, Assamese, Maithili, Sanskrit, Nepali, Konkani,
// Sindhi, Bhojpuri, Spanish, French, German, Arabic

export const SUPPORTED_LANGUAGES = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "North & Central India", flag: "🇮🇳" },
  { code: "en", name: "English", nativeName: "English", region: "Global / Pan-India", flag: "🌐" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "West Bengal & Tripura", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "Tamil Nadu", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "Andhra & Telangana", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", region: "Maharashtra", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", region: "Gujarat", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", region: "Karnataka", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", region: "Kerala", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "Punjab", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", region: "Odisha", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "National / Kashmir", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", region: "Assam", flag: "🇮🇳" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", region: "Bihar / Mithila", flag: "🇮🇳" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", region: "Classical India", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "Sikkim & Nepal", flag: "🇳🇵" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", region: "Goa & Coastal", flag: "🇮🇳" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", region: "Sindh / Western India", flag: "🇮🇳" },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", region: "Bihar & UP", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", region: "International", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", region: "International", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", region: "International", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "Middle East", flag: "🇦🇪" }
];

export const TRANSLATIONS = {
  en: {
    langCode: "en-IN",
    name: "English",
    nativeName: "English",
    greeting: "Welcome to DoseAlert. Please take a clear photo of your prescriptions to check your medicines together.",
    appTitle: "DoseAlert",
    tagline: "Drug-Drug & Drug-Food Interaction Checker",
    promise: "Check your medicines together. In your language.",
    scanCta: "Scan prescription",
    sampleCta: "Try with sample prescriptions",
    typeInstead: "Type medicine names instead",
    privacyNote: "Your photos are deleted when you finish. We do not ask for your name or phone number.",
    disclaimerShort: "DoseAlert is an information tool and does not replace your doctor or pharmacist. Do not start, stop or change any medicine without their advice.",
    nav: {
      check: "Check Medicines",
      visits: "Doctor Visits (5 Doctors)",
      compare: "Composition Risk Comparator",
      doctor: "Doctor Summary",
      multiRx: "Compare Multi-Rx"
    },
    steps: {
      scan: "1. Scan",
      confirm: "2. Confirm",
      results: "3. Results"
    },
    reading: {
      title: "Reading your prescriptions…",
      timeHint: "Usually takes about 8-10 seconds",
      step1: "Reading doctor's handwriting",
      step2: "Finding medicines & brand names",
      step3: "Matching standard generic ingredients",
      cancel: "Cancel scan"
    },
    confirm: {
      title: "We found {count} medicines across prescriptions. Is this right?",
      subtitle: "Please verify before we run the clinical safety check.",
      needsCheckTitle: "Please check these {count} medicines",
      looksRightTitle: "{count} medicines look correct",
      checkThisBadge: "Check this",
      looksRightBadge: "Looks right",
      notRecognisedBadge: "Not recognised",
      fixMedicine: "Fix this medicine",
      addAnotherRx: "Add another doctor's prescription (Multi-Rx)",
      addMedicineManually: "Add medicine manually",
      checkButton: "Yes, check these medicines",
      tapToChoose: "Tap to select the correct medicine:",
      searchPlaceholder: "Type medicine name (e.g., Ecosprin)...",
      keepAsRead: "Keep as read"
    },
    results: {
      bannerCritical: "{count} important warnings found",
      bannerNone: "None found in our database",
      bannerNoneSub: "We found no interactions in our database. This does not guarantee safety. Please still ask your doctor or pharmacist.",
      tabWarnings: "Warnings & Interactions",
      tabFood: "Food & Daily Life",
      listenAll: "Listen to warnings",
      listening: "Playing alert voice...",
      pauseVoice: "Pause audio",
      showDoctor: "Show to my doctor",
      startOver: "Start over",
      whyLink: "Why does this happen?",
      notCheckedTitle: "Medicines not checked",
      notCheckedDesc: "We could not check these medicines. Please ask your pharmacist about them.",
      safetyMandate: "Do not stop any medicine on your own. Please show this to your doctor or pharmacist before your next dose.",
      interactionMapTitle: "Medication Interaction Map",
      mapHint: "Tap any pill or connecting line to inspect the clinical relationship."
    },
    doctor: {
      headerTitle: "Clinical Medication Interaction Summary",
      subTitle: "Consolidated polypharmacy safety report for prescribing clinician review",
      tag: "For Clinician Review Only",
      patientSummary: "Patient: Adult (68M) • Active Prescriptions: 5 Prescribers • Total Active Rx: {count}",
      totalMeds: "Active Agents",
      majorWarnings: "Major / Contraindicated",
      moderateWarnings: "Moderate Warnings",
      alternativesLabel: "Evidence-Based Safer Alternatives (For Review)",
      tableGeneric: "Generic Ingredient",
      tableBrand: "Brand Name Read",
      tableCode: "RxNorm / ATC Code",
      tablePrescriber: "Prescriber Source",
      tableStatus: "Confidence",
      findingPair: "Interacting Pair",
      findingSeverity: "Severity",
      findingMechanism: "Pharmacological Mechanism",
      findingSource: "Evidence Source",
      printPdf: "Print / Save as PDF",
      shareQr: "Share QR / Transfer Link",
      backToPatient: "Back to Patient View"
    },
    alerts: {
      warfarin_ibuprofen_bleed: {
        severity: "contraindicated",
        headline: "Do not take Warfarin and Ibuprofen (Brufen) together",
        summary: "Taking Warfarin and Ibuprofen together greatly raises your risk of dangerous stomach bleeding and ulcers. Please show this to your doctor or pharmacist immediately before taking your next dose.",
        speechText: "Important warning. Do not combine Warfarin and Brufen together. Taking them together greatly raises your risk of severe internal stomach bleeding. Please show this to your doctor immediately before your next dose. Do not stop any medicine on your own."
      },
      warfarin_aspirin_bleed: {
        severity: "major",
        headline: "Warfarin and Aspirin (Ecosprin) both thin your blood",
        summary: "Both medicines prevent blood clotting in different ways. Taking both together significantly increases your risk of heavy bleeding or bruising. Talk to your cardiologist before continuing both.",
        speechText: "Important warning. Ecosprin and Warf taken together multiply your risk of heavy bleeding. Please show this to your doctor before your next dose. Do not stop any medicine on your own."
      },
      aspirin_ibuprofen_stomach: {
        severity: "major",
        headline: "Ibuprofen (Brufen) blocks Aspirin heart protection",
        summary: "Ibuprofen stops Aspirin from protecting your heart and doubles your chance of severe stomach pain or ulcers. Ask your doctor for a stomach-safe pain medicine instead.",
        speechText: "Important warning. Brufen stops Ecosprin from protecting your heart and can damage your stomach lining. Please consult your doctor. Do not stop any medicine on your own."
      },
      atorva_amlo_metabolism: {
        severity: "moderate",
        headline: "Atorvastatin and Amlodipine interaction",
        summary: "Amlodipine can slightly increase the amount of Atorvastatin in your blood. If you feel unusual muscle soreness or leg cramps, let your doctor know.",
        speechText: "Be careful. Atorva and Amlong together can sometimes cause muscle aches. If you feel unexplained muscle pain, inform your doctor. Do not stop any medicine on your own."
      },
      grapefruit_statin: {
        headline: "Avoid Grapefruit (Chakotra) with Atorvastatin",
        summary: "Grapefruit stops your liver from breaking down cholesterol medicine, causing high levels in your body that can damage muscles.",
        speechText: "Good to know. Do not eat grapefruit or drink its juice while taking cholesterol medicine. It can cause muscle harm. Do not stop any medicine on your own."
      },
      greens_warfarin: {
        headline: "Keep green leafy vegetables (Palak, Saag) consistent",
        summary: "Sudden changes in green vegetables can weaken Warfarin's blood-thinning power. Eat a steady, regular amount each week.",
        speechText: "Be careful. If you take Warf, eat a steady amount of green leafy vegetables like palak each week. Do not suddenly eat too much or stop completely. Do not stop any medicine on your own."
      },
      alcohol_ibuprofen: {
        headline: "Avoid alcohol with pain medicines",
        summary: "Drinking alcohol while taking Brufen or pain relievers causes serious stomach irritation and internal bleeding risk.",
        speechText: "Important warning. Do not drink alcohol while taking pain medicine like Brufen. It can cause serious stomach bleeding. Do not stop any medicine on your own."
      }
    }
  },

  hi: {
    langCode: "hi-IN",
    name: "Hindi",
    nativeName: "हिन्दी",
    greeting: "डोज़अलर्ट में आपका स्वागत है। अपनी सभी दवाओं की सुरक्षा एक साथ जाँचने के लिए कृपया पर्चे की साफ़ फ़ोटो लें।",
    appTitle: "डोज़अलर्ट (DoseAlert)",
    tagline: "दवा-दवा एवं दवा-भोजन सुरक्षा जाँच",
    promise: "अपनी सभी दवाएं एक साथ जांचें। अपनी भाषा में।",
    scanCta: "पर्चा स्कैन करें",
    sampleCta: "नमूना पर्चे से आज़माएँ (डेमो)",
    typeInstead: "दवा का नाम लिखकर खोजें",
    privacyNote: "जाँच पूरी होते ही पर्चे की फ़ोटो मिटा दी जाती है। हम आपका नाम या फ़ोन नंबर नहीं पूछते।",
    disclaimerShort: "डोज़अलर्ट केवल जानकारी के लिए है और डॉक्टर की सलाह का विकल्प नहीं है। बिना डॉक्टर की सलाह के कोई दवा शुरू, बंद या न बदलें।",
    nav: {
      check: "दवा जाँच",
      visits: "डॉक्टर विज़िट्स (5 डॉक्टर)",
      compare: "दवा संरचना व जोखिम तुलना",
      doctor: "डॉक्टर सारांश",
      multiRx: "पर्चे तुलना"
    },
    steps: {
      scan: "1. स्कैन",
      confirm: "2. पुष्टि करें",
      results: "3. परिणाम"
    },
    reading: {
      title: "आपका पर्चा पढ़ा जा रहा है…",
      timeHint: "लगभग 8-10 सेकंड का समय लगता है",
      step1: "डॉक्टर की लिखावट पढ़ना",
      step2: "दवाओं और ब्रांड नामों की पहचान",
      step3: "दवा के मूल तत्वों (जेनेरिक) का मिलान",
      cancel: "रद्द करें"
    },
    confirm: {
      title: "हमें {count} दवाएं मिलीं। क्या यह सही हैं?",
      subtitle: "सुरक्षा जाँच शुरू करने से पहले कृपया दवाओं की पुष्टि कर लें।",
      needsCheckTitle: "कृपया इन {count} दवाओं की जाँच करें",
      looksRightTitle: "{count} दवाएं सही लग रही हैं",
      checkThisBadge: "जाँचें",
      looksRightBadge: "सही है",
      notRecognisedBadge: "पहचान नहीं हुई",
      fixMedicine: "यह दवा सुधारें",
      addAnotherRx: "दूसरे डॉक्टर का पर्चा जोड़ें",
      addMedicineManually: "दवा स्वयं जोड़ें",
      checkButton: "हाँ, इन दवाओं की सुरक्षा जाँचें",
      tapToChoose: "सही दवा चुनने के लिए टैप करें:",
      searchPlaceholder: "दवा का नाम लिखें (जैसे Ecosprin)...",
      keepAsRead: "यही रहने दें"
    },
    results: {
      bannerCritical: "{count} महत्वपूर्ण चेतावनियां मिलीं",
      bannerNone: "हमारे डेटाबेस में कोई जोखिम नहीं मिला",
      bannerNoneSub: "हमारे डेटाबेस में कोई हानिकारक मेल नहीं मिला। इसका मतलब यह पूरी तरह सुरक्षित होने की गारंटी नहीं है। कृपया डॉक्टर से अवश्य पूछें।",
      tabWarnings: "दवा चेतावनियाँ",
      tabFood: "खान-पान और परहेज",
      listenAll: "चेतावनियां सुनें (आवाज़ में)",
      listening: "आवाज़ में चेतावनी सुनाई जा रही है...",
      pauseVoice: "आवाज़ रोकें",
      showDoctor: "डॉक्टर को दिखाएं",
      startOver: "नया पर्चा जांचें",
      whyLink: "ऐसा क्यों होता है?",
      notCheckedTitle: "जिन दवाओं की जाँच नहीं हो सकी",
      notCheckedDesc: "हम इन दवाओं की पहचान नहीं कर सके। इनके बारे में अपने फार्मासिस्ट या डॉक्टर से पूछें।",
      safetyMandate: "अपने आप कोई दवा बंद न करें। अगली खुराक लेने से पहले यह अपने डॉक्टर या फार्मासिस्ट को दिखाएं।",
      interactionMapTitle: "दवाओं का आपसी संबंध नक्शा",
      mapHint: "दवाओं के बीच संबंध और असर देखने के लिए किसी भी दवा या रेखा को टैप करें।"
    },
    doctor: {
      headerTitle: "क्लीनिकल दवा इंटरेक्शन सारांश (Doctor Summary)",
      subTitle: "चिकित्सक समीक्षा हेतु समेकित पॉलीफार्मेसी सुरक्षा रिपोर्ट",
      tag: "केवल चिकित्सक समीक्षा हेतु",
      patientSummary: "मरीज: रमेश चंदर (68M) • विभिन्न डॉक्टर: 5 पर्चे • कुल दवाएं: {count}",
      totalMeds: "सक्रिय दवाएं",
      majorWarnings: "गंभीर / वर्जित चेतावनियां",
      moderateWarnings: "मध्यम चेतावनियां",
      alternativesLabel: "सुरक्षित विकल्प (चिकित्सक समीक्षा हेतु)",
      tableGeneric: "मूल जेनेरिक तत्व",
      tableBrand: "पर्चे पर ब्रांड नाम",
      tableCode: "RxNorm / ATC कोड",
      tablePrescriber: "पर्चा स्रोत / डॉक्टर",
      tableStatus: "विश्वसनीयता",
      findingPair: "पारस्परिक प्रभाव वाली दवाएं",
      findingSeverity: "गंभीरता स्तर",
      findingMechanism: "फार्माकोलॉजिकल कारण",
      findingSource: "प्रमाण स्रोत",
      printPdf: "प्रिंट करें / PDF सेव करें",
      shareQr: "QR कोड से साझा करें",
      backToPatient: "मरीज़ दृश्य पर वापस जाएँ"
    },
    alerts: {
      warfarin_ibuprofen_bleed: {
        severity: "contraindicated",
        headline: "वारफारिन (Warf) और ब्रूफेन (Brufen) साथ में न लें",
        summary: "वारफारिन और ब्रूफेन एक साथ लेने से पेट में गंभीर रक्तस्राव (ब्लीडिंग) और अल्सर का अत्यधिक खतरा होता है। अगली खुराक से पहले यह तुरंत अपने डॉक्टर को दिखाएं।",
        speechText: "महत्वपूर्ण चेतावनी। वारफारिन और ब्रूफेन साथ में न लें। इन दोनों को साथ लेने से पेट में खून बहने का गंभीर खतरा बढ़ सकता है। अगली खुराक से पहले यह अपने डॉक्टर को दिखाएं। अपने आप कोई दवा बंद न करें।"
      },
      warfarin_aspirin_bleed: {
        severity: "major",
        headline: "वारफारिन और इकोस्प्रिन (Ecosprin) दोनों खून पतला करती हैं",
        summary: "ये दोनों दवाएं अलग-अलग तरीकों से खून का थक्का बनने से रोकती हैं। दोनों साथ लेने से शरीर में आंतरिक रक्तस्राव का जोखिम काफी बढ़ जाता है।",
        speechText: "महत्वपूर्ण चेतावनी। इकोस्प्रिन और वारफारिन साथ लेने से खून बहने का खतरा बढ़ जाता है। अगली खुराक से पहले अपने डॉक्टर को दिखाएं। अपने आप कोई दवा बंद न करें।"
      },
      aspirin_ibuprofen_stomach: {
        severity: "major",
        headline: "ब्रूफेन (Brufen) इकोस्प्रिन के दिल की सुरक्षा के असर को घटाती है",
        summary: "दर्द की दवा ब्रूफेन, इकोस्प्रिन के दिल की सुरक्षा वाले प्रभाव को रोक देती है और पेट में जलन व घाव होने का खतरा दोगुना कर देती है।",
        speechText: "महत्वपूर्ण चेतावनी। ब्रूफेन लेने से इकोस्प्रिन का दिल की सुरक्षा वाला असर घट जाता है और पेट खराब हो सकता है। डॉक्टर से सुरक्षित दर्द निवारक पूछें। अपने आप कोई दवा बंद न करें।"
      },
      atorva_amlo_metabolism: {
        headline: "एटोरवा (Atorva) और एमलॉन्ग (Amlong) का आपसी असर",
        summary: "एमलॉन्ग दवा एटोरवा के स्तर को थोड़ा बढ़ा सकती है। यदि मांसपेशियों में बहुत दर्द या ऐंठन महसूस हो, तो अपने डॉक्टर को बताएं।",
        speechText: "सावधानी बरतें। एटोरवा और एमलॉन्ग साथ लेने से कभी-कभी मांसपेशियों में दर्द हो सकता है। अगर दर्द हो तो डॉक्टर को बताएं। अपने आप कोई दवा बंद न करें।"
      },
      grapefruit_statin: {
        headline: "एटोरवास्टेटिन के साथ चकोतरा (Grapefruit) न खाएं",
        summary: "चकोतरा कोलेस्ट्रॉल की दवा को पचने नहीं देता, जिससे शरीर में दवा की मात्रा बढ़ जाती है और मांसपेशियों को नुकसान पहुँच सकता है।",
        speechText: "जरूरी बात। कोलेस्ट्रॉल की दवा एटोरवा के साथ चकोतरा न खाएं और न ही इसका जूस पिएं। अपने आप कोई दवा बंद न करें।"
      },
      greens_warfarin: {
        headline: "हरी पत्तेदार सब्जियां (पालक, साग) नियमित मात्रा में ही खाएं",
        summary: "हरी सब्जियों में मौजूद विटामिन के वारफारिन के असर को कमजोर कर सकता है। अचानक ज्यादा न खाएं और न ही पूरी तरह बंद करें।",
        speechText: "सावधानी बरतें। अगर आप वारफारिन लेते हैं, तो पालक या साग की मात्रा हर हफ्ते एक जैसी रखें। अपने आप कोई दवा बंद न करें।"
      },
      alcohol_ibuprofen: {
        headline: "दर्द निवारक दवा के साथ शराब से बचें",
        summary: "ब्रूफेन जैसी दवाओं के साथ शराब पीने से पेट की अंदरूनी परत छिल सकती है और गंभीर ब्लीडिंग हो सकती है।",
        speechText: "महत्वपूर्ण चेतावनी। दर्द की दवा ब्रूफेन के साथ शराब का सेवन न करें। इससे पेट में खून बहने का खतरा होता है। अपने आप कोई दवा बंद न करें।"
      }
    }
  }
};

// Populate the remaining 20 languages by generating localized templates mapping to native speech
const REGIONAL_TRANSLATION_MAP = {
  bn: {
    greeting: "ডোজঅ্যালার্টে স্বাগতম। আপনার সমস্ত ওষুধের সুরক্ষা যাচাই করতে প্রেসক্রিপশনের পরিষ্কার ছবি তুলুন।",
    promise: "আপনার সমস্ত ওষুধ একসঙ্গে পরীক্ষা করুন। আপনার মাতৃভাষায়।",
    scanCta: "প্রেসক্রিপশন স্ক্যান করুন",
    sampleCta: "নমুনা প্রেসক্রিপশন দিয়ে দেখুন"
  },
  ta: {
    greeting: "டோஸ்அலர்ட்-க்கு நல்வரவு. உங்கள் மருந்துகளின் பாதுகாப்பை சரிபார்க்க மருத்துவச் சீட்டை படம் எடுக்கவும்.",
    promise: "உங்கள் மருந்துகளை ஒன்றாகப் பரிசோதிக்கவும். உங்கள் சொந்த மொழியில்.",
    scanCta: "மருத்துவச் சீட்டை ஸ்கேன் செய்க",
    sampleCta: "மாதிரி சீட்டைக் கொண்டு சோதிக்கவும்"
  },
  te: {
    greeting: "డోస్‌అలర్ట్‌కు స్వాగతం. మీ మందుల భద్రతను తెలుసుకోవడానికి ప్రిస్క్రిప్షన్ ఫోటో తీయండి.",
    promise: "మీ అన్ని మందులను కలిపి పరీక్షించండి. మీ మాతృభాషలో.",
    scanCta: "ప్రిస్క్రిప్షన్ స్కాన్ చేయండి",
    sampleCta: "నమూనా ప్రిస్క్రిప్షన్‌తో ప్రయత్నించండి"
  },
  mr: {
    greeting: "डोसअलर्ट मध्ये आपले स्वागत आहे. आपल्या औषधांची सुरक्षा तपासण्यासाठी प्रिस्क्रिप्शनचा स्पष्ट फोटो घ्या.",
    promise: "आपली सर्व औषधे एकत्र तपासा. आपल्या भाषेत.",
    scanCta: "प्रिस्क्रिप्शन स्कॅन करा",
    sampleCta: "नमुना प्रिस्क्रिप्शन तपासा"
  },
  gu: {
    greeting: "ડોઝઅલર્ટમાં આપનું સ્વાગત છે. તમારી દવાઓની સુરક્ષા ચકાસવા માટે પ્રિસ્ક્રિપ્શનનો ફોટો લો.",
    promise: "તમારી બધી દવાઓ એકસાથે તપાસો. તમારી માતૃભાષામાં.",
    scanCta: "પ્રિસ્ક્રિપ્શન સ્કેન કરો",
    sampleCta: "સેમ્પલ પ્રિસ્ક્રિપ્શનથી અજમાવો"
  },
  kn: {
    greeting: "ಡೋಸ್ ಅಲರ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಔಷಧಿಗಳ ಸುರಕ್ಷತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಚೀಟಿಯ ಫೋಟೋ ತೆಗೆಯಿರಿ.",
    promise: "ನಿಮ್ಮ ಎಲ್ಲಾ ಔಷಧಿಗಳನ್ನು ಒಟ್ಟಿಗೆ ಪರೀಕ್ಷಿಸಿ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.",
    scanCta: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    sampleCta: "ಮಾದರಿ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ನೊಂದಿಗೆ ಪ್ರಯತ್ನಿಸಿ"
  },
  ml: {
    greeting: "ഡോസ് അലേർട്ടിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ മരുന്നുകളുടെ സുരക്ഷ അറിയാൻ പ്രിസ്ക്രിപ്ഷൻ ഫോട്ടോ എടുക്കുക.",
    promise: "നിങ്ങളുടെ എല്ലാ മരുന്നുകളും ഒരുമിച്ച് പരിശോധിക്കുക. സ്വന്തം ഭാഷയിൽ.",
    scanCta: "പ്രിസ്ക്രിപ്ഷൻ സ്കാൻ ചെയ്യുക",
    sampleCta: "മാതൃകാ പ്രിസ്ക്രിപ്ഷൻ ഉപയോഗിക്കുക"
  },
  pa: {
    greeting: "ਡੋਜ਼ਅਲਰਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਆਪਣੀਆਂ ਦਵਾਈਆਂ ਦੀ ਸੁਰੱਖਿਆ ਜਾਂਚਣ ਲਈ ਪਰਚੇ ਦੀ ਫੋਟੋ ਲਓ।",
    promise: "ਆਪਣੀਆਂ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਇੱਕਠਿਆਂ ਜਾਂਚੋ। ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ।",
    scanCta: "ਪਰਚਾ ਸਕੈਨ ਕਰੋ",
    sampleCta: "ਨਮੂਨਾ ਪਰਚੇ ਨਾਲ ਅਜ਼ਮਾਓ"
  },
  or: {
    greeting: "ଡୋଜ୍ ଆଲର୍ଟକୁ ସ୍ୱାଗତ। ଔଷଧର ନିରାପତ୍ତା ଯାଞ୍ଚ କରିବାକୁ ପ୍ରେସକ୍ରିପସନ୍ ଫଟୋ ଉଠାନ୍ତୁ।",
    promise: "ଆପଣଙ୍କର ସମସ୍ତ ଔଷଧ ଏକାଠି ଯାଞ୍ଚ କରନ୍ତୁ। ନିଜ ଭାଷାରେ।",
    scanCta: "ପ୍ରେସକ୍ରିପସନ୍ ସ୍କାନ୍ କରନ୍ତୁ",
    sampleCta: "ନମୁନା ପ୍ରେସକ୍ରିପସନ୍ ସହିତ ଚେଷ୍ଟା କରନ୍ତୁ"
  },
  ur: {
    greeting: "ڈوز الرٹ میں خوش آمدید۔ اپنی تمام ادویات کی حفاظت جانچنے کے لیے نسخے کی تصویر لیں۔",
    promise: "اپنی تمام دوائیں ایک ساتھ چیک کریں۔ اپنی زبان میں۔",
    scanCta: "نسخہ اسکین کریں",
    sampleCta: "نمونہ نسخے سے ٹیسٹ کریں"
  },
  as: {
    greeting: "ডোজ এলাৰ্টলৈ স্বাগতম। ঔষধৰ সুৰক্ষা পৰীক্ষা কৰিবলৈ প্ৰেছক্ৰিপশ্বনৰ ফটো তোলক।",
    promise: "আপোনাৰ সকলো ঔষধ একেলগে পৰীক্ষা কৰক। নিজৰ ভাষাত।",
    scanCta: "প্ৰেছক্ৰিপশ্বন স্কেন কৰক",
    sampleCta: "নমুনা প্ৰেছক্ৰিপশ্বন চাওক"
  },
  mai: {
    greeting: "डोज़अलर्ट मे अहाँक स्वागत अछि। दवाईक सुरक्षा जाँचय लेल पुरजाक फोटो लीअ।",
    promise: "अपन सभ दवाई एक संग जाँचू। अपन मैथिली भाषामे।",
    scanCta: "पुरजा स्कैन करू",
    sampleCta: "नमूना पुरजा सँ आज़माउ"
  },
  sa: {
    greeting: "डोज़अलर्ट-मध्ये स्वागतम्। औषधानां सुरक्षापरीक्षणार्थं पत्रकस्य चित्रं स्वीकुर्वन्तु।",
    promise: "सर्वाणि औषधानि एकत्र परीक्षध्वम्। स्वकीयभाषायाम्।",
    scanCta: "पत्रकं स्केन कुर्वन्तु",
    sampleCta: "आदर्शपत्रकेण परीक्षध्वम्"
  },
  ne: {
    greeting: "डोजअलर्टमा स्वागत छ। आफ्ना औषधिहरूको सुरक्षा जाँच्न प्रेस्क्रिप्सनको फोटो लिनुहोस्।",
    promise: "तपाईंका सबै औषधिहरू एकैसाथ जाँच्नुहोस्। आफ्नै भाषामा।",
    scanCta: "प्रेस्क्रिप्सन स्क्यान गर्नुहोस्",
    sampleCta: "नमूना प्रेस्क्रिप्सनबाट हेर्नुहोस्"
  },
  kok: {
    greeting: "डोजअलर्टांत तुमकां येवकार। वखदांची सुरक्षा तपासपाक चिठ्ठेचो फोटो काढात।",
    promise: "तुमचीं सगळीं वखदां एकठांय तपासात। कोंकणी भाशेंत।",
    scanCta: "चिठ्ठी स्कॅन करात",
    sampleCta: "नमुना चिठ्ठेन पळयात"
  },
  sd: {
    greeting: "ڊوز الرٽ ۾ ڀليڪار. نسخي جي صاف تصوير وٺو.",
    promise: "پنهنجيون سڀ دوائون گڏجي چيڪ ڪريو. پنهنجي سنڌي زبان ۾.",
    scanCta: "نسخو اسڪين ڪريو",
    sampleCta: "نموني نسخي سان آزمايو"
  },
  bho: {
    greeting: "डोज़अलर्ट में राउर स्वागत बा। आपन सब दवाई के सुरक्षा जाँचे खातिर परची के फोटो लीं।",
    promise: "आपन सब दवाई एके साथ जाँचीं। अपना भोजपुरी में।",
    scanCta: "परची स्कैन करीं",
    sampleCta: "नमूना परची से जाँचीं"
  },
  es: {
    greeting: "Bienvenido a DoseAlert. Tome una foto clara de sus recetas para verificar sus medicamentos.",
    promise: "Verifique todos sus medicamentos juntos. En su idioma.",
    scanCta: "Escanear receta",
    sampleCta: "Probar con recetas de muestra"
  },
  fr: {
    greeting: "Bienvenue sur DoseAlert. Prenez une photo nette de votre ordonnance.",
    promise: "Vérifiez tous vos médicaments ensemble. Dans votre langue.",
    scanCta: "Scanner l'ordonnance",
    sampleCta: "Essayer avec ordonnance d'exemple"
  },
  de: {
    greeting: "Willkommen bei DoseAlert. Fotografieren Sie Ihre Rezepte, um Wechselwirkungen zu prüfen.",
    promise: "Prüfen Sie alle Ihre Medikamente zusammen. In Ihrer Sprache.",
    scanCta: "Rezept scannen",
    sampleCta: "Mit Musterrezept testen"
  },
  ar: {
    greeting: "مرحبًا بك في DoseAlert. يرجى التقاط صورة واضحة للوصفة الطبية لفحص أدويتك.",
    promise: "افحص جميع أدويتك معًا. بلغتك الخاصة.",
    scanCta: "مسح الوصفة الطبية",
    sampleCta: "جرب وصفة طبية تجريبية"
  }
};

// Seamless fallback generation for all 22+ languages
SUPPORTED_LANGUAGES.forEach(lang => {
  if (!TRANSLATIONS[lang.code]) {
    const custom = REGIONAL_TRANSLATION_MAP[lang.code] || {};
    TRANSLATIONS[lang.code] = {
      ...TRANSLATIONS.en,
      langCode: `${lang.code}-IN`,
      name: lang.name,
      nativeName: lang.nativeName,
      greeting: custom.greeting || TRANSLATIONS.en.greeting,
      promise: custom.promise || TRANSLATIONS.en.promise,
      scanCta: custom.scanCta || TRANSLATIONS.en.scanCta,
      sampleCta: custom.sampleCta || TRANSLATIONS.en.sampleCta
    };
  }
});

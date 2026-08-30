import type { Lang } from '@/types';

export const t = {
  // Brand
  appName: { mr: 'शेतकरीHit', hi: 'शेतकरीHit', en: 'ShetkariHit' },
  tagline: { mr: 'एक निर्णय, चांगलं पीक', hi: 'एक निर्णय, बेहतर फसल', en: 'One decision for a better crop' },

  // Nav
  navToday: { mr: 'आज', hi: 'आज', en: 'Today' },
  navAsk: { mr: 'विचारा', hi: 'पूछें', en: 'Ask' },
  navSchemes: { mr: 'योजना', hi: 'योजनाएं', en: 'Schemes' },
  navAccount: { mr: 'खाते', hi: 'खाता', en: 'Account' },

  // Intro
  introValue1: {
    mr: 'दिवसाचा एक स्पष्ट निर्णय — पाणी, कीड, बाजार एकत्र जोडून',
    hi: 'रोज़ एक स्पष्ट निर्णय — पानी, कीट और बाज़ार एक साथ',
    en: 'One clear decision each day — water, pest, and market combined',
  },
  introValue2: {
    mr: 'मराठीत बोलून शंका विचारा, थेट उत्तर मिळवा',
    hi: 'हिंदी में बोलकर सवाल पूछें, सीधा जवाब पाएं',
    en: 'Ask questions by speaking in Marathi, get instant answers',
  },
  introValue3: {
    mr: 'तुमच्या शेतासाठी योजना व सबसिडी एका ठिकाणी',
    hi: 'आपके खेत के लिए योजनाएं और सब्सिडी एक जगह',
    en: 'Schemes and subsidies for your farm, all in one place',
  },
  getStarted: { mr: 'सुरुवात करा', hi: 'शुरू करें', en: 'Get Started' },
  alreadyAccount: { mr: 'आधीच खाते आहे? लॉगिन करा', hi: 'पहले से खाता है? लॉगिन करें', en: 'Already have an account? Log in' },
  newFarmer: { mr: 'नवीन शेतकरी? खाते तयार करा', hi: 'नए किसान? खाता बनाएं', en: 'New farmer? Create an account' },
  sendOtp: { mr: 'ओटीपी पाठवा', hi: 'ओटीपी भेजें', en: 'Send OTP' },
  sendOtpStart: { mr: 'ओटीपी पाठवा व सुरुवात करा', hi: 'ओटीपी भेजें और शुरू करें', en: 'Send OTP & Get Started' },
  otpNote: {
    mr: 'तुमचे खाते ओटीपीद्वारे तयार होईल',
    hi: 'आपका खाता ओटीपी से बनाया जाएगा',
    en: 'Your account will be created via OTP',
  },

  // Auth — Sign Up / Log In
  signupHeadline: { mr: 'नवीन शेतकरी? खाते तयार करा 🌱', hi: 'नए किसान? खाता बनाएं 🌱', en: 'New farmer? Create an account 🌱' },
  signupSubtitle: {
    mr: 'तुमचा ईमेल आणि पासवर्ड वापरून नोंदणी करा',
    hi: 'अपना ईमेल और पासवर्ड उपयोग कर पंजीकरण करें',
    en: 'Sign up with your email and password',
  },
  loginHeadline: { mr: 'पुन्हा स्वागत आहे! 🌿', hi: 'वापस स्वागत है! 🌿', en: 'Welcome back! 🌿' },
  loginSubtitle: {
    mr: 'तुमच्या खात्यात ईमेल आणि पासवर्डने लॉगिन करा',
    hi: 'अपने खाते में ईमेल और पासवर्ड से लॉगिन करें',
    en: 'Log in with your email and password',
  },
  switchToLogin: { mr: 'आधीच खाते आहे? लॉगिन करा', hi: 'पहले से खाता है? लॉगिन करें', en: 'Already have an account? Log in' },
  switchToSignup: { mr: 'नवीन आहात? खाते तयार करा', hi: 'नए हैं? खाता बनाएं', en: 'New here? Create an account' },
  emailLabel: { mr: 'ईमेल आयडी (Email)', hi: 'ईमेल आईडी (Email)', en: 'Email Address' },
  emailPlaceholder: { mr: 'shetkari@gmail.com', hi: 'kisan@gmail.com', en: 'farmer@gmail.com' },
  passwordLabel: { mr: 'पासवर्ड (Password)', hi: 'पासवर्ड (Password)', en: 'Password' },
  passwordPlaceholder: { mr: 'किमान ६ अक्षरे', hi: 'न्यूनतम 6 अक्षर', en: 'At least 6 characters' },
  confirmPasswordLabel: { mr: 'पासवर्डची पुष्टी करा (Confirm Password)', hi: 'पासवर्ड की पुष्टि करें (Confirm Password)', en: 'Confirm Password' },
  confirmPasswordPlaceholder: { mr: 'पासवर्ड पुन्हा टाका', hi: 'पासवर्ड दोबारा डालें', en: 'Re-enter your password' },
  passwordMismatch: { mr: 'दोन्ही पासवर्ड जुळत नाहीत.', hi: 'दोनों पासवर्ड मेल नहीं खाते।', en: 'Passwords do not match.' },
  fullNameLabel: { mr: 'तुमचे पूर्ण नाव (Full Name)', hi: 'आपका पूरा नाम (Full Name)', en: 'Your Name' },
  nameRequired: { mr: 'नाव आवश्यक आहे (किमान २ अक्षरे).', hi: 'नाम आवश्यक है (कम से कम 2 अक्षर)।', en: 'Name is required (at least 2 letters).' },
  loginBtn: { mr: 'लॉगिन करा', hi: 'लॉगिन करें', en: 'Log In' },
  signupBtn: { mr: 'खाते तयार करा', hi: 'खाता बनाएं', en: 'Create Account' },
  mobileLabel: { mr: 'मोबाइल क्रमांक', hi: 'मोबाइल नंबर', en: 'Mobile Number' },
  mobilePlaceholder: { mr: '+91 98765 43210', hi: '+91 98765 43210', en: '+91 98765 43210' },

  // OTP page
  otpHeadline: { mr: 'ओटीपी पडताळा', hi: 'ओटीपी सत्यापित करें', en: 'Verify OTP' },
  otpSentTo: { mr: 'ओटीपी पाठवला:', hi: 'ओटीपी भेजा:', en: 'OTP sent to:' },
  otpVerifyBtn: { mr: 'पडताळा करा', hi: 'सत्यापित करें', en: 'Verify OTP' },
  changeMobile: { mr: 'मोबाइल क्रमांक बदला', hi: 'मोबाइल नंबर बदलें', en: 'Change number' },
  resendOtp: { mr: 'पुन्हा ओटीपी पाठवा', hi: 'ओटीपी दोबारा भेजें', en: 'Resend OTP' },
  resendIn: { mr: 'पुन्हा पाठवा', hi: 'दोबारा भेजें', en: 'Resend in' },
  seconds: { mr: 'सेकंद', hi: 'सेकंड', en: 'sec' },

  // Onboarding wizard
  onboardingWelcome: { mr: 'शेतकरीहित मध्ये आपले स्वागत आहे 🌱', hi: 'शेतकरीHit में आपका स्वागत है 🌱', en: 'Welcome to ShetkariHit 🌱' },
  onboardingSubtitle: {
    mr: 'तुमच्या शेताबद्दल थोडी माहिती द्या — आम्ही तुमचे सल्ले तयार करू',
    hi: 'अपने खेत के बारे में थोड़ी जानकारी दें — हम आपकी सलाह तैयार करेंगे',
    en: 'Tell us about your farm so we can personalise your daily advice',
  },
  onboardingStep1Title: { mr: 'तुमचे शेत किती एकर आहे?', hi: 'आपका खेत कितने एकड़ का है?', en: 'How many acres is your farm?' },
  onboardingStep2Title: { mr: 'तुम्ही कुठे राहता?', hi: 'आप कहाँ रहते हैं?', en: 'Where are you located?' },
  onboardingStep3Title: { mr: 'सध्या कोणते पीक आहे?', hi: 'अभी कौन सी फसल है?', en: 'What crop are you growing?' },
  acresLabel: { mr: 'एकर', hi: 'एकड़', en: 'Acres' },
  villageLabel: { mr: 'गाव / तालुका', hi: 'गांव / तहसील', en: 'Village / Taluka' },
  districtLabel: { mr: 'जिल्हा', hi: 'जिला', en: 'District' },
  nextBtn: { mr: 'पुढे', hi: 'आगे', en: 'Next' },
  backBtn: { mr: 'मागे', hi: 'पीछे', en: 'Back' },
  doneBtn: { mr: 'सुरुवात करूया!', hi: 'शुरू करते हैं!', en: "Let's Go!" },
  onboardingSkip: { mr: 'नंतर भरतो', hi: 'बाद में भरूंगा', en: 'Fill later' },

  // Onboarding — step titles (6 steps)
  stepPersonal: { mr: 'वैयक्तिक माहिती', hi: 'व्यक्तिगत जानकारी', en: 'Personal Info' },
  stepLocation: { mr: 'स्थान', hi: 'स्थान', en: 'Location' },
  stepFarmLand: { mr: 'शेत व जमीन', hi: 'खेत और जमीन', en: 'Farm & Land' },
  stepCrop: { mr: 'सध्याचे पीक', hi: 'वर्तमान फसल', en: 'Current Crop' },
  stepSoil: { mr: 'जमीन व सिंचन', hi: 'मिट्टी और सिंचाई', en: 'Soil & Irrigation' },
  stepReview: { mr: 'पुनरावलोकन', hi: 'समीक्षा', en: 'Review' },
  nameLabel: { mr: 'पूर्ण नाव', hi: 'पूरा नाम', en: 'Full Name' },
  stateLabel: { mr: 'राज्य', hi: 'राज्य', en: 'State' },
  cropNameLabel: { mr: 'पिकाचे नाव', hi: 'फसल का नाम', en: 'Crop name' },
  varietyLabel: { mr: 'वाण / जात', hi: 'किस्म / जाति', en: 'Variety' },
  sowingDateLabel: { mr: 'पेरणी दिनांक', hi: 'बुवाई की तारीख', en: 'Sowing date' },
  addAnotherCrop: { mr: '+ आणखी एक पीक जोडा', hi: '+ एक और फसल जोड़ें', en: '+ Add another crop' },
  removeCrop: { mr: 'काढा', hi: 'हटाएं', en: 'Remove' },

  // Crop Comparison
  compareCrops: { mr: 'पीक तुलना करा', hi: 'फसल तुलना करें', en: 'Compare Crops' },
  compareCropsHint: {
    mr: 'तुमच्या जमिनीसाठी योग्य पीक निवडण्यास मदत करतो',
    hi: 'आपकी जमीन के लिए सही फसल चुनने में मदद करता है',
    en: 'Helps you choose the right crop for your land',
  },
  selectThisCrop: { mr: 'हे पीक निवडा', hi: 'यह फसल चुनें', en: 'Select this crop' },
  typeManually: { mr: 'स्वतः भरतो', hi: 'खुद भरूंगा', en: "I'll type it" },
  profitRange: { mr: 'नफा अंदाज', hi: 'मुनाफा अनुमान', en: 'Profit range' },
  waterReq: { mr: 'पाण्याची गरज', hi: 'पानी की जरूरत', en: 'Water req.' },
  duration: { mr: 'कालावधी', hi: 'अवधि', en: 'Duration' },
  priceTrend: { mr: 'बाजार कल', hi: 'बाज़ार रुझान', en: 'Price trend' },
  trendUp: { mr: '↑ वाढतोय', hi: '↑ बढ़ रहा', en: '↑ Rising' },
  trendDown: { mr: '↓ घसरतोय', hi: '↓ गिर रहा', en: '↓ Falling' },
  trendStable: { mr: '→ स्थिर', hi: '→ स्थिर', en: '→ Stable' },

  // Soil & Irrigation chips
  soilMedium: { mr: 'मध्यम (चिकट)', hi: 'मध्यम (दोमट)', en: 'Medium (Loamy)' },
  soilLoamy: { mr: 'गाळाची', hi: 'जलोढ़', en: 'Alluvial' },
  soilSandy: { mr: 'वालुकामय', hi: 'रेतीली', en: 'Sandy' },
  soilClay: { mr: 'चिकण माती', hi: 'चिकनी मिट्टी', en: 'Clay' },
  irrDrip: { mr: 'ठिबक', hi: 'ड्रिप', en: 'Drip' },
  irrFlood: { mr: 'पूर सिंचन', hi: 'बाढ़ सिंचाई', en: 'Flood' },
  irrSprinkler: { mr: 'तुषार', hi: 'फव्वारा', en: 'Sprinkler' },
  srcBorewell: { mr: 'बोअरवेल', hi: 'बोरवेल', en: 'Borewell' },
  srcCanal: { mr: 'कालवा', hi: 'नहर', en: 'Canal' },
  srcRiver: { mr: 'नदी', hi: 'नदी', en: 'River' },
  srcRainfed: { mr: 'पावसावर अवलंबून', hi: 'वर्षा आधारित', en: 'Rainfed' },

  // Review step
  reviewTitle: { mr: 'सर्व माहिती तपासा', hi: 'सारी जानकारी जाँचें', en: 'Review your info' },
  reviewSubtitle: {
    mr: 'सर्व काही बरोबर असल्यास सुरुवात करा',
    hi: 'सब सही हो तो शुरू करें',
    en: 'If everything looks correct, get started',
  },
  confirmStart: { mr: 'पूर्ण करा व सुरुवात करा', hi: 'पूरा करें और शुरू करें', en: 'Confirm & Get Started' },

  // Account page milestone labels
  milestonePersonal: { mr: 'नाव', hi: 'नाम', en: 'Name' },
  milestoneLocation: { mr: 'स्थान', hi: 'स्थान', en: 'Location' },
  milestoneFarm: { mr: 'शेत', hi: 'खेत', en: 'Farm' },
  milestoneCrop: { mr: 'पीक', hi: 'फसल', en: 'Crop' },
  milestoneSoil: { mr: 'जमीन', hi: 'मिट्टी', en: 'Soil' },
  milestoneAll: { mr: 'पूर्ण', hi: 'पूर्ण', en: 'Done' },

  // Today page
  greeting: { mr: 'नमस्कार, रवी 👋', hi: 'नमस्ते, रवि 👋', en: 'Hello, Ravi 👋' },
  farmInfo: { mr: '४ एकर · कोपरगाव', hi: '४ एकड़ · कोपरगाव', en: '4 acres · Kopargaon' },
  todayAction: { mr: 'आजचा सल्ला', hi: 'आज की सलाह', en: "Today's Action" },
  listen: { mr: 'ऐका', hi: 'सुनें', en: 'Listen' },
  whyThis: { mr: 'हा सल्ला का?', hi: 'यह सलाह क्यों?', en: 'Why this advice?' },
  next3Days: { mr: 'पुढील ३ दिवस', hi: 'अगले ३ दिन', en: 'Next 3 Days' },
  profitOutlook: { mr: 'नफा अंदाज', hi: 'मुनाफा अनुमान', en: 'Profit Outlook' },
  marketSnapshot: { mr: 'बाजार भाव', hi: 'बाज़ार भाव', en: 'Market Snapshot' },
  whatIf: { mr: 'जर असे झाले तर?', hi: 'अगर ऐसा हो तो?', en: 'What if?' },
  confidenceHigh: { mr: 'उच्च विश्वास', hi: 'उच्च विश्वास', en: 'High confidence' },
  confidenceMedium: { mr: 'मध्यम विश्वास', hi: 'मध्यम विश्वास', en: 'Medium confidence' },
  confidenceLow: { mr: 'कमी विश्वास', hi: 'कम विश्वास', en: 'Low confidence' },
  lastUpdated: { mr: 'शेवटचे अपडेट', hi: 'अंतिम अपडेट', en: 'Last updated' },
  estProfit: { mr: 'अंदाजित नफा', hi: 'अनुमानित मुनाफा', en: 'Estimated profit' },

  // Ask page
  askPlaceholder: { mr: 'तुमचा प्रश्न लिहा किंवा बोला...', hi: 'अपना सवाल लिखें या बोलें...', en: 'Type or speak your question...' },
  suggestionChips: { mr: 'उदाहरण प्रश्न', hi: 'उदाहरण सवाल', en: 'Example questions' },

  // Schemes
  schemesTitle: { mr: 'सरकारी योजना', hi: 'सरकारी योजनाएं', en: 'Government Schemes' },
  schemesSubtitle: {
    mr: 'तुमच्या शेतासाठी योग्य योजना',
    hi: 'आपके खेत के लिए सही योजनाएं',
    en: 'Schemes relevant to your farm',
  },
  highRelevance: { mr: 'अत्यंत योग्य', hi: 'अत्यंत उपयुक्त', en: 'Highly relevant' },
  mediumRelevance: { mr: 'योग्य', hi: 'उपयुक्त', en: 'Relevant' },
  applyNow: { mr: 'अर्ज करा', hi: 'आवेदन करें', en: 'Apply now' },
  learnMore: { mr: 'अधिक माहिती', hi: 'अधिक जानें', en: 'Learn more' },

  // Account
  accountTitle: { mr: 'माझे खाते', hi: 'मेरा खाता', en: 'My Account' },
  profileComplete: { mr: 'प्रोफाइल', hi: 'प्रोफ़ाइल', en: 'Profile' },
  complete: { mr: 'पूर्ण', hi: 'पूर्ण', en: 'complete' },
  personalInfo: { mr: 'वैयक्तिक माहिती', hi: 'व्यक्तिगत जानकारी', en: 'Personal Information' },
  location: { mr: 'स्थान', hi: 'स्थान', en: 'Location' },
  farmLand: { mr: 'शेत व जमीन', hi: 'खेत और जमीन', en: 'Farm & Land' },
  currentCrop: { mr: 'सध्याचे पीक', hi: 'वर्तमान फसल', en: 'Current Crop' },
  soilIrrigation: { mr: 'जमीन व सिंचन', hi: 'मिट्टी और सिंचाई', en: 'Soil & Irrigation' },
  autoData: { mr: 'स्वयं-प्राप्त माहिती', hi: 'स्वत:-प्राप्त जानकारी', en: 'Auto-Fetched Data' },
  addMoreInfo: { mr: 'अधिक माहिती जोडा', hi: 'अधिक जानकारी जोड़ें', en: 'Add More Information' },
  settings: { mr: 'सेटिंग्ज', hi: 'सेटिंग्स', en: 'Settings' },
  language: { mr: 'भाषा', hi: 'भाषा', en: 'Language' },
  voiceToggle: { mr: 'आवाज सल्ला', hi: 'आवाज सलाह', en: 'Voice advice' },
  logout: { mr: 'बाहेर पडा', hi: 'लॉग आउट', en: 'Log out' },
  name: { mr: 'नाव', hi: 'नाम', en: 'Name' },
  mobile: { mr: 'मोबाइल', hi: 'मोबाइल', en: 'Mobile' },
  village: { mr: 'गाव', hi: 'गांव', en: 'Village' },
  district: { mr: 'जिल्हा', hi: 'जिला', en: 'District' },
  state: { mr: 'राज्य', hi: 'राज्य', en: 'State' },
  crop: { mr: 'पीक', hi: 'फसल', en: 'Crop' },
  variety: { mr: 'वाण', hi: 'किस्म', en: 'Variety' },
  sowingDate: { mr: 'पेरणी दिनांक', hi: 'बुवाई तारीख', en: 'Sowing date' },
  area: { mr: 'क्षेत्र', hi: 'क्षेत्रफल', en: 'Area' },
  soil: { mr: 'जमीन', hi: 'मिट्टी', en: 'Soil' },
  irrigation: { mr: 'सिंचन', hi: 'सिंचाई', en: 'Irrigation' },
  waterSource: { mr: 'पाणी स्रोत', hi: 'पानी का स्रोत', en: 'Water source' },
  needs: { mr: 'गरजा', hi: 'जरूरतें', en: 'Needs' },

  // Common
  cancel: { mr: 'रद्द करा', hi: 'रद्द करें', en: 'Cancel' },
  save: { mr: 'जतन करा', hi: 'सहेजें', en: 'Save' },
} as const;

export type TranslationKey = keyof typeof t;

export function tr(key: TranslationKey, lang: Lang): string {
  const entry = t[key] as Record<string, string>;
  return entry[lang] ?? entry['mr'] ?? entry['en'] ?? key;
}

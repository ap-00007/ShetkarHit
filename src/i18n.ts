import type { Lang } from '@/types';

export const t = {
  // Brand
  appName: { mr: 'शेतकरीHit', en: 'ShetkariHit' },
  tagline: { mr: 'एक निर्णय, चांगलं पीक', en: 'One decision for a better crop' },

  // Nav
  navToday: { mr: 'आज', en: 'Today' },
  navAsk: { mr: 'विचारा', en: 'Ask' },
  navSchemes: { mr: 'योजना', en: 'Schemes' },
  navAccount: { mr: 'खाते', en: 'Account' },

  // Intro
  introValue1: {
    mr: 'दिवसाचा एक स्पष्ट निर्णय — पाणी, कीड, बाजार एकत्र जोडून',
    en: 'One clear decision each day — water, pest, and market combined',
  },
  introValue2: {
    mr: 'मराठीत बोलून शंका विचारा, थेट उत्तर मिळवा',
    en: 'Ask questions by speaking in Marathi, get instant answers',
  },
  introValue3: {
    mr: 'तुमच्या शेतासाठी योजना व सबसिडी एका ठिकाणी',
    en: 'Schemes and subsidies for your farm, all in one place',
  },
  getStarted: { mr: 'सुरुवात करा', en: 'Get Started' },
  alreadyAccount: { mr: 'आधीच खाते आहे? लॉगिन करा', en: 'Already have an account? Log in' },
  newFarmer: { mr: 'नवीन शेतकरी? खाते तयार करा', en: 'New farmer? Create an account' },
  sendOtp: { mr: 'ओटीपी पाठवा', en: 'Send OTP' },
  sendOtpStart: { mr: 'ओटीपी पाठवा व सुरुवात करा', en: 'Send OTP & Get Started' },
  otpNote: {
    mr: 'तुमचे खाते ओटीपीद्वारे तयार होईल',
    en: 'Your account will be created via OTP',
  },

  // Auth — Sign Up / Log In
  signupHeadline: { mr: 'नवीन शेतकरी? खाते तयार करा', en: 'New farmer? Create an account' },
  signupSubtitle: {
    mr: 'मोबाइल क्रमांक द्या, आम्ही ओटीपी पाठवतो',
    en: "Enter your mobile number and we'll send you an OTP",
  },
  loginHeadline: { mr: 'पुन्हा स्वागत आहे! 🌿', en: 'Welcome back! 🌿' },
  loginSubtitle: {
    mr: 'तुमच्या खात्यात लॉगिन करा',
    en: 'Log in to your account',
  },
  switchToLogin: { mr: 'आधीच खाते आहे? लॉगिन करा', en: 'Already have an account? Log in' },
  switchToSignup: { mr: 'नवीन आहात? खाते तयार करा', en: 'New here? Create an account' },
  mobileLabel: { mr: 'मोबाइल क्रमांक', en: 'Mobile Number' },
  mobilePlaceholder: { mr: '+91 98765 43210', en: '+91 98765 43210' },

  // OTP page
  otpHeadline: { mr: 'ओटीपी पडताळा', en: 'Verify OTP' },
  otpSentTo: { mr: 'ओटीपी पाठवला:', en: 'OTP sent to:' },
  otpVerifyBtn: { mr: 'पडताळा करा', en: 'Verify OTP' },
  changeMobile: { mr: 'मोबाइल क्रमांक बदला', en: 'Change number' },
  resendOtp: { mr: 'पुन्हा ओटीपी पाठवा', en: 'Resend OTP' },
  resendIn: { mr: 'पुन्हा पाठवा', en: 'Resend in' },
  seconds: { mr: 'सेकंद', en: 'sec' },

  // Onboarding wizard
  onboardingWelcome: { mr: 'शेतकरीहित मध्ये आपले स्वागत आहे 🌱', en: 'Welcome to ShetkariHit 🌱' },
  onboardingSubtitle: {
    mr: 'तुमच्या शेताबद्दल थोडी माहिती द्या — आम्ही तुमचे सल्ले तयार करू',
    en: 'Tell us about your farm so we can personalise your daily advice',
  },
  onboardingStep1Title: { mr: 'तुमचे शेत किती एकर आहे?', en: 'How many acres is your farm?' },
  onboardingStep2Title: { mr: 'तुम्ही कुठे राहता?', en: 'Where are you located?' },
  onboardingStep3Title: { mr: 'सध्या कोणते पीक आहे?', en: 'What crop are you growing?' },
  acresLabel: { mr: 'एकर', en: 'Acres' },
  villageLabel: { mr: 'गाव / तालुका', en: 'Village / Taluka' },
  districtLabel: { mr: 'जिल्हा', en: 'District' },
  nextBtn: { mr: 'पुढे', en: 'Next' },
  backBtn: { mr: 'मागे', en: 'Back' },
  doneBtn: { mr: 'सुरुवात करूया!', en: "Let's Go!" },
  onboardingSkip: { mr: 'नंतर भरतो', en: 'Fill later' },

  // Onboarding — step titles (6 steps)
  stepPersonal: { mr: 'वैयक्तिक माहिती', en: 'Personal Info' },
  stepLocation: { mr: 'स्थान', en: 'Location' },
  stepFarmLand: { mr: 'शेत व जमीन', en: 'Farm & Land' },
  stepCrop: { mr: 'सध्याचे पीक', en: 'Current Crop' },
  stepSoil: { mr: 'जमीन व सिंचन', en: 'Soil & Irrigation' },
  stepReview: { mr: 'पुनरावलोकन', en: 'Review' },
  nameLabel: { mr: 'पूर्ण नाव', en: 'Full Name' },
  stateLabel: { mr: 'राज्य', en: 'State' },
  cropNameLabel: { mr: 'पिकाचे नाव', en: 'Crop name' },
  varietyLabel: { mr: 'वाण / जात', en: 'Variety' },
  sowingDateLabel: { mr: 'पेरणी दिनांक', en: 'Sowing date' },
  addAnotherCrop: { mr: '+ आणखी एक पीक जोडा', en: '+ Add another crop' },
  removeCrop: { mr: 'काढा', en: 'Remove' },

  // Crop Comparison
  compareCrops: { mr: 'पीक तुलना करा', en: 'Compare Crops' },
  compareCropsHint: {
    mr: 'तुमच्या जमिनीसाठी योग्य पीक निवडण्यास मदत करतो',
    en: 'Helps you choose the right crop for your land',
  },
  selectThisCrop: { mr: 'हे पीक निवडा', en: 'Select this crop' },
  typeManually: { mr: 'स्वतः भरतो', en: "I'll type it" },
  profitRange: { mr: 'नफा अंदाज', en: 'Profit range' },
  waterReq: { mr: 'पाण्याची गरज', en: 'Water req.' },
  duration: { mr: 'कालावधी', en: 'Duration' },
  priceTrend: { mr: 'बाजार कल', en: 'Price trend' },
  trendUp: { mr: '↑ वाढतोय', en: '↑ Rising' },
  trendDown: { mr: '↓ घसरतोय', en: '↓ Falling' },
  trendStable: { mr: '→ स्थिर', en: '→ Stable' },

  // Soil & Irrigation chips
  soilMedium: { mr: 'मध्यम (चिकट)', en: 'Medium (Loamy)' },
  soilLoamy: { mr: 'गाळाची', en: 'Alluvial' },
  soilSandy: { mr: 'वालुकामय', en: 'Sandy' },
  soilClay: { mr: 'चिकण माती', en: 'Clay' },
  irrDrip: { mr: 'ठिबक', en: 'Drip' },
  irrFlood: { mr: 'पूर सिंचन', en: 'Flood' },
  irrSprinkler: { mr: 'तुषार', en: 'Sprinkler' },
  srcBorewell: { mr: 'बोअरवेल', en: 'Borewell' },
  srcCanal: { mr: 'कालवा', en: 'Canal' },
  srcRiver: { mr: 'नदी', en: 'River' },
  srcRainfed: { mr: 'पावसावर अवलंबून', en: 'Rainfed' },

  // Review step
  reviewTitle: { mr: 'सर्व माहिती तपासा', en: 'Review your info' },
  reviewSubtitle: {
    mr: 'सर्व काही बरोबर असल्यास सुरुवात करा',
    en: 'If everything looks correct, get started',
  },
  confirmStart: { mr: 'पूर्ण करा व सुरुवात करा', en: 'Confirm & Get Started' },

  // Account page milestone labels
  milestonePersonal: { mr: 'नाव', en: 'Name' },
  milestoneLocation: { mr: 'स्थान', en: 'Location' },
  milestoneFarm: { mr: 'शेत', en: 'Farm' },
  milestoneCrop: { mr: 'पीक', en: 'Crop' },
  milestoneSoil: { mr: 'जमीन', en: 'Soil' },
  milestoneAll: { mr: 'पूर्ण', en: 'Done' },

  // Today page
  greeting: { mr: 'नमस्कार, रवी 👋', en: 'Hello, Ravi 👋' },
  farmInfo: { mr: '४ एकर · कोपरगाव', en: '4 acres · Kopargaon' },
  todayAction: { mr: 'आजचा सल्ला', en: "Today's Action" },
  listen: { mr: 'ऐका', en: 'Listen' },
  whyThis: { mr: 'हा सल्ला का?', en: 'Why this advice?' },
  next3Days: { mr: 'पुढील ३ दिवस', en: 'Next 3 Days' },
  profitOutlook: { mr: 'नफा अंदाज', en: 'Profit Outlook' },
  marketSnapshot: { mr: 'बाजार भाव', en: 'Market Snapshot' },
  whatIf: { mr: 'जर असे झाले तर?', en: 'What if?' },
  confidenceHigh: { mr: 'उच्च विश्वास', en: 'High confidence' },
  confidenceMedium: { mr: 'मध्यम विश्वास', en: 'Medium confidence' },
  confidenceLow: { mr: 'कमी विश्वास', en: 'Low confidence' },
  lastUpdated: { mr: 'शेवटचे अपडेट', en: 'Last updated' },
  estProfit: { mr: 'अंदाजित नफा', en: 'Estimated profit' },

  // Ask page
  askPlaceholder: { mr: 'तुमचा प्रश्न लिहा किंवा बोला...', en: 'Type or speak your question...' },
  suggestionChips: { mr: 'उदाहरण प्रश्न', en: 'Example questions' },

  // Schemes
  schemesTitle: { mr: 'सरकारी योजना', en: 'Government Schemes' },
  schemesSubtitle: {
    mr: 'तुमच्या शेतासाठी योग्य योजना',
    en: 'Schemes relevant to your farm',
  },
  highRelevance: { mr: 'अत्यंत योग्य', en: 'Highly relevant' },
  mediumRelevance: { mr: 'योग्य', en: 'Relevant' },
  applyNow: { mr: 'अर्ज करा', en: 'Apply now' },
  learnMore: { mr: 'अधिक माहिती', en: 'Learn more' },

  // Account
  accountTitle: { mr: 'माझे खाते', en: 'My Account' },
  profileComplete: { mr: 'प्रोफाइल', en: 'Profile' },
  complete: { mr: 'पूर्ण', en: 'complete' },
  personalInfo: { mr: 'वैयक्तिक माहिती', en: 'Personal Information' },
  location: { mr: 'स्थान', en: 'Location' },
  farmLand: { mr: 'शेत व जमीन', en: 'Farm & Land' },
  currentCrop: { mr: 'सध्याचे पीक', en: 'Current Crop' },
  soilIrrigation: { mr: 'जमीन व सिंचन', en: 'Soil & Irrigation' },
  autoData: { mr: 'स्वयं-प्राप्त माहिती', en: 'Auto-Fetched Data' },
  addMoreInfo: { mr: 'अधिक माहिती जोडा', en: 'Add More Information' },
  settings: { mr: 'सेटिंग्ज', en: 'Settings' },
  language: { mr: 'भाषा', en: 'Language' },
  voiceToggle: { mr: 'आवाज सल्ला', en: 'Voice advice' },
  logout: { mr: 'बाहेर पडा', en: 'Log out' },
  name: { mr: 'नाव', en: 'Name' },
  mobile: { mr: 'मोबाइल', en: 'Mobile' },
  village: { mr: 'गाव', en: 'Village' },
  district: { mr: 'जिल्हा', en: 'District' },
  state: { mr: 'राज्य', en: 'State' },
  crop: { mr: 'पीक', en: 'Crop' },
  variety: { mr: 'वाण', en: 'Variety' },
  sowingDate: { mr: 'पेरणी दिनांक', en: 'Sowing date' },
  area: { mr: 'क्षेत्र', en: 'Area' },
  soil: { mr: 'जमीन', en: 'Soil' },
  irrigation: { mr: 'सिंचन', en: 'Irrigation' },
  waterSource: { mr: 'पाणी स्रोत', en: 'Water source' },
  needs: { mr: 'गरजा', en: 'Needs' },

  // Common
  cancel: { mr: 'रद्द करा', en: 'Cancel' },
  save: { mr: 'जतन करा', en: 'Save' },
} as const;

export type TranslationKey = keyof typeof t;

export function tr(key: TranslationKey, lang: Lang): string {
  return t[key][lang];
}

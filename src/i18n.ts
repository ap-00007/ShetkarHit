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

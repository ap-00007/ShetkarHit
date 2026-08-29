import type {
  Decision,
  ForecastDay,
  ProfitOutlook,
  MarketPrice,
  Scheme,
  ProfileData,
  WhatIfToggle,
  CropCandidate,
} from '@/types';

export const profile: ProfileData = {
  name: 'Ravi Patil',
  mobile: '+91 98765 43210',
  village: 'Kopargaon',
  district: 'Ahmednagar',
  state: 'Maharashtra',
  crops: [
    { name: 'Onion', variety: 'N-53', sowingDate: '2026-07-15' },
  ],
  area: '4 acres',
  soil: 'Medium (Loamy)',
  irrigation: 'Drip',
  waterSource: 'Borewell',
  needs: ['Pest control', 'Market price', 'Irrigation advice'],
  completeness: 60,
};

export const decision: Decision = {
  headline: 'आज पीक बुडवण्याची गरज नाही',
  reason:
    'शेवटच्या ३ दिवसांत १८ मिमी पाऊस झाला आणि आठवड्यात अजून २५ मिमी पावसाची अपेक्षा आहे. जमिनीत ओलावा पुरेसा आहे. अतिरिक्त पाणी दिल्यास बुरशीचा धोका वाढतो.',
  icon: 'droplet',
  urgency: 'safe',
  confidence: 'high',
  updatedAt: 'आज सकाळी ६:३०',
};

export const forecast: ForecastDay[] = [
  {
    day: 'सोम',
    icon: 'cloud-rain',
    temp: '28°/22°',
    rain: '12 मिमी',
    action: 'पाणी देऊ नका',
    urgency: 'safe',
  },
  {
    day: 'मंगळ',
    icon: 'cloud-rain',
    temp: '27°/21°',
    rain: '8 मिमी',
    action: 'पाणी देऊ नका',
    urgency: 'safe',
  },
  {
    day: 'बुध',
    icon: 'cloud',
    temp: '29°/22°',
    rain: '5 मिमी',
    action: 'निरीक्षण करा',
    urgency: 'monitor',
  },
];

export const profitOutlook: ProfitOutlook = {
  status: 'positive',
  estProfit: '₹85,000 - ₹1,10,000',
  note: 'कांदा बाजारात मागणी वाढतेय. डिसेंबरमध्ये दर चांगला राहण्याची शक्यता.',
};

export const marketPrices: MarketPrice[] = [
  { crop: 'कांदा', price: '₹2,400', unit: 'क्विंटल', trend: 'up', change: '+₹200' },
  { crop: 'कापूस', price: '₹7,200', unit: 'क्विंटल', trend: 'stable', change: '—' },
];

export const schemes: Scheme[] = [
  {
    id: 'pmkisan',
    name: 'प्रधानमंत्री किसान सन्मान योजना',
    summary: 'दरवर्षी ₹6,000 थेट बँक खात्यात',
    relevance: 'high',
    detail:
      'सर्व लहान व मर्यादित शेतकऱ्यांना दरवर्षी तीन हप्त्यांमध्ये ₹2,000 प्रति हप्ता दिले जातात. लाभ घेण्यासाठी बँक खात्री आणि आधार लिंक आवश्यक.',
  },
  {
    id: 'crop-insurance',
    name: 'पीक विमा योजना (PMFBY)',
    summary: 'पीक नुकसानीवर संरक्षण',
    relevance: 'high',
    detail:
      'दुष्काळ, पूर, कीड किंवा नैसर्गिक आपत्तीमुळे पीक नुकसान झाल्यास विमा हप्ता देऊन भरपाई मिळते. अर्ज शेअंतर्गत करता येतो.',
  },
  {
    id: 'drip-subsidy',
    name: 'ठिबक सिंचन सबसिडी',
    summary: 'ठिबक संयंत्रावर ५०-९०% अनुदान',
    relevance: 'medium',
    detail:
      'ठिबक अर्विजन संयंत्र बसवण्यासाठी राज्य व केंद्र सरकार अनुदान देतात. तुमच्या बोअरवेल व ४ एकर क्षेत्रासाठी हे उपयुक्त ठरू शकते.',
  },
  {
    id: 'soil-card',
    name: 'मृदा आरोग्य कार्ड',
    summary: 'मोफत मृदा तपासणी',
    relevance: 'medium',
    detail:
      'जमिनीचे पोषक घटक व pH तपासून योग्य खताच्या शिफारशी दिल्या जातात. स्थानिक कृषी कार्यालयात अर्ज करता येतो.',
  },
];

export const whatIfToggles: WhatIfToggle[] = [
  {
    id: 'rain-fails',
    label: 'जर पुढच्या आठवड्यात पाऊस झाला नाही?',
    enabled: false,
    impact: 'पाणी देण्याची गरज उद्यापासून असेल. ठिबकने दररोज २ तास सिंचन करा.',
  },
  {
    id: 'pest-attack',
    label: 'जर कांद्याला थ्रिप्स कीड दिसली?',
    enabled: false,
    impact: 'ताबडतोब नीम तेल स्प्रे करा. तपासणी दर ३ दिवसांनी करा.',
  },
  {
    id: 'price-drop',
    label: 'जर कांदा दर ₹1,500 वर घसरला?',
    enabled: false,
    impact: 'साठवणूक करून फेब्रुवारी पर्यंत विक्री थांबवा. तोटा टाळण्यासाठी हा पर्याय उत्तम.',
  },
];

export const chatSuggestions = [
  'कांद्याचे दर कधी चांगले येतील?',
  'पाने पिवळी पडताय, काय करावे?',
  'ठिबक सिंचनाचे प्रमाण किती?',
  'कोणती खते वापरावी?',
];

export const chatResponses: Record<string, string> = {
  default:
    'तुमच्या शेताच्या माहितीनुसार, आता कांद्याला बुरशीचा धोका कमी आहे. पाणी नियंत्रणात ठेवा आणि दर ५ दिवसांनी पिकाची तपासणी करा.',
  price:
    'कांदा बाजारात सध्या चांगली मागणी आहे. डिसेंबर-जानेवारीमध्ये दर ₹3,000+ होण्याची शक्यता आहे. आता विकल्यास ₹2,400/क्विंटल मिळेल.',
  pest:
    'पाने पिवळी पडण्याचे कारण सल्फरची कमतरत किंवा थ्रिप्स कीड असू शकते. नीम तेल ५ मिली/लिटर पाण्यात मिसळून स्प्रे करा. तसेच २ ग्रॅम सल्फर प्रति लिटर पाणी वापरा.',
  irrigation:
    'ठिबक सिंचनाने दररोज १.५ ते २ तास पाणी द्या. पावसाच्या दिवसांत पाणी थांबवा. जमिनीचा ओलावा तपासूनच पाणी द्या.',
  fertilizer:
    'कांद्यासाठी बेसल डोस: ५० किलो युरिया + १०० किलो एसएसपी + २५ किलो एमओपी प्रति एकर. बुडवणी अवस्थेत २५ किलो युरिया टॉप ड्रेसिंग करा.',
};

/** Candidate crops shown in the Crop Comparison panel */
export const cropCandidates: CropCandidate[] = [
  {
    id: 'onion',
    emoji: '🧅',
    nameMr: 'कांदा',
    nameEn: 'Onion',
    profitRange: '₹60,000–₹1,10,000 / एकर',
    waterReq: 'मध्यम (350–550 मिमी)',
    duration: '90–120 दिवस',
    priceTrend: 'up',
    priceNote: 'डिसेंबरमध्ये दर वाढतो',
  },
  {
    id: 'cotton',
    emoji: '🌿',
    nameMr: 'कापूस',
    nameEn: 'Cotton',
    profitRange: '₹40,000–₹75,000 / एकर',
    waterReq: 'मध्यम (700–1000 मिमी)',
    duration: '150–180 दिवस',
    priceTrend: 'stable',
    priceNote: 'दर स्थिर आहेत',
  },
  {
    id: 'soybean',
    emoji: '🫘',
    nameMr: 'सोयाबीन',
    nameEn: 'Soybean',
    profitRange: '₹30,000–₹55,000 / एकर',
    waterReq: 'कमी (450–700 मिमी)',
    duration: '90–110 दिवस',
    priceTrend: 'up',
    priceNote: 'निर्यात मागणी जास्त',
  },
  {
    id: 'tomato',
    emoji: '🍅',
    nameMr: 'टोमॅटो',
    nameEn: 'Tomato',
    profitRange: '₹80,000–₹2,00,000 / एकर',
    waterReq: 'जास्त (600–1200 मिमी)',
    duration: '60–90 दिवस',
    priceTrend: 'up',
    priceNote: 'उच्च नफा, जास्त काळजी लागते',
  },
  {
    id: 'wheat',
    emoji: '🌾',
    nameMr: 'गहू',
    nameEn: 'Wheat',
    profitRange: '₹20,000–₹40,000 / एकर',
    waterReq: 'मध्यम (450–650 मिमी)',
    duration: '110–130 दिवस',
    priceTrend: 'stable',
    priceNote: 'हमी भाव उपलब्ध',
  },
];

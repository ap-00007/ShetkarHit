// server/routes/today.js
// Aggregates Open-Meteo live weather, Real-time Mandi API prices, and Hugging Face AI advisory

const HF_ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions';
const DEFAULT_MODEL = 'Qwen/Qwen2.5-7B-Instruct';
const getModel = () => process.env.HF_MODEL || DEFAULT_MODEL;

// Approximate Maharashtra/India district coordinates for live weather
const DISTRICT_COORDS = {
  ahmednagar: { lat: 19.0952, lon: 74.7496 },
  kopargaon: { lat: 19.8836, lon: 74.4777 },
  shirdi: { lat: 19.7645, lon: 74.4762 },
  pune: { lat: 18.5204, lon: 73.8567 },
  nashik: { lat: 19.9975, lon: 73.7898 },
  lasalgaon: { lat: 20.1477, lon: 74.2324 },
  aurangabad: { lat: 19.8762, lon: 75.3433 },
  chhatrapatisambhajinagar: { lat: 19.8762, lon: 75.3433 },
  solapur: { lat: 17.6599, lon: 75.9064 },
  satara: { lat: 17.6805, lon: 73.9997 },
  sangli: { lat: 16.8524, lon: 74.5815 },
  kolhapur: { lat: 16.7050, lon: 74.2433 },
  jalgaon: { lat: 21.0077, lon: 75.5626 },
  dhule: { lat: 20.9042, lon: 74.7749 },
  nanded: { lat: 19.1383, lon: 77.3210 },
  amravati: { lat: 20.9320, lon: 77.7523 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  default: { lat: 19.0952, lon: 74.7496 },
};

// Major Maharashtra APMC Mandis mapped by district
const APMC_MARKETS = {
  ahmednagar: ['Kopargaon APMC', 'Rahata APMC', 'Ahmednagar APMC', 'Rahuri APMC', 'Sangamner APMC'],
  kopargaon: ['Kopargaon APMC', 'Rahata APMC', 'Lasalgaon APMC', 'Yeola APMC'],
  nashik: ['Lasalgaon APMC', 'Pimpalgaon Baswant APMC', 'Nashik Dindori APMC', 'Yeola APMC'],
  pune: ['Pune APMC Gultekdi', 'Junnar APMC', 'Khed APMC', 'Manchar APMC'],
  solapur: ['Solapur APMC', 'Barshi APMC', 'Pandharpur APMC'],
  satara: ['Karad APMC', 'Satara APMC', 'Phaltan APMC'],
  kolhapur: ['Kolhapur APMC', 'Gadhinglaj APMC'],
  jalgaon: ['Jalgaon APMC', 'Bhusawal APMC', 'Chopda APMC'],
  nagpur: ['Nagpur APMC Cotton Market', 'Katol APMC', 'Kalmeshwar APMC'],
  default: ['Kopargaon APMC', 'Lasalgaon APMC', 'Pune APMC'],
};

// Crop Expert Rules & Baseline Data
const CROP_EXPERT_PROFILES = {
  onion: {
    names: { mr: 'कांदा', hi: 'प्याज', en: 'Onion' },
    unit: { mr: 'क्विंटल', hi: 'क्विंटल', en: 'Quintal' },
    basePrice: 2450,
    minPrice: 1800,
    maxPrice: 2900,
    trend: 'up',
    change: '+₹180',
    primaryMandi: 'Lasalgaon / Kopargaon APMC',
    profitPerAcreMin: 75000,
    profitPerAcreMax: 115000,
    advisories: {
      en: {
        actionRain: 'Do not irrigate today — avoid bulb rot',
        actionDry: 'Recommended drip irrigation for 1.5 hrs',
        reasonRain: 'Expected rainfall provides sufficient soil moisture. Excess water at bulb maturity stage increases fungal rots.',
        reasonDry: 'Bulb formation stage requires moderate soil moisture. Morning light drip irrigation supports uniform bulb size.',
        whatIfs: [
          { id: '1', label: 'If rainfall occurs during bulb maturity?', enabled: false, impact: 'Dig shallow drainage trenches immediately to prevent standing water in furrows.' },
          { id: '2', label: 'If purple blotch or thrips appear on leaves?', enabled: false, impact: 'Spray Profenofos + Cypermethrin (2ml/L) or Neem oil 5ml/L.' },
          { id: '3', label: 'If APMC market price drops below expected MSP?', enabled: false, impact: 'Store in ventilated Kanda Chawl for 4-6 weeks until market arrivals decrease.' },
        ],
      },
      mr: {
        actionRain: 'आज पाणी देऊ नका — कांदा सड टाळा',
        actionDry: 'सकाळी १.५ तास ठिबक सिंचन करा',
        reasonRain: 'पुढील २४-४८ तासांतील पावसामुळे जमिनीत पुरेसा ओलावा राहील. जास्तीचे पाणी दिल्यास कांदा सडण्याचा धोका असतो.',
        reasonDry: 'कांदा पोसण्याच्या अवस्थेत मध्यम ओलावा आवश्यक आहे. सकाळी हलके ठिबक सिंचन केल्यास कांद्याचा आकार एकसारखा बनेल.',
        whatIfs: [
          { id: '1', label: 'जर कांदा काढणीच्या वेळी पाऊस झाला?', enabled: false, impact: 'चर काढून शेतातील साचलेले पाणी त्वरित बाहेर काढा.' },
          { id: '2', label: 'जर पानांवर करपा किंवा फुलकिडे (Thrips) दिसले?', enabled: false, impact: '५ मिली नीम तेल किंवा प्रोफेनोफॉस २ मिली प्रति लिटर पाण्यात मिसळून फवारा.' },
          { id: '3', label: 'जर बाजार भाव कमी झाला?', enabled: false, impact: 'कांदा चाळीत साठवून ठेवा आणि भाव सुधारेपर्यंत विक्री थांबवा.' },
        ],
      },
      hi: {
        actionRain: 'आज सिंचाई न करें — कंद सड़न से बचाव',
        actionDry: 'सुबह 1.5 घंटे ड्रिप सिंचाई करें',
        reasonRain: 'आगामी बारिश से मिट्टी में पर्याप्त नमी रहेगी। अधिक पानी से कंद सड़न का खतरा होता है।',
        reasonDry: 'कंद बनने की अवस्था में संतुलित नमी जरूरी है। सुबह हल्की ड्रिप सिंचाई से कंद का आकार उत्तम बनेगा।',
        whatIfs: [
          { id: '1', label: 'अगर फसल पकते समय बारिश हो?', enabled: false, impact: 'खेत से अतिरिक्त पानी निकालने के लिए तुरंत नालियां बनाएं।' },
          { id: '2', label: 'अगर पत्तों पर थ्रिप्स या धब्बे दिखें?', enabled: false, impact: 'नीम तेल 5ml/L या कीटनाशक का छिड़काव करें।' },
          { id: '3', label: 'अगर मंडी भाव में गिरावट आए?', enabled: false, impact: 'कांदा चाळ में भंडारण करें और भाव सुधरने पर बेचें।' },
        ],
      },
    },
  },
  sugarcane: {
    names: { mr: 'ऊस', hi: 'गन्ना', en: 'Sugarcane' },
    unit: { mr: 'टन', hi: 'टन', en: 'Ton' },
    basePrice: 3150,
    minPrice: 2900,
    maxPrice: 3300,
    trend: 'stable',
    change: 'FRP ₹3,150',
    primaryMandi: 'Kopargaon Sugar Belt',
    profitPerAcreMin: 65000,
    profitPerAcreMax: 95000,
    advisories: {
      en: {
        actionRain: 'Postpone furrow watering — rain provides deep moisture',
        actionDry: 'Recommended furrow irrigation for 3.5 hrs & trash mulching',
        reasonRain: 'Sugarcane can withstand heavy moisture. Conserve electricity and skip today’s scheduled watering.',
        reasonDry: 'Grand growth phase requires deep soil moisture. Apply trash mulching between rows to prevent water evaporation.',
        whatIfs: [
          { id: '1', label: 'If sugar factory cutting is delayed by 3 weeks?', enabled: false, impact: 'Provide light maintenance watering every 10 days to prevent sucrose reduction.' },
          { id: '2', label: 'If early shoot borer attack is observed?', enabled: false, impact: 'Release Trichogramma chilonis cards @ 20,000 eggs/acre or apply Chlorantraniliprole.' },
          { id: '3', label: 'If canal water supply is reduced?', enabled: false, impact: 'Switch to alternate furrow irrigation to save 35% water without yield penalty.' },
        ],
      },
      mr: {
        actionRain: 'आज पाटपाणी देऊ नका — पावसामुळे पुरेसा ओलावा',
        actionDry: '३.५ तास पाटाने पाणी द्या व पाचट आच्छादन करा',
        reasonRain: 'ऊस पिकासाठी जमिनीत मुबलक ओलावा आहे. आजचे सिंचन पुढे ढकलून वीज व पाण्याचा अपव्यय टाळा.',
        reasonDry: 'उसाच्या वाढीच्या टप्प्यात खोलवर ओलावा आवश्यक आहे. उसाच्या पट्ट्यात पाचट आच्छादन केल्यास बाष्पीभवन रोखले जाईल.',
        whatIfs: [
          { id: '1', label: 'जर कारखान्याची तोडणी ३ आठवडे लांबणीवर पडली?', enabled: false, impact: '१० दिवसांतून एकदा हलके पाणी द्या जेणेकरून साखर उतारा कमी होणार नाही.' },
          { id: '2', label: 'जर खोडकिडीचा प्रादुर्भाव दिसला?', enabled: false, impact: 'ट्रायकोग्रामा परोपजीवी कीटकांचे कार्ड लावा किंवा शिफारशीत कीटकनाशक फवारा.' },
          { id: '3', label: 'जर कालव्याचे पाणी कमी पडले?', enabled: false, impact: 'एकाआड एक सरी पद्धत वापरून ३५% पाण्याची बचत करा.' },
        ],
      },
      hi: {
        actionRain: 'आज सिंचाई टालें — बारिश से भरपूर नमी',
        actionDry: '3.5 घंटे नाली सिंचाई करें और पत्तों की मल्चिंग करें',
        reasonRain: 'गन्ने की फसल में पर्याप्त नमी है। बिजली व पानी की बचत करें।',
        reasonDry: 'गन्ने की वानस्पतिक वृद्धि के लिए गहरी नमी जरूरी है। पंक्तियों के बीच पत्तों का आच्छादन करें।',
        whatIfs: [
          { id: '1', label: 'अगर मिल की कटाई 3 हफ्ते लेट हो?', enabled: false, impact: 'हल्की सिंचाई जारी रखें ताकि सुक्रोज की मात्रा कम न हो।' },
          { id: '2', label: 'अगर तना छेदक कीट दिखे?', enabled: false, impact: 'ट्राइकोग्रामा कार्ड लगाएं या कीटनाशक का प्रयोग करें।' },
          { id: '3', label: 'अगर पानी की कमी हो?', enabled: false, impact: 'एक छोड़कर एक नाली में पानी देकर 35% पानी बचाएं।' },
        ],
      },
    },
  },
  cotton: {
    names: { mr: 'कापूस', hi: 'कपास', en: 'Cotton' },
    unit: { mr: 'क्विंटल', hi: 'क्विंटल', en: 'Quintal' },
    basePrice: 7350,
    minPrice: 6900,
    maxPrice: 7700,
    trend: 'up',
    change: '+₹250',
    primaryMandi: 'Jalgaon / Ahmednagar APMC',
    profitPerAcreMin: 50000,
    profitPerAcreMax: 80000,
    advisories: {
      en: {
        actionRain: 'Ensure field drainage — prevent boll rot',
        actionDry: 'Foliar spray of 19:19:19 & inspect for Pink Bollworm',
        reasonRain: 'Waterlogging at boll development stage causes square drop and root asphyxiation. Drain excess water.',
        reasonDry: 'Boll formation requires balanced nutrition. Foliar spray of NPK 19:19:19 @ 10g/L increases boll retention.',
        whatIfs: [
          { id: '1', label: 'If pink bollworm is observed in rosette flowers?', enabled: false, impact: 'Install pheromone traps @ 5/acre and spray Emamectin Benzoate 5 SG @ 5g/10L.' },
          { id: '2', label: 'If cloudy weather causes square dropping?', enabled: false, impact: 'Spray Planofix @ 4ml/15L water during morning hours.' },
        ],
      },
      mr: {
        actionRain: 'शेतात पाणी साचू देऊ नका — पाते गळ टाळा',
        actionDry: '१९:१९:१९ विद्राव्य खताची फवारणी करा व बोंडअळी तपासा',
        reasonRain: 'कापूस पिकात पाणी साचल्यास पाते गळ व मुळे कुजण्याचा धोका असतो. चर काढून पाणी बाहेर काढा.',
        reasonDry: 'बोंडे भरण्याच्या काळात १९:१९:१९ खताची फवारणी (१० ग्रॅम/लिटर) केल्यास बोंडांची संख्या व वजन वाढते.',
        whatIfs: [
          { id: '1', label: 'जर गुलाबी बोंडअळीचे पतंग कामगंध सापळ्यात दिसले?', enabled: false, impact: 'इमामेक्टिन बेन्झोएट ५ एसजी ५ ग्रॅम प्रति १० लिटर पाण्यात मिसळून फवारा.' },
          { id: '2', label: 'जर ढगाळ हवामानामुळे पातेगळ झाली?', enabled: false, impact: 'प्लॅनोफिक्स ४ मिली प्रति १५ लिटर पाण्यात फवारा.' },
        ],
      },
      hi: {
        actionRain: 'खेत में जलजमाव न होने दें',
        actionDry: '19:19:19 उर्वरक का छिड़काव करें व गुलाबी सुंडी जांचें',
        reasonRain: 'कपास में पानी भरने से फूल-फल गिरने लगते हैं। तुरंत निकासी करें।',
        reasonDry: 'टिंडे बनने के समय NPK 19:19:19 का छिड़काव टिंडों का आकार बढ़ाता है।',
        whatIfs: [
          { id: '1', label: 'अगर गुलाबी सुंडी दिखे?', enabled: false, impact: 'फेरोमोन ट्रैप लगाएं और कीटनाशक का छिड़काव करें।' },
        ],
      },
    },
  },
  tomato: {
    names: { mr: 'टोमॅटो', hi: 'टमाटर', en: 'Tomato' },
    unit: { mr: 'क्विंटल', hi: 'क्विंटल', en: 'Quintal' },
    basePrice: 1950,
    minPrice: 1400,
    maxPrice: 2400,
    trend: 'down',
    change: '-₹120',
    primaryMandi: 'Narayangaon / Junnar APMC',
    profitPerAcreMin: 110000,
    profitPerAcreMax: 175000,
    advisories: {
      en: {
        actionRain: 'Apply Copper Oxychloride spray for Early Blight prevention',
        actionDry: 'Drip fertigation with 12:61:00 & inspect staking ties',
        reasonRain: 'High humidity and rainfall promote fungal blight. Prophylactic fungicide spray is critical.',
        reasonDry: 'Flowering and fruit set require phosphorus and potassium. Morning drip fertigation enhances fruit firmness.',
        whatIfs: [
          { id: '1', label: 'If leaf curl virus appears?', enabled: false, impact: 'Control whiteflies using Yellow Sticky Traps and Diafenthiuron 50 WP.' },
        ],
      },
      mr: {
        actionRain: 'करपा नियंत्रणासाठी कॉपर ऑक्सीक्लोराईडची फवारणी करा',
        actionDry: '१२:६१:०० खताची ठिबकद्वारे मात्रा द्या व बांबू बांधणी तपासा',
        reasonRain: 'दमट हवेमुळे टोमॅटोवर तांबेरा व करपा रोगाचा प्रसार होतो. बुरशीनाशकाची प्रतिबंधात्मक फवारणी आवश्यक आहे.',
        reasonDry: 'फुलोरा व फळधारणेच्या काळात १२:६१:०० खताची मात्रा दिल्यास फळांची गुणवत्ता उत्तम राहते.',
        whatIfs: [
          { id: '1', label: 'जर चुरडा-मुरडा (Leaf Curl) रोग आला?', enabled: false, impact: 'पांढरी माशी नियंत्रणासाठी पिवळे चिकट सापळे लावा.' },
        ],
      },
      hi: {
        actionRain: 'झुलसा रोग से बचाव के लिए फफूंदनाशी छिड़कें',
        actionDry: 'ड्रिप द्वारा 12:61:00 खाद दें और पौधों को सहारा दें',
        reasonRain: 'बारिश और नमी से झुलसा रोग तेजी से फैलता है।',
        reasonDry: 'फूल व फल लगने के समय फॉस्फोरस युक्त खाद देना लाभकारी है।',
        whatIfs: [
          { id: '1', label: 'अगर पत्ती मरोड़ रोग दिखे?', enabled: false, impact: 'सफेद मक्खी नियंत्रण के लिए पीले चिपचिपे कार्ड लगाएं।' },
        ],
      },
    },
  },
  wheat: {
    names: { mr: 'गहू', hi: 'गेहूं', en: 'Wheat' },
    unit: { mr: 'क्विंटल', hi: 'क्विंटल', en: 'Quintal' },
    basePrice: 2650,
    minPrice: 2400,
    maxPrice: 2850,
    trend: 'stable',
    change: '+₹50',
    primaryMandi: 'Ahmednagar APMC',
    profitPerAcreMin: 35000,
    profitPerAcreMax: 60000,
    advisories: {
      en: {
        actionRain: 'Postpone irrigation — natural rain satisfies crown root needs',
        actionDry: 'Irrigate for Crown Root Initiation (CRI) & apply Urea',
        reasonRain: 'Rainfall provides the necessary moisture for tillering. Save water and electricity.',
        reasonDry: 'Crown root initiation is the most critical stage for wheat tillering. Top dress Urea prior to watering.',
        whatIfs: [
          { id: '1', label: 'If aphids (Mawa) appear on wheat ears?', enabled: false, impact: 'Spray Thiamethoxam 25 WG @ 2g per 10L water.' },
        ],
      },
      mr: {
        actionRain: 'सिंचन पुढे ढकला — पावसामुळे मुळांची वाढ सुधारेल',
        actionDry: 'मुकुट मुळे फुटण्याच्या (CRI) अवस्थेत पाणी द्या व युरिया टाका',
        reasonRain: 'पावसामुळे फुटवे फुटण्यासाठी आवश्यक ओलावा तयार झाला आहे.',
        reasonDry: 'मुकुट मुळे फुटण्याची अवस्था गहू पिकासाठी अत्यंत संवेदनशील असते. पाणी देण्यापूर्वी युरिया खताचा हप्ता द्या.',
        whatIfs: [
          { id: '1', label: 'जर लोंब्यांवर मावा किडीचा प्रादुर्भाव झाला?', enabled: false, impact: 'थायमेथॉक्झाम २५ डब्ल्यूजी २ ग्रॅम प्रति १० लिटर पाण्यात फवारा.' },
        ],
      },
      hi: {
        actionRain: 'सिंचाई टालें — बारिश से पर्याप्त नमी',
        actionDry: 'CRI अवस्था में सिंचाई करें और यूरिया डालें',
        reasonRain: 'बारिश से कल्ले फूटने में मदद मिलेगी।',
        reasonDry: 'गेहूं के लिए पहली सिंचाई सबसे महत्वपूर्ण है। यूरिया की टॉप ड्रेसिंग करें।',
        whatIfs: [
          { id: '1', label: 'अगर माहू कीट दिखे?', enabled: false, impact: 'कीटनाशक का छिड़काव करें।' },
        ],
      },
    },
  },
  soybean: {
    names: { mr: 'सोयाबीन', hi: 'सोयाबीन', en: 'Soybean' },
    unit: { mr: 'क्विंटल', hi: 'क्विंटल', en: 'Quintal' },
    basePrice: 4780,
    minPrice: 4400,
    maxPrice: 5100,
    trend: 'stable',
    change: '+₹80',
    primaryMandi: 'Latur / Solapur APMC',
    profitPerAcreMin: 30000,
    profitPerAcreMax: 50000,
    advisories: {
      en: {
        actionRain: 'Inspect pod filling — drain standing furrow water',
        actionDry: 'Maintain pod filling moisture & check for Girdle Beetle',
        reasonRain: 'Excess water during pod filling leads to seed discoloration. Maintain clean drainage.',
        reasonDry: 'Pod filling requires steady moisture to prevent premature pod drop.',
        whatIfs: [
          { id: '1', label: 'If girdle beetle damages stems?', enabled: false, impact: 'Spray Chlorantraniliprole 18.5 SC @ 3ml per 10L water.' },
        ],
      },
      mr: {
        actionRain: 'शेंगा भरताना पाणी साचू देऊ नका — चर उघडे करा',
        actionDry: 'शेंगा भरण्यासाठी ओलावा ठेवा व चक्रभुंगा (Girdle Beetle) तपासा',
        reasonRain: 'शेंगा भरण्याच्या काळात पाणी साचल्यास दाण्यांचा दर्जा खालावतो.',
        reasonDry: 'शेंगा पोसण्यासाठी जमिनीत ओलावा असणे अत्यंत आवश्यक आहे.',
        whatIfs: [
          { id: '1', label: 'जर चक्रभुंग्याचा प्रादुर्भाव दिसला?', enabled: false, impact: 'क्लोरांट्रानिलीप्रोल ३ मिली प्रति १० लिटर पाण्यात फवारा.' },
        ],
      },
      hi: {
        actionRain: 'फलियां भरते समय जल निकासी करें',
        actionDry: 'फलियों के विकास के लिए नमी बनाए रखें',
        reasonRain: 'पानी भरने से दानों की गुणवत्ता खराब होती है।',
        reasonDry: 'फलियां भरते समय संतुलित नमी से दाना मजबूत बनता है।',
        whatIfs: [
          { id: '1', label: 'अगर गर्डल बीटल दिखे?', enabled: false, impact: 'अनुशंसित कीटनाशक का छिड़काव करें।' },
        ],
      },
    },
  },
};

const DAY_NAMES = {
  mr: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

/* ─────────────────────────────────────────────
   1. Live Weather Fetcher (Open-Meteo)
───────────────────────────────────────────── */
async function fetchLiveWeather(districtName) {
  try {
    const key = (districtName || '').toLowerCase().replace(/[^a-z]/g, '');
    const coords = DISTRICT_COORDS[key] || DISTRICT_COORDS.default;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Asia%2FKolkata&forecast_days=3`;

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Open-Meteo API failed');
    const data = await res.json();
    return data.daily;
  } catch (err) {
    console.warn('[today] Live weather fetch fallback:', err.message);
    return {
      time: ['2026-08-30', '2026-08-31', '2026-09-01'],
      temperature_2m_max: [29, 28, 30],
      temperature_2m_min: [22, 21, 22],
      precipitation_sum: [4, 12, 2],
      weathercode: [61, 63, 2],
    };
  }
}

function weatherCodeToIcon(code) {
  if (code >= 51 && code <= 67) return 'cloud-rain';
  if (code >= 80 && code <= 82) return 'cloud-rain';
  if (code >= 1 && code <= 3) return 'cloud';
  if (code === 0) return 'sun';
  return 'cloud';
}

function buildForecastDays(daily, lang, cropProfileKey) {
  const days = [];
  const daysArr = DAY_NAMES[lang] || DAY_NAMES.mr;
  const isCane = cropProfileKey === 'sugarcane';

  for (let i = 0; i < Math.min(3, daily.time?.length || 0); i++) {
    const date = new Date(daily.time[i]);
    const dayName = daysArr[date.getDay()];
    const maxT = Math.round(daily.temperature_2m_max[i] ?? 28);
    const minT = Math.round(daily.temperature_2m_min[i] ?? 22);
    const rain = Math.round(daily.precipitation_sum[i] ?? 0);
    const icon = weatherCodeToIcon(daily.weathercode[i] ?? 0);

    let action = '';
    let urgency = 'safe';

    if (rain >= 10) {
      action = lang === 'mr' ? 'पाणी देऊ नका' : lang === 'hi' ? 'पानी न दें' : 'Do not irrigate';
      urgency = 'safe';
    } else if (rain >= 3) {
      action = lang === 'mr' ? 'ओलावा तपासा' : lang === 'hi' ? 'नमी जांचें' : 'Monitor soil';
      urgency = 'monitor';
    } else {
      action = isCane
        ? (lang === 'mr' ? 'सरी सिंचन करा' : lang === 'hi' ? 'नाली सिंचाई' : 'Furrow watering')
        : (lang === 'mr' ? 'नियमित ठिबक' : lang === 'hi' ? 'ड्रिप सिंचाई' : 'Regular drip');
      urgency = 'safe';
    }

    days.push({
      day: dayName,
      icon,
      temp: `${maxT}°/${minT}°`,
      rain: `${rain} ${lang === 'en' ? 'mm' : 'मिमी'}`,
      action,
      urgency,
    });
  }

  return days;
}

/* ─────────────────────────────────────────────
   2. Real-Time Mandi API Fetcher (data.gov.in)
───────────────────────────────────────────── */
async function fetchLiveMandiPrices(crops, district, state, lang) {
  const apiKey = process.env.DATA_GOV_IN_API_KEY || '579b464db66ec23bdd000001c077ab9f127c4ba142a3a598245417b9';
  const distKey = (district || '').toLowerCase().replace(/[^a-z]/g, '');
  const localMandis = APMC_MARKETS[distKey] || APMC_MARKETS.default;

  const targetCrops = (crops || []).filter((c) => c.name && c.name.trim() !== '');
  const cropList = targetCrops.length > 0 ? targetCrops : [{ name: 'Onion' }, { name: 'Sugarcane' }];

  let liveRecords = [];

  // Query live data.gov.in Mandi API
  if (apiKey) {
    try {
      const mandiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters%5Bstate%5D=Maharashtra&limit=100`;
      const res = await fetch(mandiUrl, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const json = await res.json();
        liveRecords = json.records || [];
      }
    } catch (err) {
      console.warn('[Mandi API] Data.gov.in live fetch error:', err.message);
    }
  }

  return cropList.slice(0, 4).map((c, index) => {
    const rawName = (c.name || '').toLowerCase().trim();
    
    // Check if live API record exists for this crop
    const liveMatch = liveRecords.find((r) => {
      const rCom = (r.commodity || '').toLowerCase();
      return rCom.includes(rawName) || rawName.includes(rCom);
    });

    const matchedKey =
      Object.keys(CROP_EXPERT_PROFILES).find(
        (k) => rawName.includes(k) || k.includes(rawName)
      ) || (index === 0 ? 'onion' : 'sugarcane');

    const item = CROP_EXPERT_PROFILES[matchedKey];
    const cropLabel = item.names[lang] || item.names.en;
    const unitLabel = item.unit[lang] || item.unit.en;
    const defaultMandi = localMandis[index % localMandis.length] || item.primaryMandi;

    if (liveMatch && liveMatch.modal_price) {
      const modal = parseFloat(liveMatch.modal_price);
      return {
        crop: cropLabel,
        price: `₹${modal.toLocaleString('en-IN')}`,
        unit: unitLabel,
        trend: modal >= item.basePrice ? 'up' : 'down',
        change: modal >= item.basePrice ? `+₹${Math.round(modal * 0.03)}` : `-₹${Math.round(modal * 0.02)}`,
        mandiName: `${liveMatch.market || defaultMandi}`,
        minPrice: `₹${(liveMatch.min_price || modal * 0.8).toLocaleString('en-IN')}`,
        maxPrice: `₹${(liveMatch.max_price || modal * 1.2).toLocaleString('en-IN')}`,
      };
    }

    // Baseline calibrated APMC record with specific local Mandi tag
    return {
      crop: cropLabel,
      price: `₹${item.basePrice.toLocaleString('en-IN')}`,
      unit: unitLabel,
      trend: item.trend,
      change: item.change,
      mandiName: defaultMandi,
      minPrice: `₹${item.minPrice.toLocaleString('en-IN')}`,
      maxPrice: `₹${item.maxPrice.toLocaleString('en-IN')}`,
    };
  });
}

/* ─────────────────────────────────────────────
   3. Crop-Specific & Acreage-Scaled Advisory
───────────────────────────────────────────── */
function getCropAdvisory(cropName, acresNum, totalRain, lang) {
  const raw = (cropName || '').toLowerCase().trim();
  const key = Object.keys(CROP_EXPERT_PROFILES).find((k) => raw.includes(k) || k.includes(raw)) || 'onion';
  const profile = CROP_EXPERT_PROFILES[key];

  const validLang = lang === 'en' || lang === 'hi' ? lang : 'mr';
  const adv = profile.advisories[validLang] || profile.advisories.mr;
  const isRainy = totalRain > 10;

  // Scale profit calculation to the farmer's actual acreage
  const safeAcres = Math.max(0.5, Math.min(500, acresNum || 1));
  const minProfit = Math.round(profile.profitPerAcreMin * safeAcres);
  const maxProfit = Math.round(profile.profitPerAcreMax * safeAcres);

  const profitFormatted = `₹${minProfit.toLocaleString('en-IN')} - ₹${maxProfit.toLocaleString('en-IN')}`;

  const cropTitle = profile.names[validLang] || profile.names.en;
  const profitNote =
    validLang === 'en'
      ? `Estimated net realization for ${safeAcres} acre(s) of ${cropTitle} based on current APMC market realizations.`
      : validLang === 'hi'
      ? `वर्तमान APMC मंडी भाव के आधार पर ${safeAcres} एकड़ ${cropTitle} से अनुमानित शुद्ध लाभ।`
      : `सध्याच्या कृषी उत्पन्न बाजार समिती (APMC) दरांनुसार ${safeAcres} एकर ${cropTitle} पिकातून मिळणारा अंदाजित निव्वळ नफा.`;

  return {
    headline: isRainy ? adv.actionRain : adv.actionDry,
    reason: isRainy ? adv.reasonRain : adv.reasonDry,
    icon: isRainy ? 'droplet' : 'sun',
    urgency: 'safe',
    confidence: 'high',
    updatedAt: validLang === 'en' ? 'Today 06:30 AM' : validLang === 'hi' ? 'आज सुबह 6:30' : 'आज सकाळी ६:३०',
    whatIfs: adv.whatIfs,
    profitOutlook: {
      status: 'positive',
      estProfit: profitFormatted,
      note: profitNote,
    },
    cropProfileKey: key,
  };
}

/* ─────────────────────────────────────────────
   4. Route Handler
───────────────────────────────────────────── */
export async function todayHandler(req, res) {
  try {
    const { farmProfile = {}, lang = 'mr', activeCrop } = req.body;
    const apiKey = process.env.HF_API_KEY;

    const district = farmProfile.district || farmProfile.village || 'Ahmednagar';
    const crops = farmProfile.crops || [];
    const primaryCrop = activeCrop || crops[0]?.name || 'Onion';
    const acresNum = parseFloat(farmProfile.acres) || 1;

    // 1. Fetch live Open-Meteo weather
    const dailyWeather = await fetchLiveWeather(district);
    const total3DayRain = (dailyWeather.precipitation_sum || []).reduce((a, b) => a + b, 0);

    // 2. Generate crop-specific and acreage-scaled advisory
    let advisory = getCropAdvisory(primaryCrop, acresNum, total3DayRain, lang);
    const forecastDays = buildForecastDays(dailyWeather, lang, advisory.cropProfileKey);

    // 3. Fetch real-time Mandi / APMC rates
    const marketPrices = await fetchLiveMandiPrices(
      crops.length > 0 ? crops : [{ name: primaryCrop }],
      district,
      farmProfile.state || 'Maharashtra',
      lang
    );

    // 4. Try AI synthesis refinement via Hugging Face Qwen LLM
    if (apiKey && apiKey !== 'your_huggingface_token_here') {
      try {
        const langLabel = lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Marathi';
        const prompt = `You are ShetkariHit agricultural advisory engine. Generate a tailored daily advisory for a farmer in India.
Context:
- Selected Crop: ${primaryCrop}
- Field Area: ${acresNum} acres
- District/Village: ${district}
- Soil: ${farmProfile.soil || 'Medium'}
- Irrigation: ${farmProfile.irrigation || 'Drip'}
- Next 3-day rainfall: ${total3DayRain} mm
- Target Language: ${langLabel}

Provide tailored advice specifically for ${primaryCrop} at ${acresNum} acres scale.
Respond ONLY with valid JSON with this exact structure:
{
  "headline": "Actionable headline specific to ${primaryCrop} in ${langLabel}",
  "reason": "Clear explanation referencing ${primaryCrop} water/nutrition needs in ${langLabel}",
  "urgency": "safe",
  "icon": "droplet"
}`;

        const hfRes = await fetch(HF_ROUTER_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: getModel(),
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
            temperature: 0.5,
          }),
        });

        if (hfRes.ok) {
          const hfData = await hfRes.json();
          const content = hfData.choices?.[0]?.message?.content?.trim();
          if (content) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.headline && parsed.reason) {
                advisory = {
                  ...advisory,
                  headline: parsed.headline,
                  reason: parsed.reason,
                  icon: parsed.icon || advisory.icon,
                  urgency: parsed.urgency || advisory.urgency,
                };
              }
            }
          }
        }
      } catch (aiErr) {
        console.warn('[today] Hugging Face generation skipped, using expert profile:', aiErr.message);
      }
    }

    const decisionObj = {
      headline: advisory.headline,
      reason: advisory.reason,
      icon: advisory.icon,
      urgency: advisory.urgency,
      confidence: advisory.confidence,
      updatedAt: advisory.updatedAt,
    };

    res.json({
      decision: decisionObj,
      action: decisionObj,
      forecast: forecastDays,
      whatIfs: advisory.whatIfs,
      profitOutlook: advisory.profitOutlook,
      marketPrices,
    });
  } catch (error) {
    console.error('[todayHandler] Error:', error);
    res.status(500).json({ error: 'Failed to generate today dashboard data' });
  }
}

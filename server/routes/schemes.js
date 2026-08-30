// server/routes/schemes.js
// Indian Central and Maharashtra State agricultural schemes catalog with personalized eligibility engine

const SCHEMES_DATABASE = [
  {
    id: 'pmkisan',
    name: {
      mr: 'प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)',
      hi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
      en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    },
    summary: {
      mr: 'दरवर्षी ₹6,000 थेट बँक खात्यात (३ हप्त्यांमध्ये)',
      hi: 'प्रति वर्ष ₹6,000 सीधे बैंक खाते में (3 किश्तों में)',
      en: 'Direct income support of ₹6,000 per year in 3 installments',
    },
    detail: {
      mr: 'सर्व पात्र जमीनधारक शेतकरी कुटुंबांना दर ४ महिन्यांनी ₹2,000 थेट DBT द्वारे मिळतात. आधार कार्ड आणि ई-केवायसी (e-KYC) आवश्यक आहे.',
      hi: 'सभी पात्र किसान परिवारों को हर 4 महीने में ₹2,000 की वित्तीय सहायता सीधे बैंक खाते में दी जाती है। आधार व ई-केवाईसी अनिवार्य है।',
      en: 'Provides ₹2,000 every 4 months directly to eligible farmer bank accounts via DBT. Requires Aadhaar linkage and e-KYC.',
    },
    calculateEligibility: (profile, lang) => {
      const acres = parseFloat(profile.acres) || 0;
      const isEligible = acres > 0 || !profile.acres;
      
      return {
        status: 'eligible',
        badge: lang === 'mr' ? 'पात्र (Eligible)' : lang === 'hi' ? 'पात्र (Eligible)' : 'Eligible',
        reason: lang === 'mr'
          ? (acres ? `तुमच्याकडे ${acres} एकर शेती जमीन असल्याने तुम्ही थेट ₹6,000 सन्मान निधीसाठी पात्र आहात.` : 'सर्व शेतकरी कुटुंबांसाठी उपलब्ध.')
          : lang === 'hi'
          ? (acres ? `आपके पास ${acres} एकड़ कृषि भूमि होने के कारण आप ₹6,000 सहायता हेतु पात्र हैं।` : 'सभी किसान परिवारों के लिए उपलब्ध।')
          : (acres ? `With your ${acres} acres landholding, you qualify for ₹6,000/yr direct income support.` : 'Available for all landholding farmer families.'),
      };
    },
  },
  {
    id: 'pmfby',
    name: {
      mr: 'प्रधानमंत्री पीक विमा योजना (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    },
    summary: {
      mr: 'नैसर्गिक आपत्ती व दुष्काळात पिकांना संपूर्ण विमा संरक्षण',
      hi: 'प्राकृतिक आपदा एवं सूखे से फसलों को संपूर्ण सुरक्षा',
      en: 'Comprehensive crop insurance coverage against natural calamities',
    },
    detail: {
      mr: 'अवेळी पाऊस, गारपीट, दुष्काळ किंवा किडींमुळे नुकसान झाल्यास नाममात्र १ रुपयात (महाराष्ट्र शासन योजना) पीक विमा संरक्षण उपलब्ध आहे.',
      hi: 'असमय बारिश, ओलावृष्टि या कीटों से फसल क्षति होने पर केवल ₹1 के प्रीमियम पर संपूर्ण बीमा सुरक्षा उपलब्ध है।',
      en: 'Provides comprehensive financial protection against yield loss caused by non-preventable natural risks at minimal premium.',
    },
    calculateEligibility: (profile, lang) => {
      const crops = (profile.crops || []).map(c => c.name).filter(Boolean);
      const cropText = crops.length > 0 ? crops.join(', ') : '';

      return {
        status: 'eligible',
        badge: lang === 'mr' ? '१ रुपयात विमा पात्र' : lang === 'hi' ? '₹1 में बीमा पात्र' : 'Eligible at ₹1',
        reason: lang === 'mr'
          ? (cropText ? `तुमचे ${cropText} पीक महाराष्ट्र शासनाच्या अधिसूचित पीक विमा यादीत समाविष्ट आहे.` : 'अधिसूचित खरीप व रब्बी पिकांसाठी पात्र.')
          : lang === 'hi'
          ? (cropText ? `आपकी ${cropText} फसल सरकारी अधिसूचित फसल बीमा सूची में शामिल है।` : 'अधिसूचित खरीफ व रबी फसलों हेतु पात्र।')
          : (cropText ? `Your crop (${cropText}) is covered under the state PMFBY notified crop list.` : 'Eligible for all notified seasonal crops.'),
      };
    },
  },
  {
    id: 'drip-subsidy',
    name: {
      mr: 'महाडीबीटी ठिबक व तुषार सिंचन अनुदान योजना',
      hi: 'महाडीबीटी ड्रिप व स्प्रिंकलर सिंचाई अनुदान',
      en: 'MahaDBT Micro-Irrigation (Drip/Sprinkler) Subsidy',
    },
    summary: {
      mr: 'ठिबक सिंचन संयंत्रावर ५०% ते ८०% पर्यंत शासकीय अनुदान',
      hi: 'ड्रिप सिंचाई उपकरणों पर 50% से 80% तक सरकारी सब्सिडी',
      en: '50% to 80% capital subsidy on installing drip & micro-irrigation',
    },
    detail: {
      mr: 'अल्प व अत्यल्प भूधारक शेतकऱ्यांना (५ एकरापर्यंत) ८०% आणि इतर शेतकऱ्यांना ५०% पर्यंत अनुदान दिले जाते. महाडीबीटी पोर्टलवर ७/१२ द्वारे अर्ज करता येतो.',
      hi: 'लघु एवं सीमांत किसानों (5 एकड़ तक) को 80% और अन्य किसानों को 50% तक सब्सिडी दी जाती है।',
      en: 'Subsidizes micro-irrigation systems up to 80% for small/marginal farmers (up to 5 acres) and 50% for other farmers.',
    },
    calculateEligibility: (profile, lang) => {
      const acres = parseFloat(profile.acres) || 0;
      const isSmallHolder = acres <= 5;
      const pct = isSmallHolder ? '80%' : '50%';
      const water = profile.waterSource || '';

      return {
        status: isSmallHolder ? 'high_subsidy' : 'eligible',
        badge: lang === 'mr' ? `${pct} अनुदान पात्र` : lang === 'hi' ? `${pct} सब्सिडी पात्र` : `${pct} Subsidy Eligible`,
        reason: lang === 'mr'
          ? `तुमच्याकडे ${acres ? acres + ' एकर' : 'शेती'} व ${water || 'सिंचन स्त्रोत'} असल्याने तुम्ही ${pct} शासकीय अनुदानास पात्र आहात.`
          : lang === 'hi'
          ? `आपके पास ${acres ? acres + ' एकड़' : 'कृषि भूमि'} और ${water || 'जल स्रोत'} होने से आप ${pct} सब्सिडी के पात्र हैं।`
          : `With ${acres ? acres + ' acres' : 'your farmland'} & ${water || 'water source'}, you qualify for ${pct} subsidy under MahaDBT.`,
      };
    },
  },
  {
    id: 'pm-kusum',
    name: {
      mr: 'पीएम-कुसुम सौर कृषी पंप योजना',
      hi: 'पीएम-कुसुम सोलर कृषि पंप योजना',
      en: 'PM-KUSUM Solar Agricultural Pump Scheme',
    },
    summary: {
      mr: 'सौर ऊर्जेवरील शेतीपंपासाठी ९०% ते ९५% पर्यंत भरघोस अनुदान',
      hi: 'सोलर पंप स्थापना हेतु 90% से 95% तक भारी सब्सिडी',
      en: 'Up to 90%-95% subsidy for installing off-grid solar water pumps',
    },
    detail: {
      mr: 'दिवसा अखंड वीज व सिंचनासाठी ३, ५ व ७.५ एचपी सौर कृषी पंप सवलतीच्या दरात उपलब्ध. डिझेल व अनियमित विजेपासून कायमची मुक्ती.',
      hi: 'दिन के समय बिना रुकावट सिंचाई के लिए 3, 5 और 7.5 HP के सोलर पंप भारी अनुदान पर दिए जाते हैं।',
      en: 'Provides subsidized 3HP, 5HP, and 7.5HP solar pumps for reliable daytime irrigation without dependence on the power grid.',
    },
    calculateEligibility: (profile, lang) => {
      const water = profile.waterSource || '';
      return {
        status: 'high_subsidy',
        badge: lang === 'mr' ? '९०% सौर अनुदान पात्र' : lang === 'hi' ? '90% सोलर सब्सिडी पात्र' : '90% Solar Subsidy',
        reason: lang === 'mr'
          ? `तुमच्याकडे ${water || 'विहीर/बोअरवेल'} पाणी स्त्रोत असल्याने तुम्ही ३ ते ७.५ HP सौर कृषी पंपासाठी ९०% अनुदानास पात्र आहात.`
          : lang === 'hi'
          ? `आपके पास ${water || 'जल स्रोत'} होने से आप 3 से 7.5 HP सोलर पंप पर 90% अनुदान के पात्र हैं।`
          : `Having a ${water || 'well/borewell'} water source qualifies you for a 3–7.5 HP solar pump with up to 90% subsidy.`,
      };
    },
  },
  {
    id: 'soil-health-card',
    name: {
      mr: 'मृदा आरोग्य पत्रिका (Soil Health Card)',
      hi: 'मृदा स्वास्थ्य कार्ड योजना',
      en: 'Soil Health Card Scheme',
    },
    summary: {
      mr: 'जमिनीची मोफत तपासणी व खतांच्या अचूक शिफारशी',
      hi: 'मिट्टी की निशुल्क जांच व उपयुक्त उर्वरक सिफारिशें',
      en: 'Free soil testing with customized fertilizer recommendations',
    },
    detail: {
      mr: 'शेतातील मातीचे १२ प्रमुख पोषक घटक व pH तपासून पिकाला योग्य खतांचे प्रमाण सुचवले जाते. यामुळे खतांचा खर्च ३०% पर्यंत वाचतो.',
      hi: 'मिट्टी के 12 पोषक तत्वों की जांच कर फसल के अनुसार संतुलित उर्वरक की सलाह दी जाती है, जिससे लागत कम होती है।',
      en: 'Assesses 12 parameters of soil fertility and issues customized guidance on fertilizer usage to reduce input cost and boost yield.',
    },
    calculateEligibility: (profile, lang) => {
      const soilType = profile.soil || '';
      return {
        status: 'free_service',
        badge: lang === 'mr' ? '१००% मोफत सेवा' : lang === 'hi' ? '100% निशुल्क सेवा' : '100% Free Service',
        reason: lang === 'mr'
          ? `तुमच्या ${soilType || 'शेतातील'} मातीची अचूक सुपीकता तपासण्यासाठी कृषी विभागाकडून मोफत सेवा उपलब्ध.`
          : lang === 'hi'
          ? `आपकी ${soilType || 'खेत की'} मिट्टी की उर्वरता जांचने हेतु कृषि विभाग द्वारा निशुल्क सेवा।`
          : `Free laboratory soil testing provided by Agriculture Department for your ${soilType || 'farm'} soil.`,
      };
    },
  },
  {
    id: 'nanaji-deshmukh',
    name: {
      mr: 'नानाजी देशमुख कृषी संजीवनी प्रकल्प (PoCRA)',
      hi: 'नानाजी देशमुख कृषि संजीवनी परियोजना (PoCRA)',
      en: 'Nanaji Deshmukh Krishi Sanjivani Prakalp (PoCRA)',
    },
    summary: {
      mr: 'हवामान अनुकूल शेती, शेततळे व फळबागांसाठी विशेष अनुदान',
      hi: 'जलवायु अनुकूल खेती, खेत तालाब और बागवानी हेतु अनुदान',
      en: 'Climate-resilient agriculture, farm ponds, and horticulture grants',
    },
    detail: {
      mr: 'हवामान बदलांचा सामना करण्यासाठी शेततळे, शेडनेट, फळबाग लागवड आणि सेंद्रिय शेतीसाठी थेट अर्थसाहाय्य दिले जाते.',
      hi: 'जलवायु परिवर्तन से निपटने के लिए खेत तालाब, शेडनेट, बागवानी एवं जैविक खेती के लिए प्रत्यक्ष वित्तीय सहायता।',
      en: 'Promotes climate-resilient farming techniques, farm ponds, polyhouses, and drip automation in climate-vulnerable districts.',
    },
    calculateEligibility: (profile, lang) => {
      const district = profile.district || '';
      return {
        status: 'eligible',
        badge: lang === 'mr' ? 'हवामान निधी पात्र' : lang === 'hi' ? 'जलवायु अनुदान पात्र' : 'Climate Grant Eligible',
        reason: lang === 'mr'
          ? `${district || 'महाराष्ट्रातील'} हवामान संवेदनशील भागातील शेततळे व फळबाग अनुदानासाठी थेट प्राधान्य.`
          : lang === 'hi'
          ? `${district || 'महाराष्ट्र के'} किसानों के लिए खेत तालाब व बागवानी अनुदान हेतु प्राथमिकता।`
          : `Priority allocation for farm ponds, shade nets, and micro-irrigation automation in ${district || 'Maharashtra'}.`,
      };
    },
  },
];

export function schemesHandler(req, res) {
  try {
    const lang = req.query.lang || 'mr';
    const query = (req.query.q || '').toLowerCase().trim();
    
    // Parse farmProfile if sent as query parameter or JSON string
    let farmProfile = {};
    if (req.query.profile) {
      try {
        farmProfile = JSON.parse(decodeURIComponent(req.query.profile));
      } catch {
        farmProfile = {};
      }
    }

    const localized = SCHEMES_DATABASE.map((s) => {
      const eligibility = s.calculateEligibility(farmProfile, lang);
      return {
        id: s.id,
        name: s.name[lang] || s.name.mr,
        summary: s.summary[lang] || s.summary.mr,
        detail: s.detail[lang] || s.detail.mr,
        relevance: s.relevance,
        eligibility: eligibility,
      };
    });

    const filtered = query
      ? localized.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.summary.toLowerCase().includes(query) ||
            s.detail.toLowerCase().includes(query) ||
            s.eligibility.badge.toLowerCase().includes(query) ||
            s.eligibility.reason.toLowerCase().includes(query)
        )
      : localized;

    const eligibleCount = filtered.filter(s => ['eligible', 'high_subsidy', 'free_service'].includes(s.eligibility?.status)).length;

    res.json({
      schemes: filtered,
      lang,
      total: filtered.length,
      eligibleCount,
    });
  } catch (err) {
    console.error('[schemes] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch schemes', details: err.message });
  }
}

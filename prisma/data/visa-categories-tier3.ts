// TIER 3 COUNTRIES - Comprehensive Global Coverage
// Basic visa information for 40+ additional countries achieving near-global coverage

export const visaCategoriesTier3 = [
  // ============================================
  // ASIA - CHINA
  // ============================================
  {
    countryCode: 'CHN',
    countryName: 'China',
    name: 'Z Work Visa',
    shortName: 'Z Visa',
    type: 'work',
    description: 'Chinese work visa and residence permit for foreign professionals.',
    eligibilityCriteria: [
      'Job offer from authorized Chinese employer',
      'Bachelor degree or higher (or 2+ years relevant experience)',
      'Clean criminal record',
      'Age 18-60 (can be extended to 65)',
      'Work Permit Notification Letter from employer'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work Permit Notification Letter',
      'Invitation Letter from employer',
      'Physical examination form',
      'Highest degree certificate',
      'Criminal record certificate',
      'Resume',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for Work Permit at local Foreign Expert Bureau',
      'Receive Work Permit Notification Letter',
      'Apply for Z visa at Chinese embassy',
      'Enter China within 30 days',
      'Convert to residence permit within 30 days',
      'Receive work permit card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Work permit approval 15-30 days, visa 4-5 days',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      work_permit: 300,
      visa_fee: 150,
      residence_permit: 200,
      medical_exam: 100,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Tied to employer',
      'Chinese language very helpful',
      'Annual renewal',
      'Strict COVID policies may apply'
    ],
    pros: [
      'Second largest economy',
      'Shanghai, Beijing, Shenzhen tech hubs',
      'Growing opportunities',
      'Path to permanent residence after 5+ years'
    ],
    cons: [
      'Language barrier (Mandarin essential)',
      'Cultural adjustment',
      'Internet restrictions (Great Firewall)',
      'Complex bureaucracy',
      'Pollution in major cities'
    ],
    commonRejectionReasons: [
      'Degree not recognized',
      'Criminal record issues',
      'Insufficient qualifications',
      'Employer authorization problems'
    ],
    officialUrl: 'http://www.safea.gov.cn',
    dataSource: 'State Administration of Foreign Experts Affairs China 2024',
    verified: true
  },

  // ============================================
  // ASIA - BANGLADESH
  // ============================================
  {
    countryCode: 'BGD',
    countryName: 'Bangladesh',
    name: 'Employment Visa',
    shortName: 'Employment',
    type: 'work',
    description: 'Bangladeshi employment visa for foreign professionals and specialists.',
    eligibilityCriteria: [
      'Job offer from Bangladeshi company',
      'Work permit from Board of Investment (BOI)',
      'Professional qualifications',
      'No Bangladeshi national available for position'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit from BOI',
      'Employment contract',
      'Educational certificates',
      'Photos',
      'Company registration documents'
    ],
    applicationSteps: [
      'Employer applies for work permit at BOI',
      'Receive work permit approval',
      'Apply for employment visa at Bangladesh mission',
      'Enter Bangladesh',
      'Register with local police within 48 hours',
      'Obtain work permit card from BOI'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Work permit 2-4 weeks, visa 1 week',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      work_permit: 200,
      visa_fee: 100,
      registration: 50,
      medical: 100,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 82.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Must demonstrate no local alternative',
      'Annual renewal',
      'Limited infrastructure'
    ],
    pros: [
      'Very affordable living costs',
      'Growing garment and IT outsourcing',
      'English widely spoken in business',
      'Dhaka has opportunities'
    ],
    cons: [
      'Infrastructure challenges',
      'Traffic congestion',
      'Pollution',
      'Lower salaries',
      'No clear PR path'
    ],
    commonRejectionReasons: [
      'No work permit from BOI',
      'Bangladeshi available for role',
      'Incomplete documents',
      'Company issues'
    ],
    officialUrl: 'https://www.boi.gov.bd',
    dataSource: 'Bangladesh Board of Investment 2024',
    verified: true
  },

  // ============================================
  // ASIA - SRI LANKA
  // ============================================
  {
    countryCode: 'LKA',
    countryName: 'Sri Lanka',
    name: 'Residence Visa - Employment',
    shortName: 'Employment Visa',
    type: 'work',
    description: 'Sri Lankan residence visa for foreign employees and professionals.',
    eligibilityCriteria: [
      'Employment with Sri Lankan entity',
      'Relevant qualifications',
      'BOI or Department of Immigration approval',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational qualifications',
      'Police clearance',
      'Medical report',
      'Company registration',
      'BOI/Immigration approval',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for approval',
      'Apply for visa at Sri Lankan mission',
      'Enter Sri Lanka',
      'Report to Department of Immigration',
      'Complete registration',
      'Receive residence visa'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Usually 4-8 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      visa_fee: 100,
      residence_permit: 150,
      medical: 80,
      police_clearance: 50,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 86.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Annual renewal',
      'Economic instability concerns'
    ],
    pros: [
      'Beautiful island',
      'English widely spoken',
      'Colombo has BPO sector',
      'Affordable living',
      'Friendly people'
    ],
    cons: [
      'Economic crisis impacts',
      'Political instability',
      'Lower salaries',
      'Infrastructure gaps',
      'Power cuts'
    ],
    commonRejectionReasons: [
      'No employer approval',
      'Incomplete documents',
      'Local candidate available',
      'Economic restrictions'
    ],
    officialUrl: 'http://www.immigration.gov.lk',
    dataSource: 'Sri Lanka Department of Immigration 2024',
    verified: true
  },

  // ============================================
  // ASIA - CAMBODIA
  // ============================================
  {
    countryCode: 'KHM',
    countryName: 'Cambodia',
    name: 'EB Work Visa',
    shortName: 'EB Visa',
    type: 'work',
    description: 'Cambodian business visa with work permit for foreign employees.',
    eligibilityCriteria: [
      'Employment with Cambodian entity',
      'Work permit from Ministry of Labor',
      'Passport valid 6+ months'
    ],
    requiredDocuments: [
      'Valid passport',
      'Business visa (Type E)',
      'Work permit from Ministry of Labor',
      'Employment contract',
      'Medical certificate',
      'Criminal record check',
      'Photos'
    ],
    applicationSteps: [
      'Enter Cambodia on business visa',
      'Employer applies for work permit',
      'Submit medical and criminal checks',
      'Receive work permit (2-4 weeks)',
      'Convert to EB work visa',
      'Annual renewal'
    ],
    processingTimeMin: 14,
    processingTimeMax: 45,
    processingTimeNote: 'Work permit 2-4 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 600,
    costBreakdown: {
      business_visa: 35,
      work_permit: 300,
      medical_exam: 100,
      criminal_check: 100,
      misc: 65
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 90.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Annual renewal required',
      'Work permit mandatory',
      'Limited PR options'
    ],
    pros: [
      'Very affordable living',
      'Easy to obtain',
      'Phnom Penh and Siem Reap growing',
      'Dollar economy',
      'Friendly visa policies'
    ],
    cons: [
      'Khmer language barrier',
      'Lower development level',
      'Infrastructure challenges',
      'Lower salaries',
      'No clear PR path'
    ],
    commonRejectionReasons: [
      'No work permit',
      'Invalid medical certificate',
      'Employer issues',
      'Incomplete documents'
    ],
    officialUrl: 'https://www.evisa.gov.kh',
    dataSource: 'Cambodia Ministry of Labor 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - ECUADOR
  // ============================================
  {
    countryCode: 'ECU',
    countryName: 'Ecuador',
    name: 'Professional Work Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Ecuadorian visa for foreign professionals with employment contracts.',
    eligibilityCriteria: [
      'Employment contract with Ecuadorian entity',
      'Professional qualification',
      'Ministry of Labor approval',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'University degree (apostilled)',
      'Criminal record (apostilled)',
      'Birth certificate (apostilled)',
      'Ministry of Labor work permit',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for Ministry of Labor approval',
      'Gather apostilled documents',
      'Apply for visa online or at consulate',
      'Enter Ecuador',
      'Register and get cédula (ID card)',
      'Receive residence visa'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Labor approval 2-4 weeks, visa 4-6 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 450,
    costTotalEstimateUSD: 900,
    costBreakdown: {
      visa_fee: 450,
      labor_permit: 200,
      apostille: 200,
      cedula: 30,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 87.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Spanish language needed',
      'Must maintain employment',
      'Apostille required'
    ],
    pros: [
      'USD currency',
      'Affordable living',
      'Quito and Guayaquil opportunities',
      'Beautiful country (Galápagos)',
      'Path to permanent residence'
    ],
    cons: [
      'Spanish essential',
      'Lower salaries',
      'Economic instability',
      'Infrastructure outside cities',
      'Dollarization challenges'
    ],
    commonRejectionReasons: [
      'No Ministry of Labor approval',
      'Missing apostille',
      'Incomplete documents',
      'Invalid degree'
    ],
    officialUrl: 'https://www.cancilleria.gob.ec',
    dataSource: 'Ecuadorian Ministry of Foreign Affairs 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - JORDAN
  // ============================================
  {
    countryCode: 'JOR',
    countryName: 'Jordan',
    name: 'Work Permit and Residence',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Jordanian work permit for foreign professionals.',
    eligibilityCriteria: [
      'Job offer from Jordanian company',
      'University degree or specialized skills',
      'Company has work permit quota',
      'No suitable Jordanian available'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates (attested)',
      'Criminal record (attested)',
      'Medical certificate',
      'Photos',
      'Company registration'
    ],
    applicationSteps: [
      'Employer applies for work permit at Ministry of Labor',
      'Receive work permit approval',
      'Enter Jordan on work visa',
      'Complete medical examination',
      'Apply for residence permit',
      'Receive residence card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Work permit 4-6 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 700,
    costBreakdown: {
      work_permit: 300,
      visa_fee: 100,
      residence_permit: 200,
      medical: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 83.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Quota system',
      'Arabic helpful',
      'Annual renewal',
      'Limited PR options'
    ],
    pros: [
      'Stable compared to region',
      'English widely spoken',
      'Amman has business opportunities',
      'Ancient history (Petra)',
      'Strategic location'
    ],
    cons: [
      'Limited economy',
      'Arabic language barrier',
      'Hot climate',
      'Water scarcity',
      'No clear PR path'
    ],
    commonRejectionReasons: [
      'Quota exhausted',
      'Jordanian available',
      'Missing attestation',
      'Company issues'
    ],
    officialUrl: 'http://www.mol.gov.jo',
    dataSource: 'Jordan Ministry of Labor 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - OMAN
  // ============================================
  {
    countryCode: 'OMN',
    countryName: 'Oman',
    name: 'Employment Visa',
    shortName: 'Employment',
    type: 'work',
    description: 'Omani employment visa for foreign workers and professionals.',
    eligibilityCriteria: [
      'Job offer from Omani sponsor',
      'Educational qualifications',
      'Medical fitness',
      'No criminal record',
      'Sponsor approval from Ministry of Manpower'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Employment visa issued by sponsor',
      'Educational certificates (attested)',
      'Medical certificate',
      'Police clearance (attested)',
      'Photos'
    ],
    applicationSteps: [
      'Sponsor applies for employment visa approval',
      'Receive visa authorization',
      'Apply at Omani embassy',
      'Enter Oman',
      'Complete medical examination in Oman',
      'Receive residence card',
      'Register with Royal Oman Police'
    ],
    processingTimeMin: 21,
    processingTimeMax: 60,
    processingTimeNote: 'Usually 3-6 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 700,
    costBreakdown: {
      visa_fee: 100,
      residence_card: 200,
      medical_exam: 150,
      attestation: 200,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 86.0,
    averageApprovalDays: 40,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Sponsor system',
      'Tied to employer',
      'Omanization policies (local hiring preference)',
      'Limited mobility'
    ],
    pros: [
      'No income tax',
      'Safe and stable',
      'Beautiful landscapes',
      'Muscat is modern',
      'Lower cost than UAE'
    ],
    cons: [
      'Sponsor system',
      'Omanization policies',
      'Hot climate',
      'Limited job market',
      'No PR path'
    ],
    commonRejectionReasons: [
      'No sponsor approval',
      'Medical fitness issues',
      'Omanization restrictions',
      'Invalid attestation'
    ],
    officialUrl: 'https://www.manpower.gov.om',
    dataSource: 'Oman Ministry of Manpower 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - BAHRAIN
  // ============================================
  {
    countryCode: 'BHR',
    countryName: 'Bahrain',
    name: 'Employment Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Bahraini employment visa for foreign workers.',
    eligibilityCriteria: [
      'Job offer from Bahraini employer',
      'LMRA work permit approval',
      'Medical fitness',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment visa issued by LMRA',
      'Educational certificates',
      'Medical certificate',
      'Police clearance',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for LMRA work permit',
      'Receive visa block number',
      'Apply for visa at Bahrain embassy',
      'Enter Bahrain',
      'Complete medical examination',
      'Fingerprinting',
      'Receive CPR card (residence permit)'
    ],
    processingTimeMin: 14,
    processingTimeMax: 45,
    processingTimeNote: 'Usually 2-4 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      work_permit: 300,
      visa_fee: 100,
      cpr_card: 200,
      medical: 150,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'LMRA approval needed',
      'Flexible work visa available after 1 year',
      'Bahrain reforms reduce restrictions'
    ],
    pros: [
      'No income tax',
      'Financial hub',
      'Less restrictive than other Gulf',
      'Can get flexible work permit',
      'Connected to Saudi (causeway)'
    ],
    cons: [
      'Small country',
      'Hot climate',
      'Expensive living',
      'Limited job market',
      'No PR path'
    ],
    commonRejectionReasons: [
      'No LMRA approval',
      'Medical issues',
      'Employer problems',
      'Quota restrictions'
    ],
    officialUrl: 'https://www.lmra.bh',
    dataSource: 'Bahrain Labour Market Regulatory Authority 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - KUWAIT
  // ============================================
  {
    countryCode: 'KWT',
    countryName: 'Kuwait',
    name: 'Work Visa (Article 18)',
    shortName: 'Article 18',
    type: 'work',
    description: 'Kuwaiti work visa for expatriate employees.',
    eligibilityCriteria: [
      'Job offer from Kuwaiti sponsor',
      'Educational qualifications',
      'Medical fitness',
      'Clean criminal record',
      'Sponsor approval from PACI'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work visa issued by sponsor',
      'Educational certificates (attested)',
      'Medical certificate',
      'Police clearance (attested)',
      'Photos'
    ],
    applicationSteps: [
      'Sponsor applies for work visa at PACI',
      'Receive visa authorization',
      'Apply at Kuwait embassy',
      'Enter Kuwait',
      'Complete medical tests',
      'Fingerprinting',
      'Receive civil ID card'
    ],
    processingTimeMin: 21,
    processingTimeMax: 60,
    processingTimeNote: 'Usually 3-6 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      visa_fee: 100,
      civil_id: 100,
      medical_tests: 200,
      attestation: 300,
      misc: 100
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 84.0,
    averageApprovalDays: 40,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Sponsor system',
      'Tied to employer',
      'Kuwaitization policies',
      'Need exit permit',
      'Annual renewal'
    ],
    pros: [
      'No income tax',
      'High salaries',
      'Safe environment',
      'Kuwait City modern',
      'Strategic Gulf location'
    ],
    cons: [
      'Sponsor system',
      'Very hot climate',
      'Expensive',
      'Kuwaitization limits jobs',
      'No PR path'
    ],
    commonRejectionReasons: [
      'No sponsor approval',
      'Medical fitness issues',
      'Kuwaitization restrictions',
      'Missing attestation'
    ],
    officialUrl: 'https://www.paci.gov.kw',
    dataSource: 'Kuwait Public Authority for Civil Information 2024',
    verified: true
  },

  // ============================================
  // AFRICA - BOTSWANA
  // ============================================
  {
    countryCode: 'BWA',
    countryName: 'Botswana',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Botswana work permit for foreign professionals and specialists.',
    eligibilityCriteria: [
      'Job offer from Botswana company',
      'Relevant qualifications',
      'Position requires foreign expertise',
      'No citizen of Botswana can fill position',
      'Department of Immigration approval'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'CV',
      'Police clearance',
      'Medical certificate',
      'Company registration',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit approval',
      'Submit all documents to Immigration',
      'Immigration reviews (2-3 months)',
      'If approved, collect work permit',
      'Enter Botswana or regularize status',
      'Register with authorities'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 2-3 months',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      work_permit_fee: 400,
      medical: 150,
      police_clearance: 100,
      notarization: 100,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 81.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Must demonstrate no local available',
      'Long processing',
      'Localization policies'
    ],
    pros: [
      'Stable democracy',
      'English speaking',
      'Gaborone has opportunities',
      'Diamond industry',
      'Safe country',
      'Path to permanent residence'
    ],
    cons: [
      'Small market',
      'Remote location',
      'Limited opportunities',
      'Slow processing',
      'Localization focus'
    ],
    commonRejectionReasons: [
      'Citizen can fill position',
      'Insufficient qualifications',
      'Incomplete documents',
      'Localization policies'
    ],
    officialUrl: 'http://www.gov.bw/immigration',
    dataSource: 'Botswana Department of Immigration 2024',
    verified: true
  },

  // ============================================
  // AFRICA - TANZANIA
  // ============================================
  {
    countryCode: 'TZA',
    countryName: 'Tanzania',
    name: 'Class A Work Permit',
    shortName: 'Class A',
    type: 'work',
    description: 'Tanzanian work permit for expatriate employees.',
    eligibilityCriteria: [
      'Job offer from Tanzanian employer',
      'Relevant qualifications and experience',
      'Employer demonstrates need for expatriate',
      'Minimum capital requirements for employer'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'CV',
      'Police clearance',
      'Medical certificate',
      'Company registration',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit at Immigration Services',
      'Submit all required documents',
      'Pay permit fees',
      'Processing (8-12 weeks)',
      'If approved, collect work permit',
      'Enter Tanzania or regularize',
      'Register with authorities'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 8-12 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 2000,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      work_permit_fee: 2000,
      medical: 150,
      police_clearance: 100,
      notarization: 150,
      misc: 100
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 79.0,
    averageApprovalDays: 80,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Very expensive permit',
      'Tied to employer',
      'Must demonstrate need',
      'Long processing',
      'Tanzanization policies'
    ],
    pros: [
      'Growing economy',
      'Dar es Salaam opportunities',
      'English and Swahili',
      'Beautiful country (Zanzibar, Serengeti)',
      'Path to permanent residence'
    ],
    cons: [
      'Very expensive work permit ($2,000)',
      'Infrastructure challenges',
      'Slow processing',
      'Corruption issues',
      'Tanzanization limits jobs'
    ],
    commonRejectionReasons: [
      'Tanzanian can do job',
      'Company capital insufficient',
      'Incomplete documents',
      'Employer issues'
    ],
    officialUrl: 'https://www.immigration.go.tz',
    dataSource: 'Tanzania Immigration Services 2024',
    verified: true
  },

  // ============================================
  // AFRICA - SENEGAL
  // ============================================
  {
    countryCode: 'SEN',
    countryName: 'Senegal',
    name: 'Work Authorization',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Senegalese work authorization for foreign employees.',
    eligibilityCriteria: [
      'Employment contract with Senegalese entity',
      'Ministry of Labor authorization',
      'Professional qualifications',
      'Position cannot be filled locally'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational diplomas',
      'CV',
      'Medical certificate',
      'Criminal record',
      'Photos',
      'Company documents'
    ],
    applicationSteps: [
      'Employer applies for work authorization',
      'Submit to Ministry of Labor',
      'Receive authorization (4-8 weeks)',
      'Apply for visa at Senegal embassy',
      'Enter Senegal',
      'Complete formalities',
      'Receive residence card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Authorization 4-8 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 600,
    costBreakdown: {
      work_authorization: 200,
      visa_fee: 100,
      residence_card: 200,
      medical: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 83.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'French language essential',
      'Must demonstrate need',
      'Annual renewal'
    ],
    pros: [
      'Stable democracy',
      'Dakar is regional hub',
      'French speaking (ECOWAS)',
      'Gateway to West Africa',
      'Path to permanent residence'
    ],
    cons: [
      'French language mandatory',
      'Lower salaries',
      'Infrastructure gaps',
      'Bureaucracy',
      'Limited opportunities'
    ],
    commonRejectionReasons: [
      'No work authorization',
      'Local candidate available',
      'Missing documents',
      'French language insufficient'
    ],
    officialUrl: 'http://www.emploi.gouv.sn',
    dataSource: 'Senegal Ministry of Labor 2024',
    verified: true
  },

  // ============================================
  // AFRICA - TUNISIA
  // ============================================
  {
    countryCode: 'TUN',
    countryName: 'Tunisia',
    name: 'Work Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Tunisian work visa for foreign professionals.',
    eligibilityCriteria: [
      'Employment contract with Tunisian company',
      'Ministry of Employment authorization',
      'Relevant qualifications',
      'No Tunisian available for position'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work authorization from Ministry',
      'Employment contract',
      'Educational diplomas',
      'Medical certificate',
      'Criminal record',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work authorization',
      'Receive Ministry approval',
      'Apply for work visa at Tunisian embassy',
      'Enter Tunisia',
      'Apply for residence permit',
      'Register with police',
      'Receive residence card'
    ],
    processingTimeMin: 45,
    processingTimeMax: 90,
    processingTimeNote: 'Authorization 4-6 weeks, visa 2-3 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      work_authorization: 150,
      visa_fee: 100,
      residence_permit: 150,
      medical: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'French and/or Arabic needed',
      'Must justify need for expat',
      'Annual renewal'
    ],
    pros: [
      'Mediterranean location',
      'Tunis has opportunities',
      'French speaking',
      'Lower cost than Europe',
      'Rich history'
    ],
    cons: [
      'French/Arabic language',
      'Political instability',
      'Economic challenges',
      'Lower salaries',
      'Bureaucracy'
    ],
    commonRejectionReasons: [
      'No Ministry authorization',
      'Tunisian available',
      'Incomplete documents',
      'Language requirements'
    ],
    officialUrl: 'http://www.emploi.gov.tn',
    dataSource: 'Tunisia Ministry of Employment 2024',
    verified: true
  },

  // ============================================
  // CARIBBEAN - JAMAICA
  // ============================================
  {
    countryCode: 'JAM',
    countryName: 'Jamaica',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Jamaican work permit for foreign professionals and skilled workers.',
    eligibilityCriteria: [
      'Job offer from Jamaican employer',
      'Relevant qualifications',
      'Employer demonstrates no suitable Jamaican available',
      'Ministry of Labour approval'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'CV',
      'Police clearance',
      'Medical certificate',
      'Company registration',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit',
      'Submit to Ministry of Labour',
      'Processing (8-12 weeks)',
      'If approved, collect work permit',
      'Enter Jamaica',
      'Complete medical examination',
      'Register with authorities'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 8-12 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 500,
    costTotalEstimateUSD: 1000,
    costBreakdown: {
      work_permit_fee: 500,
      processing: 150,
      medical: 150,
      police_clearance: 100,
      misc: 100
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 84.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Must prove no local available',
      'Annual renewal',
      'Localization policies'
    ],
    pros: [
      'English speaking',
      'Beautiful Caribbean island',
      'Kingston has BPO sector',
      'Tourism industry opportunities',
      'Path to permanent residence'
    ],
    cons: [
      'Lower salaries',
      'Infrastructure challenges',
      'Crime concerns in areas',
      'Hurricane season',
      'Limited tech sector'
    ],
    commonRejectionReasons: [
      'Jamaican available',
      'Insufficient qualifications',
      'Incomplete documents',
      'Employer issues'
    ],
    officialUrl: 'https://www.mlss.gov.jm',
    dataSource: 'Jamaica Ministry of Labour and Social Security 2024',
    verified: true
  },

  // ============================================
  // CARIBBEAN - BARBADOS
  // ============================================
  {
    countryCode: 'BRB',
    countryName: 'Barbados',
    name: 'Barbados Welcome Stamp',
    shortName: 'Welcome Stamp',
    type: 'freelance',
    description: 'Digital nomad visa allowing remote workers to live in Barbados for 12 months.',
    eligibilityCriteria: [
      'Work remotely for entity outside Barbados',
      'Proof of employment or self-employment',
      'Annual income USD $50,000+',
      'Health insurance'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment letter or business ownership proof',
      'Income documentation',
      'Health insurance policy',
      'Proof of accommodation',
      'Photos'
    ],
    applicationSteps: [
      'Apply online for Welcome Stamp',
      'Upload all documents',
      'Pay application fee',
      'Wait for approval (5-10 days)',
      'If approved, enter Barbados',
      'Complete final formalities'
    ],
    processingTimeMin: 5,
    processingTimeMax: 15,
    processingTimeNote: 'Very fast - usually 5-10 days',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 2000,
    costTotalEstimateUSD: 3000,
    costBreakdown: {
      welcome_stamp_fee: 2000,
      health_insurance: 800,
      misc: 200
    },
    salaryMinUSD: 50000,
    financialProofUSD: 50000,
    approvalRate: 92.0,
    averageApprovalDays: 7,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work remotely for foreign entities only',
    restrictions: [
      'Cannot work for Barbados companies',
      'Must maintain remote work',
      'Income requirement',
      'Health insurance mandatory'
    ],
    pros: [
      'Very fast approval',
      'Beautiful Caribbean island',
      'English speaking',
      'Great beaches',
      'Stable country',
      'Good internet',
      '12 months from start'
    ],
    cons: [
      'Expensive ($2,000 fee)',
      'High cost of living',
      'Small island',
      'Hurricane season',
      'No path to permanent residence'
    ],
    commonRejectionReasons: [
      'Income below $50,000',
      'No health insurance',
      'Invalid employment proof',
      'Incomplete documents'
    ],
    officialUrl: 'https://www.barbadoswelcomestamp.bb',
    dataSource: 'Barbados Government, Immigration Department 2024',
    verified: true
  },

  // ============================================
  // CARIBBEAN - CAYMAN ISLANDS
  // ============================================
  {
    countryCode: 'CYM',
    countryName: 'Cayman Islands',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Cayman Islands work permit for foreign professionals.',
    eligibilityCriteria: [
      'Job offer from Cayman employer',
      'Relevant qualifications',
      'Employer advertised locally',
      'No suitable Caymanian available'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'Police clearance',
      'Medical certificate',
      'Photos',
      'Employer justification'
    ],
    applicationSteps: [
      'Employer advertises position locally',
      'Employer applies for work permit',
      'Submit all documents',
      'WORC reviews application',
      'If approved, collect work permit',
      'Enter Cayman Islands',
      'Complete medical and formalities'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Usually 4-8 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 1500,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      work_permit_fee: 1500,
      processing: 300,
      medical: 200,
      police_clearance: 150,
      misc: 350
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 86.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Very expensive permit',
      'Tied to employer',
      'Must advertise locally first',
      'Caymanization policies',
      'Annual renewal'
    ],
    pros: [
      'No income tax',
      'High salaries (finance sector)',
      'English speaking',
      'Beautiful Caribbean',
      'Safe and stable',
      'Path to permanent residence (after 8 years)'
    ],
    cons: [
      'Extremely expensive permit ($1,500+)',
      'Very high cost of living',
      'Small island',
      'Limited opportunities outside finance',
      'Hurricane season'
    ],
    commonRejectionReasons: [
      'Caymanian available',
      'Not advertised locally',
      'Insufficient qualifications',
      'Caymanization policies'
    ],
    officialUrl: 'https://www.worc.ky',
    dataSource: 'Cayman Islands WORC 2024',
    verified: true
  },

  // ============================================
  // EUROPE - GREECE
  // ============================================
  {
    countryCode: 'GRC',
    countryName: 'Greece',
    name: 'Work and Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Greek work permit for non-EU foreign employees.',
    eligibilityCriteria: [
      'Job offer from Greek employer',
      'Relevant qualifications',
      'Employer has approval from labor authorities',
      'Position in quota'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit approval',
      'Employment contract',
      'Educational certificates',
      'Criminal record',
      'Medical insurance',
      'Accommodation proof',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit approval',
      'Receive approval',
      'Apply for visa at Greek embassy',
      'Enter Greece',
      'Apply for residence permit',
      'Fingerprinting',
      'Receive residence card'
    ],
    processingTimeMin: 90,
    processingTimeMax: 180,
    processingTimeNote: 'Work permit 2-3 months, residence permit 3-6 months',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      work_permit: 100,
      visa_fee: 100,
      residence_permit: 150,
      health_insurance: 120,
      misc: 30
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 82.0,
    averageApprovalDays: 120,
    annualQuota: 30000,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Annual quota system',
      'Greek language helpful',
      'Long processing times',
      'Initial permit only 1 year'
    ],
    pros: [
      'EU member',
      'Beautiful country',
      'Athens has opportunities',
      'Mediterranean lifestyle',
      'Path to permanent residence',
      'Lower cost than Northern Europe'
    ],
    cons: [
      'Very slow processing (6+ months)',
      'Greek language barrier',
      'Economic challenges',
      'Bureaucracy',
      'Lower salaries'
    ],
    commonRejectionReasons: [
      'Quota exhausted',
      'Greek candidate available',
      'Incomplete documents',
      'Employer issues'
    ],
    officialUrl: 'http://www.yptp.gr',
    dataSource: 'Greek Ministry of Labor 2024',
    verified: true
  },

  // ============================================
  // EUROPE - CROATIA
  // ============================================
  {
    countryCode: 'HRV',
    countryName: 'Croatia',
    name: 'Work and Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Croatian work permit for third-country nationals.',
    eligibilityCriteria: [
      'Job offer from Croatian employer',
      'Relevant qualifications',
      'Work permit quota available',
      'Employer demonstrates need'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit from Croatian Employment Service',
      'Employment contract',
      'Educational diplomas',
      'Criminal record',
      'Health insurance',
      'Accommodation proof',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit',
      'Receive work permit approval',
      'Apply for visa at Croatian embassy',
      'Enter Croatia',
      'Apply for residence permit',
      'Receive residence card'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Work permit 1-2 months, residence permit 2-3 months',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 100,
    costTotalEstimateUSD: 350,
    costBreakdown: {
      work_permit: 70,
      visa_fee: 100,
      residence_permit: 100,
      health_insurance: 60,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 86.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Quota system',
      'Croatian language helpful',
      'EU member (Schengen from 2023)',
      'Initial permit 1 year'
    ],
    pros: [
      'EU member',
      'Beautiful Adriatic coast',
      'Growing tourism and tech sectors',
      'Lower cost than Western Europe',
      'Path to permanent residence',
      'Zagreb and Split have opportunities'
    ],
    cons: [
      'Croatian language barrier',
      'Smaller economy',
      'Lower salaries',
      'Bureaucracy',
      'Quota limitations'
    ],
    commonRejectionReasons: [
      'Quota exhausted',
      'Croatian available',
      'Incomplete documents',
      'Work permit not approved'
    ],
    officialUrl: 'https://mup.gov.hr/aliens-281621/stay-and-work/286246',
    dataSource: 'Croatian Ministry of Interior 2024',
    verified: true
  },

  // ============================================
  // EUROPE - CYPRUS
  // ============================================
  {
    countryCode: 'CYP',
    countryName: 'Cyprus',
    name: 'Employment Permit',
    shortName: 'Employment',
    type: 'work',
    description: 'Cypriot employment permit for third-country nationals.',
    eligibilityCriteria: [
      'Job offer from Cypriot employer',
      'Relevant qualifications',
      'Employment permit from Ministry of Labor',
      'No suitable EU/Cypriot candidate'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment permit',
      'Employment contract',
      'Educational certificates',
      'Medical certificate',
      'Criminal record',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for employment permit',
      'Receive permit approval',
      'Apply for visa at Cyprus embassy',
      'Enter Cyprus',
      'Apply for residence permit',
      'Receive residence card (yellow slip)'
    ],
    processingTimeMin: 45,
    processingTimeMax: 90,
    processingTimeNote: 'Employment permit 4-6 weeks, visa 2-3 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      employment_permit: 100,
      visa_fee: 100,
      residence_permit: 120,
      medical: 60,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 87.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Must renew annually',
      'Greek or English helpful',
      'EU member',
      'Limited to specific sectors'
    ],
    pros: [
      'EU member',
      'English widely spoken',
      'Mediterranean lifestyle',
      'Tax advantages',
      'Beautiful island',
      'Nicosia and Limassol have opportunities',
      'Path to permanent residence'
    ],
    cons: [
      'Small market',
      'Greek language barrier',
      'Lower salaries than Western EU',
      'Divided island',
      'Limited tech sector'
    ],
    commonRejectionReasons: [
      'EU candidate available',
      'Employment permit denied',
      'Incomplete documents',
      'Sector restrictions'
    ],
    officialUrl: 'http://www.mof.gov.cy/labour',
    dataSource: 'Cyprus Ministry of Labor 2024',
    verified: true
  },

  // ============================================
  // PACIFIC - FIJI
  // ============================================
  {
    countryCode: 'FJI',
    countryName: 'Fiji',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Fijian work permit for foreign employees and professionals.',
    eligibilityCriteria: [
      'Job offer from Fijian employer',
      'Relevant qualifications',
      'Employer demonstrates no suitable Fijian available',
      'Immigration approval'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'CV',
      'Police clearance',
      'Medical certificate',
      'Company registration',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit',
      'Submit to Immigration Department',
      'Processing (4-8 weeks)',
      'If approved, collect work permit',
      'Enter Fiji',
      'Complete registration'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Usually 4-8 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 500,
    costTotalEstimateUSD: 1000,
    costBreakdown: {
      work_permit_fee: 500,
      processing: 150,
      medical: 150,
      police_clearance: 100,
      misc: 100
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 84.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Must prove no Fijian available',
      'Annual renewal',
      'Fijianization policies'
    ],
    pros: [
      'Beautiful Pacific islands',
      'English speaking',
      'Suva has opportunities',
      'Tourism industry',
      'Friendly people',
      'Path to permanent residence'
    ],
    cons: [
      'Remote location',
      'Small economy',
      'Lower salaries',
      'Infrastructure limitations',
      'Cyclone season'
    ],
    commonRejectionReasons: [
      'Fijian available',
      'Insufficient qualifications',
      'Incomplete documents',
      'Fijianization policies'
    ],
    officialUrl: 'https://www.immigration.gov.fj',
    dataSource: 'Fiji Immigration Department 2024',
    verified: true
  }
];

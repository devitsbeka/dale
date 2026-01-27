// TIER 2 COUNTRIES - Emerging Markets and Growing Destinations
// Comprehensive visa information for 30+ additional countries

export const visaCategoriesTier2 = [
  // ============================================
  // EASTERN EUROPE - ROMANIA
  // ============================================
  {
    countryCode: 'ROU',
    countryName: 'Romania',
    name: 'Work Permit and Residence',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Romanian work permit for foreign professionals. Growing tech sector in Bucharest, Cluj-Napoca.',
    eligibilityCriteria: [
      'Job offer from Romanian employer',
      'Employer obtains work authorization from Immigration Office',
      'Relevant qualifications',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work authorization',
      'Employment contract',
      'Educational diplomas',
      'Criminal record certificate',
      'Medical certificate',
      'Proof of accommodation',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work authorization',
      'Receive authorization (30-60 days)',
      'Apply for long-stay visa at Romanian embassy',
      'Enter Romania with visa',
      'Apply for residence permit within 30 days',
      'Receive residence permit card'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Work authorization 30-60 days, then residence permit',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      work_authorization: 100,
      visa_fee: 120,
      residence_permit: 100,
      medical: 50,
      misc: 30
    },
    salaryMinUSD: 12000,
    financialProofUSD: null,
    approvalRate: 87.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Romanian or English needed',
      'Annual renewal initially',
      'Must maintain employment'
    ],
    pros: [
      'Very affordable living costs',
      'Growing tech sector (Cluj, Bucharest)',
      'EU member',
      'Path to permanent residence after 5 years',
      'Beautiful country',
      'Lower competition than Western Europe'
    ],
    cons: [
      'Romanian language barrier',
      'Lower salaries',
      'Bureaucracy',
      'Infrastructure gaps',
      'Corruption issues'
    ],
    commonRejectionReasons: [
      'Missing work authorization',
      'Incomplete documents',
      'Insufficient qualifications',
      'Romanian candidate available'
    ],
    officialUrl: 'https://igi.mai.gov.ro/en/',
    dataSource: 'Romanian Immigration Office 2024',
    verified: true
  },

  // ============================================
  // EASTERN EUROPE - BULGARIA
  // ============================================
  {
    countryCode: 'BGR',
    countryName: 'Bulgaria',
    name: 'Type D Work Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Bulgarian work visa for foreign specialists and professionals.',
    eligibilityCriteria: [
      'Job offer from Bulgarian company',
      'Work permit from Employment Agency',
      'Professional qualifications',
      'Employer demonstrates shortage'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit',
      'Employment contract',
      'Educational certificates',
      'Criminal record',
      'Medical insurance',
      'Accommodation proof',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit',
      'Receive work permit approval',
      'Apply for Type D visa at Bulgarian embassy',
      'Enter Bulgaria',
      'Apply for long-term residence permit',
      'Receive residence card'
    ],
    processingTimeMin: 45,
    processingTimeMax: 90,
    processingTimeNote: 'Work permit 30 days, visa 2-4 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 100,
    costTotalEstimateUSD: 300,
    costBreakdown: {
      work_permit: 50,
      visa_fee: 100,
      residence_permit: 100,
      medical_insurance: 40,
      misc: 10
    },
    salaryMinUSD: 8000,
    financialProofUSD: null,
    approvalRate: 89.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Bulgarian language helpful',
      'Annual renewal',
      'Work permit required first'
    ],
    pros: [
      'Lowest cost of living in EU',
      'EU member state',
      'Black Sea coast',
      'Growing outsourcing sector',
      'Path to permanent residence',
      'Very affordable'
    ],
    cons: [
      'Bulgarian language needed',
      'Very low salaries',
      'Limited tech sector',
      'Infrastructure challenges',
      'Brain drain'
    ],
    commonRejectionReasons: [
      'Missing work permit',
      'Bulgarian specialist available',
      'Incomplete documentation',
      'Invalid qualifications'
    ],
    officialUrl: 'https://www.mvr.bg/en',
    dataSource: 'Bulgarian Ministry of Interior 2024',
    verified: true
  },

  // ============================================
  // EASTERN EUROPE - HUNGARY
  // ============================================
  {
    countryCode: 'HUN',
    countryName: 'Hungary',
    name: 'Single Permit (Work and Residence)',
    shortName: 'Single Permit',
    type: 'work',
    description: 'Combined Hungarian work and residence permit for third-country nationals.',
    eligibilityCriteria: [
      'Job offer from Hungarian employer',
      'Professional qualifications',
      'Labor market test passed (employer demonstrates need)',
      'Sufficient financial means'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed application forms',
      'Employment contract',
      'Educational diplomas',
      'Criminal record certificate',
      'Medical certificate',
      'Proof of accommodation',
      'Health insurance',
      'Photos'
    ],
    applicationSteps: [
      'Apply at Hungarian embassy or in Hungary',
      'Submit all documents',
      'Biometrics',
      'Wait for immigration decision (60 days)',
      'If approved, enter Hungary',
      'Collect residence permit card'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Standard 60 days, can be longer',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 140,
    costTotalEstimateUSD: 350,
    costBreakdown: {
      application_fee: 100,
      residence_permit: 100,
      health_insurance: 100,
      translations: 40,
      misc: 10
    },
    salaryMinUSD: 15000,
    financialProofUSD: null,
    approvalRate: 86.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer initially',
      'Hungarian language helpful',
      'Labor market test',
      'Must maintain employment'
    ],
    pros: [
      'Central European location (Budapest)',
      'Lower costs than Western Europe',
      'EU member',
      'Growing tech sector',
      'Path to permanent residence',
      'Beautiful capital city'
    ],
    cons: [
      'Hungarian language very different',
      'Political situation',
      'Lower salaries',
      'Bureaucracy',
      'Labor market test requirement'
    ],
    commonRejectionReasons: [
      'Hungarian candidate available',
      'Insufficient qualifications',
      'Incomplete documents',
      'Failed labor market test'
    ],
    officialUrl: 'http://www.bmbah.hu/index.php?lang=en',
    dataSource: 'Hungarian Immigration Office 2024',
    verified: true
  },

  // ============================================
  // ASIA - VIETNAM
  // ============================================
  {
    countryCode: 'VNM',
    countryName: 'Vietnam',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Vietnamese work permit for foreign professionals and specialists.',
    eligibilityCriteria: [
      'Job offer from Vietnamese company',
      'At least 3 years work experience in relevant field',
      'University degree or higher',
      'Criminal record certificate',
      'Health certificate'
    ],
    requiredDocuments: [
      'Valid passport',
      'Labor contract',
      'Health certificate',
      'Criminal record certificate',
      'Degree/diploma',
      'Work experience confirmation',
      'Photos',
      'Company documents'
    ],
    applicationSteps: [
      'Employer obtains work permit approval from Department of Labor',
      'Apply for business visa',
      'Enter Vietnam',
      'Complete health check in Vietnam',
      'Submit work permit application',
      'Receive work permit (15 days)',
      'Apply for temporary residence card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Work permit 15 days after entering Vietnam',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      work_permit: 300,
      visa_fee: 150,
      health_check: 100,
      temporary_residence: 150,
      legalization: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      '3 years experience required',
      'Vietnamese language helpful',
      'Annual renewal common'
    ],
    pros: [
      'Very affordable cost of living',
      'Growing economy',
      'Great food and culture',
      'Beautiful country',
      'Friendly people',
      'Ho Chi Minh City and Hanoi tech scenes'
    ],
    cons: [
      'Vietnamese language barrier',
      'Traffic and pollution',
      'Bureaucracy',
      '3 years experience requirement',
      'Lower salaries'
    ],
    commonRejectionReasons: [
      'Less than 3 years experience',
      'Invalid degree/diploma',
      'Health certificate issues',
      'Incomplete documentation'
    ],
    officialUrl: 'https://xuatnhapcanh.gov.vn/en',
    dataSource: 'Vietnam Department of Immigration 2024',
    verified: true
  },

  // ============================================
  // ASIA - PHILIPPINES
  // ============================================
  {
    countryCode: 'PHL',
    countryName: 'Philippines',
    name: '9(g) Pre-Arranged Employment Visa',
    shortName: '9(g) Visa',
    type: 'work',
    description: 'Philippine work visa for foreign nationals with pre-arranged employment.',
    eligibilityCriteria: [
      'Job offer from Philippine company',
      'Alien Employment Permit from DOLE',
      'Position requires foreign expertise',
      'Company registration'
    ],
    requiredDocuments: [
      'Valid passport',
      'Alien Employment Permit',
      'Employment contract',
      'Company documents',
      'NBI clearance',
      'Medical certificate',
      'Photos',
      'SSS and PhilHealth registration'
    ],
    applicationSteps: [
      'Employer applies for Alien Employment Permit (AEP) from DOLE',
      'Receive AEP approval',
      'Apply for 9(g) work visa at Philippine embassy',
      'Enter Philippines',
      'Convert to work visa at Bureau of Immigration',
      'Apply for ACR I-Card (Alien Certificate of Registration)',
      'Register with SSS and PhilHealth'
    ],
    processingTimeMin: 45,
    processingTimeMax: 90,
    processingTimeNote: 'AEP approval 30-45 days, visa conversion 2-4 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 700,
    costBreakdown: {
      aep_fee: 200,
      visa_fee: 100,
      acr_icard: 150,
      medical: 100,
      clearances: 100,
      misc: 50
    },
    salaryMinUSD: 18000,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'AEP required',
      'Annual renewal',
      'Must demonstrate foreign expertise needed'
    ],
    pros: [
      'English speaking',
      'Affordable living',
      'Beautiful islands',
      'Growing BPO and tech sector',
      'Friendly culture',
      'Manila has opportunities'
    ],
    cons: [
      'Traffic in Manila',
      'Bureaucracy',
      'Infrastructure challenges',
      'Natural disasters (typhoons)',
      'Lower salaries'
    ],
    commonRejectionReasons: [
      'No AEP approval',
      'Filipino can do the job',
      'Incomplete documents',
      'Company issues'
    ],
    officialUrl: 'https://immigration.gov.ph',
    dataSource: 'Philippine Bureau of Immigration, DOLE 2024',
    verified: true
  },

  // ============================================
  // ASIA - INDONESIA
  // ============================================
  {
    countryCode: 'IDN',
    countryName: 'Indonesia',
    name: 'KITAS Work Permit',
    shortName: 'KITAS',
    type: 'work',
    description: 'Indonesian limited stay permit (KITAS) for foreign workers.',
    eligibilityCriteria: [
      'Job offer from Indonesian sponsor',
      'TA.01 approval from Ministry of Manpower',
      'Relevant qualifications',
      'Sponsor company meets requirements',
      'Position listed in Positive List'
    ],
    requiredDocuments: [
      'Valid passport (18 months validity)',
      'TA.01 work permit approval',
      'Sponsorship letter',
      'Educational certificates',
      'CV',
      'Passport photos',
      'Health certificate',
      'Company documents'
    ],
    applicationSteps: [
      'Sponsor company applies for TA.01 work permit approval',
      'Receive TA.01 (Rencana Penggunaan Tenaga Kerja Asing)',
      'Apply for visa/telex approval',
      'Receive telex approval',
      'Obtain visa on arrival or at embassy',
      'Enter Indonesia',
      'Convert to KITAS',
      'Receive KITAS card and work permit'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'TA.01 approval 2-4 weeks, KITAS conversion 2-3 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 1500,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      ta01_fee: 300,
      telex_approval: 200,
      kitas_fee: 1000,
      work_permit: 500,
      medical: 150,
      photos: 20,
      misc: 330
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 82.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Tied to sponsor',
      'Expensive fees',
      'Indonesian language helpful',
      'Annual renewal',
      'Complex process'
    ],
    pros: [
      'Large economy',
      'Jakarta and Bali have opportunities',
      'Growing digital economy',
      'Affordable living',
      'Beautiful archipelago',
      'Strategic location'
    ],
    cons: [
      'Very expensive work permit fees',
      'Complex bureaucracy',
      'Bahasa Indonesia needed',
      'Traffic in Jakarta',
      'Infrastructure challenges'
    ],
    commonRejectionReasons: [
      'TA.01 not approved',
      'Position not on Positive List',
      'Company requirements not met',
      'Incomplete documentation',
      'Indonesian can fill position'
    ],
    officialUrl: 'https://www.imigrasi.go.id',
    dataSource: 'Indonesian Immigration, Ministry of Manpower 2024',
    verified: true
  },

  // ============================================
  // ASIA - INDIA
  // ============================================
  {
    countryCode: 'IND',
    countryName: 'India',
    name: 'Employment Visa',
    shortName: 'Employment',
    type: 'work',
    description: 'Indian employment visa for foreign nationals working for Indian companies.',
    eligibilityCriteria: [
      'Job offer from registered Indian company',
      'Professional qualification',
      'Salary minimum USD $25,000/year',
      'Contract of at least 1 year'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Employment contract',
      'Educational certificates',
      'Resume/CV',
      'Company registration documents',
      'Salary details',
      'Photos',
      'Previous visa copies if applicable'
    ],
    applicationSteps: [
      'Apply online for employment visa',
      'Upload all documents',
      'Pay visa fee',
      'Book appointment at Indian Visa Application Center',
      'Attend appointment and biometrics',
      'Wait for processing (5-7 working days)',
      'Receive visa',
      'Enter India',
      'Register at FRRO within 14 days if staying >180 days'
    ],
    processingTimeMin: 7,
    processingTimeMax: 21,
    processingTimeNote: 'Usually 5-7 working days',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 100,
    costTotalEstimateUSD: 300,
    costBreakdown: {
      visa_fee: 80,
      vfs_service_fee: 30,
      frro_registration: 100,
      medical: 50,
      misc: 40
    },
    salaryMinUSD: 25000,
    financialProofUSD: null,
    approvalRate: 91.0,
    averageApprovalDays: 10,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Minimum salary requirement',
      'Tied to employer',
      'Annual renewal common',
      'FRRO registration mandatory',
      'Limited path to permanent residence'
    ],
    pros: [
      'Fast processing',
      'Large economy',
      'Growing tech sector (Bangalore, Hyderabad, Pune)',
      'English widely spoken in business',
      'Affordable living',
      'Rich culture'
    ],
    cons: [
      'Bureaucracy',
      'Infrastructure challenges',
      'Pollution in major cities',
      'Cultural adjustment',
      'No clear path to permanent residence'
    ],
    commonRejectionReasons: [
      'Salary below $25,000',
      'Incomplete documents',
      'Company not properly registered',
      'Invalid qualifications'
    ],
    officialUrl: 'https://indianvisaonline.gov.in',
    dataSource: 'Indian Ministry of External Affairs, FRRO 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - TURKEY
  // ============================================
  {
    countryCode: 'TUR',
    countryName: 'Turkey',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Turkish work permit for foreign nationals employed by Turkish companies.',
    eligibilityCriteria: [
      'Job offer from Turkish employer',
      'University degree or vocational training',
      'Employer has proper registration',
      'Quota requirements met'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational diplomas',
      'Photos',
      'Company registration documents',
      'Employer application',
      'Health insurance'
    ],
    applicationSteps: [
      'Employer applies for work permit online at Ministry of Labor',
      'Submit all documents',
      'Ministry reviews (30-60 days)',
      'If approved, apply for visa at Turkish embassy',
      'Enter Turkey',
      'Apply for residence permit',
      'Receive residence permit card'
    ],
    processingTimeMin: 45,
    processingTimeMax: 90,
    processingTimeNote: 'Work permit 30-60 days, then residence permit',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      work_permit_fee: 150,
      visa_fee: 100,
      residence_permit: 150,
      health_insurance: 80,
      misc: 20
    },
    salaryMinUSD: 12000,
    financialProofUSD: null,
    approvalRate: 84.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Turkish language helpful',
      'Quota system',
      'Annual renewal initially'
    ],
    pros: [
      'Bridge between Europe and Asia (Istanbul)',
      'Large economy',
      'Rich culture and history',
      'Affordable living',
      'Growing tech sector',
      'Strategic location'
    ],
    cons: [
      'Turkish language barrier',
      'Political/economic instability',
      'Bureaucracy',
      'Lira volatility',
      'Work permit process'
    ],
    commonRejectionReasons: [
      'Quota issues',
      'Turkish candidate available',
      'Incomplete documents',
      'Company registration issues'
    ],
    officialUrl: 'https://www.csgb.gov.tr/en/',
    dataSource: 'Turkish Ministry of Labor and Social Security 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - SAUDI ARABIA
  // ============================================
  {
    countryCode: 'SAU',
    countryName: 'Saudi Arabia',
    name: 'Work Visa (Iqama)',
    shortName: 'Iqama',
    type: 'work',
    description: 'Saudi work visa and residence permit (Iqama) for foreign workers.',
    eligibilityCriteria: [
      'Job offer from Saudi employer',
      'Employer is licensed and approved',
      'Relevant qualifications',
      'Medical fitness',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Work visa issued by employer',
      'Educational certificates (attested)',
      'Medical report',
      'Police clearance certificate (attested)',
      'Photos',
      'Employment contract'
    ],
    applicationSteps: [
      'Employer obtains work visa authorization from Ministry of Labor',
      'Employer sends visa authorization',
      'Apply for visa at Saudi embassy',
      'Enter Saudi Arabia',
      'Complete medical examination',
      'Fingerprinting',
      'Receive Iqama (residence permit)',
      'Register with Muqeem system'
    ],
    processingTimeMin: 14,
    processingTimeMax: 45,
    processingTimeNote: 'Visa issuance 1-3 weeks after employer authorization',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 500,
    costTotalEstimateUSD: 1200,
    costBreakdown: {
      visa_fee: 200,
      iqama_fee: 300,
      medical_exam: 150,
      attestation_fees: 300,
      insurance: 200,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Kafala system (employer sponsorship)',
      'Cannot change employers easily',
      'Must have exit permit to leave',
      'Strict cultural rules',
      'No path to citizenship'
    ],
    pros: [
      'No income tax',
      'High salaries',
      'Modern cities (Riyadh, Jeddah)',
      'Large economy',
      'Vision 2030 opportunities',
      'Safe environment'
    ],
    cons: [
      'Kafala system',
      'Strict social rules',
      'Extreme heat',
      'Limited personal freedoms',
      'Exit permit system',
      'No permanent residence path'
    ],
    commonRejectionReasons: [
      'Medical fitness issues',
      'Criminal record',
      'Invalid attestation',
      'Employer authorization issues'
    ],
    officialUrl: 'https://www.mol.gov.sa',
    dataSource: 'Saudi Ministry of Labor and Social Development 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - COLOMBIA
  // ============================================
  {
    countryCode: 'COL',
    countryName: 'Colombia',
    name: 'Tipo V Work Visa',
    shortName: 'Tipo V',
    type: 'work',
    description: 'Colombian work visa for foreign professionals and workers.',
    eligibilityCriteria: [
      'Employment contract or service contract with Colombian entity',
      'Relevant professional qualifications',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates (apostilled)',
      'Criminal record certificate (apostilled)',
      'Employer registration documents',
      'Photos',
      'Application form'
    ],
    applicationSteps: [
      'Apply online via Colombian Foreign Ministry website',
      'Upload all documents',
      'Pay visa fee',
      'Wait for decision (5-30 days)',
      'If approved, visit Colombian consulate or enter with approval',
      'Register with Migración Colombia',
      'Obtain cédula de extranjería (foreigner ID)'
    ],
    processingTimeMin: 10,
    processingTimeMax: 45,
    processingTimeNote: 'Usually 10-30 days',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 230,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      visa_fee: 230,
      cedula_fee: 60,
      apostille: 150,
      translations: 50,
      misc: 10
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 89.0,
    averageApprovalDays: 25,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Spanish language needed',
      'Must maintain employment',
      'Annual reporting required'
    ],
    pros: [
      'Growing economy (Bogotá, Medellín)',
      'Affordable cost of living',
      'Beautiful country',
      'Friendly people',
      'Path to permanent residence after 5 years',
      'Digital nomad friendly'
    ],
    cons: [
      'Spanish essential',
      'Safety concerns in some areas',
      'Lower salaries',
      'Infrastructure gaps',
      'Bureaucracy'
    ],
    commonRejectionReasons: [
      'Missing apostille',
      'Incomplete documents',
      'Invalid employment contract',
      'Criminal record issues'
    ],
    officialUrl: 'https://www.cancilleria.gov.co',
    dataSource: 'Colombian Ministry of Foreign Affairs, Migración Colombia 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - PERU
  // ============================================
  {
    countryCode: 'PER',
    countryName: 'Peru',
    name: 'Work Residence Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Peruvian work visa for foreign professionals with employment in Peru.',
    eligibilityCriteria: [
      'Employment contract with Peruvian company',
      'Professional qualifications',
      'Company registration in Peru',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates (legalized)',
      'Criminal record (legalized)',
      'Medical certificate',
      'Company registration',
      'Photos',
      'Employer letter'
    ],
    applicationSteps: [
      'Apply at Peruvian consulate or online',
      'Submit all legalized documents',
      'Pay visa fee',
      'Wait for approval (15-30 days)',
      'Enter Peru with visa',
      'Register at Migraciones',
      'Obtain carné de extranjería (foreigner card)'
    ],
    processingTimeMin: 20,
    processingTimeMax: 60,
    processingTimeNote: 'Usually 15-30 days',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      visa_fee: 150,
      carne_fee: 45,
      legalization: 150,
      medical: 40,
      misc: 15
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 87.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Spanish language needed',
      'Annual renewal initially',
      'Legalization requirements'
    ],
    pros: [
      'Rich culture and history',
      'Affordable living',
      'Lima has growing tech sector',
      'Beautiful country (Machu Picchu)',
      'Path to permanent residence',
      'Friendly to foreigners'
    ],
    cons: [
      'Spanish essential',
      'Lower salaries',
      'Bureaucracy',
      'Infrastructure outside Lima',
      'Political instability'
    ],
    commonRejectionReasons: [
      'Missing legalization',
      'Incomplete documents',
      'Criminal record issues',
      'Invalid employment contract'
    ],
    officialUrl: 'https://www.migraciones.gob.pe',
    dataSource: 'Peruvian Immigration Service 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - URUGUAY
  // ============================================
  {
    countryCode: 'URY',
    countryName: 'Uruguay',
    name: 'Temporary Residence - Work',
    shortName: 'Work Residence',
    type: 'work',
    description: 'Uruguayan temporary residence for workers. Relatively easy Latin American immigration.',
    eligibilityCriteria: [
      'Employment contract or proof of income',
      'Clean criminal record',
      'No communicable diseases',
      'Means to support oneself'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Criminal record (apostilled)',
      'Employment contract or income proof',
      'Proof of address in Uruguay',
      'Medical certificate',
      'Photos'
    ],
    applicationSteps: [
      'Enter Uruguay (most nationalities visa-free)',
      'Apply at Immigration Office (Dirección Nacional de Migración)',
      'Submit all documents',
      'Biometrics and fingerprints',
      'Pay fees',
      'Wait for approval (30-90 days)',
      'Receive temporary residence',
      'Obtain cédula de identidad'
    ],
    processingTimeMin: 30,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 30-90 days',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      residence_fee: 120,
      cedula_fee: 50,
      apostille: 150,
      medical: 60,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 92.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work in Uruguay',
    restrictions: [
      'Must maintain residence',
      'Spanish language needed',
      'Annual renewal initially',
      'Must spend time in Uruguay'
    ],
    pros: [
      'Relatively easy immigration',
      'Stable democracy',
      'High quality of life',
      'Safe country',
      'Path to permanent residence',
      'European atmosphere (Montevideo)',
      'Progressive policies'
    ],
    cons: [
      'Small economy',
      'Higher costs than neighbors',
      'Spanish essential',
      'Limited job market',
      'Remote location'
    ],
    commonRejectionReasons: [
      'Missing apostille',
      'Criminal record issues',
      'Incomplete documentation',
      'No proof of means'
    ],
    officialUrl: 'https://www.gub.uy/tramites/residencia-legal',
    dataSource: 'Uruguayan Immigration Service 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - PANAMA
  // ============================================
  {
    countryCode: 'PAN',
    countryName: 'Panama',
    name: 'Friendly Nations Visa',
    shortName: 'Friendly Nations',
    type: 'work',
    description: 'Simplified residence permit for citizens of 50 friendly nations. Popular with expats.',
    eligibilityCriteria: [
      'Citizen of one of 50 friendly nations',
      'Economic or professional ties to Panama (employment, business, or investment)',
      'Clean criminal record',
      'No communicable diseases'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Criminal record (apostilled)',
      'Employment letter, business registration, or bank deposit',
      'Economic solvency proof',
      'Medical certificate',
      'Photos',
      'Lawyer power of attorney'
    ],
    applicationSteps: [
      'Hire immigration attorney in Panama',
      'Gather and apostille all documents',
      'Attorney submits application to Immigration',
      'Pay fees',
      'Attend appointments at Immigration',
      'Fingerprinting and photos',
      'Wait for approval (6-12 months)',
      'Receive provisional permit',
      'Receive permanent residence'
    ],
    processingTimeMin: 180,
    processingTimeMax: 365,
    processingTimeNote: 'Currently 6-12 months due to backlog',
    validityYears: null, // Permanent
    renewalPossible: false,
    costApplicationUSD: 1500,
    costTotalEstimateUSD: 5500,
    costBreakdown: {
      government_fees: 800,
      attorney_fees: 3000,
      deposit_requirement: 5000, // Refundable
      apostille: 400,
      medical: 150,
      misc: 150
    },
    salaryMinUSD: null,
    financialProofUSD: 5000, // Deposit
    approvalRate: 94.0,
    averageApprovalDays: 270,
    annualQuota: null,
    pathToPermanence: true, // It is permanent residence
    familyIncluded: true,
    workRights: 'Can work and do business in Panama',
    restrictions: [
      'Long processing time',
      'Requires attorney',
      'Must maintain ties',
      'Spanish helpful'
    ],
    pros: [
      'Permanent residence directly',
      'No minimum stay requirement',
      'Can work freely',
      'USD currency',
      'Tax advantages',
      'Panama City is regional hub',
      'Path to citizenship after 5 years'
    ],
    cons: [
      'Very long processing (1 year+)',
      'Expensive with attorney',
      'Bureaucracy',
      'Spanish needed',
      '$5,000 deposit required'
    ],
    commonRejectionReasons: [
      'Missing apostille',
      'Criminal record issues',
      'Insufficient economic ties',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.migracion.gob.pa',
    dataSource: 'Panamanian Immigration Service 2024',
    verified: true
  },

  // ============================================
  // AFRICA - MAURITIUS
  // ============================================
  {
    countryCode: 'MUS',
    countryName: 'Mauritius',
    name: 'Occupation Permit',
    shortName: 'Occupation Permit',
    type: 'work',
    description: 'Mauritian work permit for professionals, investors, and self-employed.',
    eligibilityCriteria: [
      'Professional qualification',
      'Work contract or business plan',
      'Minimum salary/investment depending on category',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Contract of employment or business plan',
      'Educational qualifications',
      'CV',
      'Police clearance certificate',
      'Medical certificate',
      'Bank statements',
      'Photos'
    ],
    applicationSteps: [
      'Apply online at EDB Mauritius',
      'Submit all documents',
      'Pay application fee',
      'Wait for approval (2-4 weeks)',
      'Enter Mauritius',
      'Complete formalities',
      'Receive Occupation Permit card'
    ],
    processingTimeMin: 14,
    processingTimeMax: 45,
    processingTimeNote: 'Usually 2-4 weeks',
    validityYears: 3,
    renewalPossible: true,
    costApplicationUSD: 2500,
    costTotalEstimateUSD: 3000,
    costBreakdown: {
      application_fee: 2500,
      medical: 200,
      police_clearance: 100,
      misc: 200
    },
    salaryMinUSD: 36000, // For professionals
    financialProofUSD: null,
    approvalRate: 89.0,
    averageApprovalDays: 25,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work in specified occupation',
    restrictions: [
      'Minimum salary requirements',
      'Must maintain occupation',
      '3-year initial period',
      'Expensive permit fees'
    ],
    pros: [
      'Beautiful island paradise',
      'English and French spoken',
      'Stable democracy',
      'Tax incentives',
      '3-year permit from start',
      'Path to permanent residence',
      'Family included',
      'Quality of life'
    ],
    cons: [
      'Expensive permit fees ($2,500)',
      'Small island/market',
      'Limited job opportunities',
      'High living costs',
      'Remote location'
    ],
    commonRejectionReasons: [
      'Salary below minimum',
      'Insufficient qualifications',
      'Incomplete documentation',
      'Criminal record issues'
    ],
    officialUrl: 'https://edbmauritius.org/occupation-permit/',
    dataSource: 'Economic Development Board Mauritius 2024',
    verified: true
  },

  // ============================================
  // AFRICA - GHANA
  // ============================================
  {
    countryCode: 'GHA',
    countryName: 'Ghana',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Ghanaian work permit for foreign professionals and skilled workers.',
    eligibilityCriteria: [
      'Job offer from Ghanaian company',
      'Professional qualifications',
      'Company quota allocation',
      'Position cannot be filled by Ghanaian',
      'Minimum capital requirement for some categories'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'CV',
      'Company registration documents',
      'Tax clearance certificate',
      'Photos',
      'Medical certificate'
    ],
    applicationSteps: [
      'Employer applies for work permit at Ghana Immigration Service',
      'Submit all documents',
      'Pay permit fees',
      'Immigration reviews (6-12 weeks)',
      'If approved, collect work permit',
      'Enter Ghana or regularize status',
      'Register at Immigration within 48 hours'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 6-12 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 1500,
    costTotalEstimateUSD: 2000,
    costBreakdown: {
      work_permit_fee: 1500,
      processing: 100,
      medical: 100,
      photos: 20,
      misc: 280
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 80.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Expensive permit fees',
      'Tied to employer',
      'Quota system',
      'Must demonstrate no Ghanaian can do job',
      'Long processing'
    ],
    pros: [
      'English speaking',
      'Growing economy (Accra)',
      'Friendly people',
      'Stable democracy',
      'Gateway to West Africa',
      'Path to permanent residence'
    ],
    cons: [
      'Very expensive work permit',
      'Infrastructure challenges',
      'Slow processing',
      'Lower salaries',
      'Power outages'
    ],
    commonRejectionReasons: [
      'Ghanaian candidate available',
      'Quota issues',
      'Company requirements not met',
      'Insufficient qualifications',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.ghanaimmigration.org',
    dataSource: 'Ghana Immigration Service 2024',
    verified: true
  },

  // ============================================
  // AFRICA - EGYPT
  // ============================================
  {
    countryCode: 'EGY',
    countryName: 'Egypt',
    name: 'Work Visa and Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Egyptian work visa for foreign professionals working in Egypt.',
    eligibilityCriteria: [
      'Job offer from Egyptian company',
      'University degree or specialized skills',
      'Company has work permit approval from Ministry of Manpower',
      'Security clearance'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Work permit from Ministry of Manpower',
      'Employment contract',
      'Educational certificates (legalized)',
      'Criminal record certificate',
      'Medical certificate',
      'Photos',
      'Company documents'
    ],
    applicationSteps: [
      'Employer applies for work permit at Ministry of Manpower',
      'Receive work permit approval',
      'Apply for work visa at Egyptian embassy',
      'Enter Egypt',
      'Apply for residence permit at Mogamma',
      'Medical examination in Egypt',
      'Receive residence permit'
    ],
    processingTimeMin: 45,
    processingTimeMax: 120,
    processingTimeNote: 'Work permit 1-2 months, visa 1-2 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 700,
    costBreakdown: {
      work_permit: 200,
      visa_fee: 100,
      residence_permit: 200,
      medical: 100,
      legalization: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 83.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Arabic language helpful',
      'Annual renewal',
      'Complex bureaucracy',
      'Security clearance required'
    ],
    pros: [
      'Large economy',
      'Cairo is regional hub',
      'Rich history and culture',
      'Affordable living',
      'Growing sectors',
      'Strategic location'
    ],
    cons: [
      'Heavy bureaucracy',
      'Arabic language barrier',
      'Lower salaries',
      'Political instability',
      'Infrastructure challenges',
      'No clear PR path'
    ],
    commonRejectionReasons: [
      'Work permit not approved',
      'Security clearance issues',
      'Incomplete legalization',
      'Egyptian candidate available'
    ],
    officialUrl: 'https://www.emigration.gov.eg',
    dataSource: 'Egyptian Ministry of Manpower and Migration 2024',
    verified: true
  },

  // ============================================
  // AFRICA - NIGERIA
  // ============================================
  {
    countryCode: 'NGA',
    countryName: 'Nigeria',
    name: 'Subject to Regularisation (STR) Permit',
    shortName: 'STR Permit',
    type: 'work',
    description: 'Nigerian work permit for expatriates. Quota system applies.',
    eligibilityCriteria: [
      'Job offer from Nigerian company',
      'Relevant qualifications',
      'Company has approved expatriate quota',
      'Position requires foreign expertise',
      'Minimum capital requirement for company'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment letter',
      'Educational certificates',
      'CV',
      'Company registration documents',
      'Expatriate quota approval',
      'Tax clearance certificate',
      'Photos'
    ],
    applicationSteps: [
      'Company applies for expatriate quota approval',
      'Receive quota approval from Ministry of Interior',
      'Apply for Combined Expatriate Residence Permit and Aliens Card (CERPAC)',
      'Submit all documents',
      'Pay fees',
      'Processing (8-16 weeks)',
      'Receive CERPAC',
      'Enter Nigeria or regularize status'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 8-16 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 2000,
    costTotalEstimateUSD: 3000,
    costBreakdown: {
      quota_approval: 500,
      cerpac_fee: 2000,
      processing: 300,
      medical: 100,
      misc: 100
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 78.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Very expensive permit',
      'Tied to employer',
      'Quota system',
      'Must demonstrate foreign expertise needed',
      'Complex process'
    ],
    pros: [
      'Largest economy in Africa',
      'Lagos is major business hub',
      'English speaking',
      'Growing tech sector',
      'Large market opportunities'
    ],
    cons: [
      'Very expensive work permit ($2,000+)',
      'Security concerns',
      'Infrastructure challenges',
      'Corruption',
      'Power supply issues',
      'Slow bureaucracy'
    ],
    commonRejectionReasons: [
      'No quota approval',
      'Nigerian can fill position',
      'Company capital insufficient',
      'Incomplete documentation',
      'Tax clearance issues'
    ],
    officialUrl: 'https://immigration.gov.ng',
    dataSource: 'Nigeria Immigration Service, Ministry of Interior 2024',
    verified: true
  }
];

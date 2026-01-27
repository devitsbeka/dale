// GLOBAL VISA DATABASE - Latin America, Middle East, Africa, Eastern Europe
// Comprehensive visa information for emerging markets and developing regions

export const visaCategoriesGlobal = [
  // ============================================
  // LATIN AMERICA - BRAZIL
  // ============================================
  {
    countryCode: 'BRA',
    countryName: 'Brazil',
    name: 'Work Visa (VITEM V)',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Brazilian work visa for foreign professionals with employment contracts or service agreements.',
    eligibilityCriteria: [
      'Job offer or service contract with Brazilian entity',
      'Company work authorization from Ministry of Labor',
      'Relevant qualifications',
      'Clean criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work authorization from Brazilian Ministry of Labor',
      'Employment contract',
      'Educational diplomas (apostilled)',
      'Criminal record certificate',
      'Passport photos',
      'Proof of professional qualifications'
    ],
    applicationSteps: [
      'Employer obtains work authorization from Ministry of Labor',
      'Apply for visa at Brazilian consulate',
      'Submit all required documents',
      'Attend interview',
      'Receive visa',
      'Enter Brazil',
      'Register with Federal Police within 90 days',
      'Obtain RNE (residence card)'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Varies by consulate',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 290,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      visa_fee: 290,
      work_authorization: 200,
      apostille: 150,
      translations: 100,
      misc: 60
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
      'Portuguese language helpful',
      'Must register with Federal Police',
      'Need work authorization first'
    ],
    pros: [
      'Large economy',
      'Growing tech sector (São Paulo)',
      'Cultural diversity',
      'Path to permanent residence',
      'Family can join',
      'Lower cost than US/Europe'
    ],
    cons: [
      'Bureaucratic process',
      'Portuguese language needed',
      'Safety concerns in some areas',
      'Economic instability',
      'Complex tax system'
    ],
    commonRejectionReasons: [
      'Missing work authorization',
      'Incomplete documents',
      'Invalid apostille',
      'Criminal record issues'
    ],
    officialUrl: 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/migracoes',
    dataSource: 'Brazilian Ministry of Justice, Consular Services 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - CHILE
  // ============================================
  {
    countryCode: 'CHL',
    countryName: 'Chile',
    name: 'Temporary Residence Visa - Work',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Chilean work visa for professionals, technicians, and skilled workers.',
    eligibilityCriteria: [
      'Job offer or employment contract',
      'Relevant qualifications',
      'Clean criminal record',
      'Company registration in Chile'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates (apostilled)',
      'Criminal record (apostilled)',
      'Health certificate',
      'Passport photos',
      'Employer letter'
    ],
    applicationSteps: [
      'Apply online via Chilean Immigration website',
      'Upload all documents',
      'Pay fees',
      'Wait for approval (30-60 days)',
      'Receive visa approval',
      'Enter Chile',
      'Register and get identity card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Online system generally faster',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      visa_fee: 115,
      identity_card: 40,
      apostille: 120,
      translations: 100,
      misc: 25
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 89.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Initial visa 1 year',
      'Tied to employer',
      'Spanish language needed',
      'Must maintain employment'
    ],
    pros: [
      'Stable economy',
      'Good quality of life',
      'Path to permanent residence after 2 years',
      'Lower cost of living',
      'Beautiful nature',
      'Growing tech scene (Santiago)'
    ],
    cons: [
      'Spanish essential',
      'Remote location',
      'Earthquakes',
      'Lower salaries',
      'Initial visa short (1 year)'
    ],
    commonRejectionReasons: [
      'Incomplete documents',
      'Missing apostille',
      'Criminal record issues',
      'Invalid employment contract'
    ],
    officialUrl: 'https://serviciomigraciones.cl',
    dataSource: 'Chilean Immigration Service 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - ARGENTINA
  // ============================================
  {
    countryCode: 'ARG',
    countryName: 'Argentina',
    name: 'Temporary Work and Residence Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Argentine work visa for professionals and skilled workers.',
    eligibilityCriteria: [
      'Job offer from Argentine company',
      'Professional qualifications',
      'Clean criminal record',
      'Company authorization'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational diplomas (apostilled)',
      'Criminal record (apostilled)',
      'Birth certificate (apostilled)',
      'Photos',
      'Company documentation'
    ],
    applicationSteps: [
      'Employer notifies Immigration (pre-notification)',
      'Apply at Argentine consulate or in Argentina',
      'Submit all documents',
      'Biometrics and interview',
      'Receive temporary residence',
      'Register at Immigration office',
      'Obtain DNI (national ID)'
    ],
    processingTimeMin: 60,
    processingTimeMax: 180,
    processingTimeNote: 'Can be slow, varies by location',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      residence_fee: 150,
      dni_fee: 50,
      apostille: 200,
      translations: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Bureaucratic process',
      'Tied to employer',
      'Spanish essential',
      'Economic instability'
    ],
    pros: [
      'Vibrant culture (Buenos Aires)',
      'European atmosphere',
      'Path to permanent residence',
      'Affordable living',
      'Easy to renew'
    ],
    cons: [
      'Economic instability',
      'High inflation',
      'Bureaucracy',
      'Spanish essential',
      'Currency controls'
    ],
    commonRejectionReasons: [
      'Incomplete apostille',
      'Missing documents',
      'Criminal record issues',
      'Company authorization problems'
    ],
    officialUrl: 'https://www.argentina.gob.ar/interior/migraciones',
    dataSource: 'Argentine Immigration Service 2024',
    verified: true
  },

  // ============================================
  // LATIN AMERICA - COSTA RICA
  // ============================================
  {
    countryCode: 'CRI',
    countryName: 'Costa Rica',
    name: 'Temporary Residence - Rentista',
    shortName: 'Rentista',
    type: 'investment',
    description: 'Residence for people with guaranteed monthly income. Popular with digital nomads and retirees.',
    eligibilityCriteria: [
      'Proof of monthly income $2,500 USD minimum for 2 years',
      'Income from stable source (pension, rental, investments)',
      'Clean criminal record',
      'Health insurance'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Criminal record (apostilled)',
      'Marriage certificate if applicable (apostilled)',
      'Bank statements or proof of income',
      'Health insurance policy',
      'Photos'
    ],
    applicationSteps: [
      'Gather and apostille documents',
      'Apply online via Immigration website',
      'Submit documents and pay fees',
      'Wait for review (3-6 months)',
      'Receive approval',
      'Enter Costa Rica',
      'Complete final steps at Immigration',
      'Receive residence card (DIMEX)'
    ],
    processingTimeMin: 90,
    processingTimeMax: 270,
    processingTimeNote: 'Currently 3-9 months',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 350,
    costTotalEstimateUSD: 1000,
    costBreakdown: {
      application_fee: 250,
      residence_card: 100,
      apostille: 300,
      translations: 200,
      attorney: 150
    },
    salaryMinUSD: 30000, // Annual
    financialProofUSD: 60000, // 2 years proof
    approvalRate: 91.0,
    averageApprovalDays: 150,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Cannot work initially; can after 3 years of residence',
    restrictions: [
      'Cannot work for first 3 years',
      'Must maintain income requirement',
      'Must spend time in Costa Rica',
      'Health insurance required'
    ],
    pros: [
      'Beautiful nature',
      'Stable democracy',
      'Good healthcare',
      '"Pura Vida" lifestyle',
      'Path to permanent residence',
      'No military',
      'Safe country'
    ],
    cons: [
      'Cannot work initially',
      'Slow processing',
      'Expensive for Central America',
      'Spanish helpful',
      'Bureaucracy'
    ],
    commonRejectionReasons: [
      'Insufficient income proof',
      'Missing apostille',
      'No health insurance',
      'Criminal record issues',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.migracion.go.cr',
    dataSource: 'Costa Rican Immigration Service 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - ISRAEL
  // ============================================
  {
    countryCode: 'ISR',
    countryName: 'Israel',
    name: 'B-1 Work Visa',
    shortName: 'B-1',
    type: 'work',
    description: 'Israeli work visa for foreign professionals and experts. Tech sector actively recruits.',
    eligibilityCriteria: [
      'Job offer from Israeli company',
      'Professional qualifications',
      'Company has permit quota',
      'Salary above minimum threshold',
      'No suitable Israeli candidate'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit approval',
      'Employment contract',
      'Educational certificates',
      'Medical examination',
      'Police clearance',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit at Population Authority',
      'Approval process (2-4 months)',
      'Apply for B-1 visa at Israeli consulate',
      'Enter Israel',
      'Complete medical exam',
      'Register at Interior Ministry',
      'Receive B-1 work visa'
    ],
    processingTimeMin: 60,
    processingTimeMax: 150,
    processingTimeNote: 'Permit approval takes 2-4 months',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 600,
    costBreakdown: {
      visa_fee: 50,
      work_permit: 200,
      medical_exam: 200,
      translations: 100,
      misc: 50
    },
    salaryMinUSD: 25000,
    financialProofUSD: null,
    approvalRate: 82.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Quota system',
      'Annual renewal',
      'Complex permit process',
      'Hebrew helpful'
    ],
    pros: [
      'Silicon Wadi - strong tech sector',
      'High salaries',
      'Innovative ecosystem',
      'English widely spoken in tech',
      'Path to permanent residence',
      'Rich culture and history'
    ],
    cons: [
      'Security situation',
      'High cost of living',
      'Bureaucracy',
      'Permit system can be slow',
      'Hebrew needed long-term'
    ],
    commonRejectionReasons: [
      'Quota issues',
      'Suitable local candidate found',
      'Insufficient qualifications',
      'Salary below minimum',
      'Security concerns'
    ],
    officialUrl: 'https://www.gov.il/en/departments/population_and_immigration_authority',
    dataSource: 'Israeli Population Authority, Ministry of Interior 2024',
    verified: true
  },

  // ============================================
  // MIDDLE EAST - QATAR
  // ============================================
  {
    countryCode: 'QAT',
    countryName: 'Qatar',
    name: 'Work Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Qatar work visa for professionals and skilled workers.',
    eligibilityCriteria: [
      'Job offer from Qatari employer',
      'Educational qualifications',
      'Medical fitness',
      'Clean criminal record',
      'Employer has quota'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Employment contract',
      'Educational certificates (attested)',
      'Medical certificate',
      'Police clearance certificate',
      'Photos',
      'Employer approval letter'
    ],
    applicationSteps: [
      'Employer applies for work permit',
      'Receive entry permit',
      'Enter Qatar with entry permit',
      'Complete medical examination',
      'Fingerprinting and biometrics',
      'Visa medical test',
      'Receive residence permit (RP) and ID'
    ],
    processingTimeMin: 14,
    processingTimeMax: 45,
    processingTimeNote: 'Usually 2-4 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 800,
    costTotalEstimateUSD: 1200,
    costBreakdown: {
      work_permit: 300,
      medical_exam: 200,
      residence_permit: 300,
      id_card: 100,
      misc: 300
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 90.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Tied to employer (kafala system)',
      'Cannot change jobs easily',
      'Must exit Qatar to change employer',
      'Extreme heat'
    ],
    pros: [
      'No income tax',
      'High salaries',
      'Modern infrastructure',
      'Safe environment',
      'Strategic location (Doha)',
      'Growing economy'
    ],
    cons: [
      'Kafala system (employer sponsorship)',
      'Extreme heat',
      'Limited personal freedoms',
      'No path to permanent residence',
      'High cost of living'
    ],
    commonRejectionReasons: [
      'Medical fitness issues',
      'Invalid documents',
      'Criminal record',
      'Employer quota problems'
    ],
    officialUrl: 'https://portal.moi.gov.qa',
    dataSource: 'Qatar Ministry of Interior 2024',
    verified: true
  },

  // ============================================
  // AFRICA - SOUTH AFRICA
  // ============================================
  {
    countryCode: 'ZAF',
    countryName: 'South Africa',
    name: 'Critical Skills Work Visa',
    shortName: 'Critical Skills',
    type: 'work',
    description: 'South African visa for skilled professionals in critical shortage occupations. No job offer required.',
    eligibilityCriteria: [
      'Occupation on Critical Skills List',
      'Relevant qualification',
      'At least 5 years work experience',
      'Recognition by professional body in SA (where applicable)'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed application forms',
      'Educational qualifications',
      'Professional registration',
      'Work experience letters',
      'CV',
      'Medical and radiological reports',
      'Police clearance',
      'Passport photos'
    ],
    applicationSteps: [
      'Ensure occupation is on Critical Skills List',
      'Get qualifications evaluated',
      'Apply at VFS Global or SA mission abroad',
      'Submit all documents',
      'Biometrics',
      'Wait for decision (8-12 weeks)',
      'Receive visa',
      'Enter South Africa'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Currently 8-12 weeks',
    validityYears: 5,
    renewalPossible: true,
    costApplicationUSD: 100,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      visa_fee: 100,
      vfs_service_fee: 50,
      medical: 150,
      police_clearance: 50,
      qualification_evaluation: 100,
      misc: 50
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 86.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work in any company in South Africa',
    restrictions: [
      'Must be on Critical Skills List',
      'Need 5 years experience',
      'Professional registration may be needed'
    ],
    pros: [
      'No job offer required',
      'Not tied to employer',
      '5-year visa',
      'Path to permanent residence',
      'Family included',
      'English speaking',
      'Lower cost of living',
      'Beautiful country'
    ],
    cons: [
      'Safety concerns',
      'Infrastructure challenges',
      'Economic issues',
      'Load shedding (power cuts)',
      'Slow processing times'
    ],
    commonRejectionReasons: [
      'Occupation not on list',
      'Insufficient experience',
      'Qualifications not recognized',
      'Incomplete documentation',
      'Missing professional registration'
    ],
    officialUrl: 'http://www.dha.gov.za/index.php/immigration-services',
    dataSource: 'South African Department of Home Affairs 2024',
    verified: true
  },

  // ============================================
  // AFRICA - KENYA
  // ============================================
  {
    countryCode: 'KEN',
    countryName: 'Kenya',
    name: 'Class D Work Permit',
    shortName: 'Class D',
    type: 'work',
    description: 'Kenyan work permit for specific employment with a particular employer.',
    eligibilityCriteria: [
      'Job offer from Kenyan company',
      'Company demonstrates no suitable Kenyan available',
      'Professional qualifications',
      'Position pays above minimum threshold'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employment contract',
      'Educational certificates',
      'Professional certificates',
      'CV',
      'Police clearance',
      'Medical certificate',
      'Passport photos',
      'Company registration',
      'KRA certificate'
    ],
    applicationSteps: [
      'Employer advertises position locally',
      'Submit work permit application online',
      'Upload all documents',
      'Pay application fee',
      'Immigration reviews',
      'Receive approval (6-12 weeks)',
      'Pay permit fees',
      'Collect work permit',
      'Enter Kenya or regularize status'
    ],
    processingTimeMin: 42,
    processingTimeMax: 90,
    processingTimeNote: 'Usually 6-12 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 2000,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      application_fee: 100,
      permit_fee: 2000,
      medical: 100,
      police_clearance: 50,
      misc: 250
    },
    salaryMinUSD: 24000,
    financialProofUSD: null,
    approvalRate: 81.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Must demonstrate no local alternative',
      'High permit costs',
      '2-year initial validity'
    ],
    pros: [
      'Growing economy (Nairobi tech hub)',
      'English speaking',
      'Strategic East Africa location',
      'Vibrant culture',
      'Path to permanent residence',
      'Lower cost of living'
    ],
    cons: [
      'Expensive work permit fees',
      'Bureaucracy',
      'Infrastructure challenges',
      'Security concerns in some areas',
      'Tied to employer'
    ],
    commonRejectionReasons: [
      'Suitable Kenyan candidate available',
      'Insufficient qualifications',
      'Company issues',
      'Incomplete documentation',
      'Salary too low'
    ],
    officialUrl: 'https://www.immigration.go.ke',
    dataSource: 'Kenyan Department of Immigration Services 2024',
    verified: true
  },

  // ============================================
  // AFRICA - MOROCCO
  // ============================================
  {
    countryCode: 'MAR',
    countryName: 'Morocco',
    name: 'Work Authorization and Residence',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Moroccan work permit for foreign professionals.',
    eligibilityCriteria: [
      'Job offer from Moroccan company',
      'Professional qualifications',
      'Company obtains ANAPEC authorization',
      'Position cannot be filled by Moroccan'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work contract',
      'Educational diplomas',
      'ANAPEC work authorization',
      'Medical certificate',
      'Criminal record',
      'Photos',
      'Company documents'
    ],
    applicationSteps: [
      'Employer applies for ANAPEC authorization',
      'Receive ANAPEC approval',
      'Apply for work visa at Moroccan consulate',
      'Enter Morocco',
      'Apply for residence permit at local prefecture',
      'Medical examination',
      'Receive residence card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'ANAPEC approval 1-2 months',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      anapec_fee: 50,
      visa_fee: 75,
      residence_permit: 150,
      medical: 80,
      misc: 45
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 84.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'ANAPEC authorization required',
      'French or Arabic helpful',
      'Annual renewal initially'
    ],
    pros: [
      'Gateway to Africa and Europe',
      'Growing economy (Casablanca)',
      'Rich culture',
      'Lower cost of living',
      'Path to permanent residence',
      'Strategic location'
    ],
    cons: [
      'French/Arabic language barriers',
      'Bureaucracy',
      'Lower salaries',
      'Work permit process',
      'Infrastructure varies'
    ],
    commonRejectionReasons: [
      'No ANAPEC authorization',
      'Moroccan candidate available',
      'Incomplete documentation',
      'Company issues'
    ],
    officialUrl: 'https://www.anapec.org',
    dataSource: 'ANAPEC Morocco, Ministry of Interior 2024',
    verified: true
  },

  // ============================================
  // EASTERN EUROPE - ESTONIA
  // ============================================
  {
    countryCode: 'EST',
    countryName: 'Estonia',
    name: 'Startup Visa',
    shortName: 'Startup Visa',
    type: 'business',
    description: 'Estonian visa for entrepreneurs and startup founders. E-Residency benefits.',
    eligibilityCriteria: [
      'Innovative startup idea',
      'Evaluated and approved by Startup Committee',
      'Business plan',
      'Means of subsistence (€6,600/year)'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application to Startup Committee',
      'Business plan',
      'Pitch deck',
      'CV/team information',
      'Proof of funds',
      'Health insurance',
      'Photos'
    ],
    applicationSteps: [
      'Submit application to Startup Committee',
      'Committee evaluation (30 days)',
      'If approved, apply for visa',
      'Attend Estonian embassy',
      'Enter Estonia',
      'Register company',
      'Receive residence permit'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Committee review 30 days, then visa processing',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 100,
    costTotalEstimateUSD: 300,
    costBreakdown: {
      visa_fee: 80,
      residence_permit: 100,
      company_registration: 80,
      misc: 40
    },
    salaryMinUSD: null,
    financialProofUSD: 6600,
    approvalRate: 73.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for own startup',
    restrictions: [
      'Must run approved startup',
      'Need committee approval',
      'Minimum funds requirement',
      'Need to make progress'
    ],
    pros: [
      'Digital society (e-Residency)',
      'Startup friendly',
      'EU access',
      'English widely spoken',
      'Low costs',
      'Fast internet',
      'Growing tech scene'
    ],
    cons: [
      'Small market',
      'Cold climate',
      'Limited funding compared to major hubs',
      'Remote location',
      'Estonian language needed long-term'
    ],
    commonRejectionReasons: [
      'Weak business plan',
      'Not innovative enough',
      'Insufficient funds',
      'Committee rejection'
    ],
    officialUrl: 'https://www.startupestonia.ee/visa',
    dataSource: 'Startup Estonia, Police and Border Guard Board 2024',
    verified: true
  },

  // ============================================
  // EASTERN EUROPE - CZECH REPUBLIC
  // ============================================
  {
    countryCode: 'CZE',
    countryName: 'Czech Republic',
    name: 'Employee Card',
    shortName: 'Employee Card',
    type: 'work',
    description: 'Combined work and residence permit for employees from non-EU countries.',
    eligibilityCriteria: [
      'Job offer from Czech employer',
      'Relevant qualifications',
      'Valid employment contract',
      'No Czech/EU candidate available'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application form',
      'Employment contract',
      'Educational documents',
      'Accommodation proof',
      'Travel health insurance',
      'Criminal record certificate',
      'Photos'
    ],
    applicationSteps: [
      'Apply at Czech embassy in home country',
      'Submit all documents',
      'Attend interview',
      'Wait for decision (90-120 days)',
      'Receive employee card',
      'Enter Czech Republic',
      'Register at local office'
    ],
    processingTimeMin: 90,
    processingTimeMax: 120,
    processingTimeNote: '90-120 days standard',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 120,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      application_fee: 100,
      biometric_fee: 15,
      apostille: 100,
      health_insurance: 150,
      misc: 35
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 105,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Long processing time',
      'Czech language helpful',
      'Must apply from home country'
    ],
    pros: [
      'EU access',
      'Lower cost than Western Europe',
      'Growing tech sector (Prague)',
      'Central European location',
      'Path to permanent residence',
      'Good quality of life'
    ],
    cons: [
      'Long processing (3-4 months)',
      'Czech language barrier',
      'Bureaucracy',
      'Must apply from abroad',
      'Lower salaries than Western Europe'
    ],
    commonRejectionReasons: [
      'Incomplete documentation',
      'Invalid health insurance',
      'Missing accommodation proof',
      'Czech candidate available'
    ],
    officialUrl: 'https://www.mvcr.cz/mvcren/',
    dataSource: 'Czech Ministry of Interior 2024',
    verified: true
  },

  // ============================================
  // EASTERN EUROPE - POLAND
  // ============================================
  {
    countryCode: 'POL',
    countryName: 'Poland',
    name: 'Work Permit Type A',
    shortName: 'Type A',
    type: 'work',
    description: 'Standard Polish work permit for foreign employees.',
    eligibilityCriteria: [
      'Job offer from Polish employer',
      'Employer demonstrates no suitable Polish/EU candidate',
      'Qualifications for position',
      'Valid employment terms'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit issued to employer',
      'Employment contract',
      'Educational certificates',
      'Accommodation confirmation',
      'Health insurance',
      'Photos'
    ],
    applicationSteps: [
      'Employer applies for work permit at voivodeship office',
      'Work permit issued (30-60 days)',
      'Apply for visa at Polish consulate',
      'Enter Poland with visa',
      'Apply for residence card',
      'Collect residence card'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Work permit 30-60 days, then visa',
    validityYears: 3,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 400,
    costBreakdown: {
      work_permit_fee: 50,
      visa_fee: 100,
      residence_card: 150,
      health_insurance: 80,
      misc: 20
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 89.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Work permit process',
      'Polish language helpful',
      'Lower salaries than Western Europe'
    ],
    pros: [
      'Growing tech sector (Warsaw, Krakow)',
      'Much lower costs than Western Europe',
      'EU access',
      'Central location',
      'Path to permanent residence',
      'Improving infrastructure'
    ],
    cons: [
      'Polish language barrier',
      'Lower salaries',
      'Bureaucracy',
      'Work permit needed first',
      'Cold winters'
    ],
    commonRejectionReasons: [
      'Polish/EU candidate available',
      'Insufficient qualifications',
      'Incomplete work permit',
      'Invalid employment terms'
    ],
    officialUrl: 'https://www.gov.pl/web/udsc-en',
    dataSource: 'Polish Office for Foreigners 2024',
    verified: true
  }
];

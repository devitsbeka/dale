// ASIA-PACIFIC REGION VISA DATABASE
// Comprehensive visa information for major Asia-Pacific destinations

export const visaCategoriesAsiaPacific = [
  // ============================================
  // SINGAPORE
  // ============================================
  {
    countryCode: 'SGP',
    countryName: 'Singapore',
    name: 'Employment Pass',
    shortName: 'EP',
    type: 'work',
    description: 'Singapore\'s main work visa for foreign professionals, managers, and executives. Points-based system called COMPASS.',
    eligibilityCriteria: [
      'Job offer from Singapore employer',
      'Minimum salary S$5,000/month (S$5,500 for financial services)',
      'Acceptable qualifications',
      'COMPASS points threshold (40 points for most, 30 for some sectors)'
    ],
    requiredDocuments: [
      'Valid passport',
      'Educational certificates',
      'Detailed resume',
      'Job offer letter',
      'Company registration documents',
      'Passport-size photograph'
    ],
    applicationSteps: [
      'Employer submits EP application via Ministry of Manpower portal',
      'Pay application fee',
      'MOM reviews under COMPASS framework',
      'Receive approval or rejection (usually 3 weeks)',
      'If approved, enter Singapore',
      'Complete medical examination',
      'Complete online formalities',
      'Collect EP card'
    ],
    processingTimeMin: 10,
    processingTimeMax: 21,
    processingTimeNote: 'Usually 3 weeks, can be faster',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 225,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      application_fee: 105,
      issuance_fee: 225,
      medical_exam: 150,
      misc: 20
    },
    salaryMinUSD: 45000, // Annual estimate
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 15,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'COMPASS points requirement',
      'Salary threshold increases with age',
      'Tied to employer',
      'Must maintain employment'
    ],
    pros: [
      'Fast processing',
      'English-speaking',
      'Major financial and tech hub',
      'Low taxes',
      'Excellent infrastructure',
      'Path to PR'
    ],
    cons: [
      'Very expensive (housing)',
      'Getting more difficult (COMPASS)',
      'Hot and humid climate',
      'Small country',
      'Competitive job market'
    ],
    commonRejectionReasons: [
      'Insufficient COMPASS points',
      'Salary too low for age',
      'Weak qualifications',
      'Company not established'
    ],
    officialUrl: 'https://www.mom.gov.sg/passes-and-permits/employment-pass',
    dataSource: 'MOM Singapore, COMPASS Framework 2024',
    verified: true
  },

  {
    countryCode: 'SGP',
    countryName: 'Singapore',
    name: 'Tech.Pass',
    shortName: 'Tech.Pass',
    type: 'work',
    description: 'New visa for established tech professionals, founders, and leaders. Not tied to employer.',
    eligibilityCriteria: [
      'At least 5 years experience in tech leadership',
      'Monthly salary of at least S$20,000 in last 12 months',
      'OR founded/worked at company worth S$500M+',
      'OR significant tech achievements'
    ],
    requiredDocuments: [
      'Valid passport',
      'Proof of salary/achievements',
      'Work history',
      'Company documentation',
      'References',
      'Portfolio of work'
    ],
    applicationSteps: [
      'Apply online via Tech.Pass portal',
      'Submit evidence of eligibility',
      'Interview with assessment panel',
      'Receive decision',
      'If approved, enter Singapore',
      'Register with authorities'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Includes interview process',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 300,
    costBreakdown: {
      application_fee: 150,
      issuance_fee: 150
    },
    salaryMinUSD: 240000, // High bar
    financialProofUSD: null,
    approvalRate: 45.0,
    averageApprovalDays: 45,
    annualQuota: 500,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Not tied to employer - can work for multiple companies or be self-employed',
    restrictions: [
      'Very high qualification bar',
      'Annual quota of 500',
      'Must maintain activity in tech',
      'Need to report activities'
    ],
    pros: [
      'Not tied to employer',
      'Can work for multiple companies',
      'Can start own company',
      'Prestigious',
      'Family included'
    ],
    cons: [
      'Extremely competitive',
      'Very high requirements',
      'Small quota',
      'Interview required',
      'No clear path to PR through Tech.Pass'
    ],
    commonRejectionReasons: [
      'Insufficient experience/achievements',
      'Salary too low',
      'Weak portfolio',
      'Interview performance',
      'Quota full'
    ],
    officialUrl: 'https://www.edb.gov.sg/techpass',
    dataSource: 'EDB Singapore, Tech.Pass Program 2024',
    verified: true
  },

  // ============================================
  // JAPAN
  // ============================================
  {
    countryCode: 'JPN',
    countryName: 'Japan',
    name: 'Highly Skilled Professional Visa',
    shortName: 'HSP Visa',
    type: 'work',
    description: 'Points-based visa for highly skilled foreign professionals. Fast track to permanent residence.',
    eligibilityCriteria: [
      'Score 70+ points in points system',
      'Points based on: academic background, salary, age, work experience, Japanese language',
      'Job offer or business plan in Japan'
    ],
    requiredDocuments: [
      'Valid passport',
      'Certificate of Eligibility (COE)',
      'Educational certificates',
      'Work experience proof',
      'Salary documentation',
      'Points calculation table',
      'Photograph'
    ],
    applicationSteps: [
      'Employer or applicant applies for Certificate of Eligibility at Immigration',
      'Calculate points (70+ required)',
      'Submit supporting documents',
      'Receive COE (1-3 months)',
      'Apply for visa at Japanese embassy',
      'Enter Japan',
      'Register at local ward office',
      'Receive residence card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'COE processing usually 1-3 months',
    validityYears: 5,
    renewalPossible: true,
    costApplicationUSD: 30,
    costTotalEstimateUSD: 200,
    costBreakdown: {
      visa_fee: 30,
      coe_application: 0,
      translations: 100,
      misc: 70
    },
    salaryMinUSD: 40000,
    financialProofUSD: null,
    approvalRate: 94.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work in professional field, can do side work',
    restrictions: [
      'Must maintain 70 points',
      'Need to score high on points',
      'Activities must match visa category'
    ],
    pros: [
      'Fast track to permanent residence (1-3 years vs 10 years)',
      'Spouse can work',
      'Can bring parents/domestic help',
      '5-year visa from start',
      'Simplified immigration procedures',
      'Priority processing'
    ],
    cons: [
      'Japanese language very helpful',
      'Points system can be complex',
      'High cost of living',
      'Work culture challenges',
      'Salary requirements'
    ],
    commonRejectionReasons: [
      'Insufficient points',
      'Invalid documentation',
      'Salary not meeting requirements',
      'Educational credentials not recognized'
    ],
    officialUrl: 'https://www.moj.go.jp/isa/publications/materials/newimmiact_3_system_index.html',
    dataSource: 'Immigration Services Agency Japan, MOFA 2024',
    verified: true
  },

  // ============================================
  // AUSTRALIA
  // ============================================
  {
    countryCode: 'AUS',
    countryName: 'Australia',
    name: 'Skilled Independent Visa (Subclass 189)',
    shortName: 'Subclass 189',
    type: 'work',
    description: 'Points-based permanent residence visa for skilled workers. No employer sponsorship required.',
    eligibilityCriteria: [
      'Occupation on skilled occupation list',
      'Positive skills assessment',
      'Score 65+ points',
      'Age under 45',
      'English proficiency (IELTS 6+ or equivalent)',
      'Expression of Interest (EOI) invitation'
    ],
    requiredDocuments: [
      'Valid passport',
      'Skills assessment',
      'English test results',
      'Work reference letters',
      'Educational documents',
      'Police certificates',
      'Medical examinations',
      'Evidence of points claimed'
    ],
    applicationSteps: [
      'Have skills assessed by relevant assessing authority',
      'Take English test',
      'Submit Expression of Interest (EOI) via SkillSelect',
      'Wait for invitation (based on points)',
      'Lodge visa application online',
      'Provide biometrics',
      'Complete medical exams',
      'Wait for decision',
      'Enter Australia as permanent resident'
    ],
    processingTimeMin: 180,
    processingTimeMax: 365,
    processingTimeNote: '75% processed in 6-10 months',
    validityYears: null, // Permanent
    renewalPossible: false,
    costApplicationUSD: 4640,
    costTotalEstimateUSD: 7000,
    costBreakdown: {
      visa_application: 4640,
      skills_assessment: 800,
      english_test: 385,
      medical_exams: 500,
      police_checks: 200,
      translations: 300,
      misc: 175
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 91.0,
    averageApprovalDays: 240,
    annualQuota: 16652,
    pathToPermanence: true, // It is PR
    familyIncluded: true,
    workRights: 'Full work rights anywhere in Australia',
    restrictions: [
      'Competitive points system',
      'Need invitation',
      'Age limit',
      'Occupation must be on list'
    ],
    pros: [
      'Permanent residence immediately',
      'No employer sponsorship needed',
      'Can work anywhere',
      'Path to citizenship after 4 years',
      'High quality of life',
      'Excellent social benefits',
      'Family included'
    ],
    cons: [
      'Very competitive (need high points)',
      'Long processing times',
      'Expensive',
      'Skills assessment can be difficult',
      'Age limit (under 45)',
      'Invitation system uncertain'
    ],
    commonRejectionReasons: [
      'Insufficient points',
      'Skills assessment issues',
      'English not meeting standard',
      'Health or character concerns',
      'Incomplete documentation'
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',
    dataSource: 'Department of Home Affairs Australia 2024',
    verified: true
  },

  {
    countryCode: 'AUS',
    countryName: 'Australia',
    name: 'Temporary Skill Shortage Visa (Subclass 482)',
    shortName: 'TSS 482',
    type: 'work',
    description: 'Employer-sponsored temporary work visa. Faster than permanent visas with path to PR.',
    eligibilityCriteria: [
      'Employer sponsorship',
      'Occupation on relevant skilled occupation list',
      'At least 2 years work experience',
      'Skills assessment (some occupations)',
      'English proficiency',
      'Market salary rate'
    ],
    requiredDocuments: [
      'Valid passport',
      'Employer nomination',
      'Skills assessment (if required)',
      'English test results',
      'Work experience evidence',
      'Educational qualifications',
      'Health insurance',
      'Police certificates'
    ],
    applicationSteps: [
      'Employer applies for sponsorship approval',
      'Employer nominates position',
      'Apply for visa',
      'Medical examinations',
      'Biometrics',
      'Wait for decision',
      'Enter Australia'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Usually 2-4 months for most',
    validityYears: 4,
    renewalPossible: true,
    costApplicationUSD: 3060,
    costTotalEstimateUSD: 5000,
    costBreakdown: {
      visa_application: 3060,
      sponsorship_fee: 420,
      nomination_fee: 540,
      english_test: 385,
      medical: 500,
      misc: 95
    },
    salaryMinUSD: 70000,
    financialProofUSD: null,
    approvalRate: 89.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Occupation must be on list',
      'Age considerations for PR pathway',
      'Medium-term stream has clearer PR path'
    ],
    pros: [
      'Faster than PR visa',
      'Employer sponsored',
      'Path to PR after 3 years',
      'Family included',
      'Can study'
    ],
    cons: [
      'Tied to employer',
      'Expensive',
      'English requirements',
      'Occupation list restrictions',
      'Market salary rate required'
    ],
    commonRejectionReasons: [
      'Occupation not on list',
      'Insufficient English',
      'Salary below market rate',
      'Work experience inadequate',
      'Health or character issues'
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482',
    dataSource: 'Department of Home Affairs Australia 2024',
    verified: true
  },

  // ============================================
  // NEW ZEALAND
  // ============================================
  {
    countryCode: 'NZL',
    countryName: 'New Zealand',
    name: 'Skilled Migrant Category Resident Visa',
    shortName: 'SMC Visa',
    type: 'work',
    description: 'Points-based permanent residence for skilled workers. One of the most attractive immigration programs globally.',
    eligibilityCriteria: [
      'Age 55 or under',
      'Score 6+ points on 6-point scale',
      'Skilled employment or job offer in NZ',
      'Recognized qualification',
      'English proficiency',
      'Good health and character'
    ],
    requiredDocuments: [
      'Valid passport',
      'Expression of Interest',
      'Qualification certificates',
      'English test results (IELTS)',
      'Employment contract or job offer',
      'Police certificates',
      'Medical certificates',
      'Evidence of work experience'
    ],
    applicationSteps: [
      'Submit Expression of Interest (EOI) online',
      'If selected, receive Invitation to Apply (ITA)',
      'Lodge full application within 4 months',
      'Provide all supporting documents',
      'Medical and police checks',
      'Wait for decision',
      'Receive resident visa',
      'Travel to NZ within visa validity'
    ],
    processingTimeMin: 90,
    processingTimeMax: 180,
    processingTimeNote: 'EOI to decision usually 6-12 months total',
    validityYears: null, // Permanent
    renewalPossible: false,
    costApplicationUSD: 3400,
    costTotalEstimateUSD: 5000,
    costBreakdown: {
      eoi_fee: 630,
      visa_application: 3400,
      english_test: 385,
      medical_exams: 350,
      police_certificates: 150,
      misc: 85
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 87.0,
    averageApprovalDays: 150,
    annualQuota: 51000,
    pathToPermanence: true, // It is PR
    familyIncluded: true,
    workRights: 'Full work rights throughout New Zealand',
    restrictions: [
      'Age limit (55)',
      'Points system',
      'Need skilled employment',
      'Occupation may need registration'
    ],
    pros: [
      'Permanent residence immediately',
      'No employer tie',
      'Beautiful country',
      'High quality of life',
      'English speaking',
      'Path to citizenship after 5 years',
      'Welcoming to immigrants'
    ],
    cons: [
      'Remote location',
      'Smaller economy',
      'Lower salaries than Australia',
      'Cost of living increasing',
      'Limited flights'
    ],
    commonRejectionReasons: [
      'Insufficient points',
      'Occupation not skilled enough',
      'English not meeting standard',
      'Health or character issues',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.immigration.govt.nz/new-zealand-visas/options/work/long-term-skill-shortage-list-work-visa',
    dataSource: 'Immigration New Zealand 2024',
    verified: true
  },

  // ============================================
  // SOUTH KOREA
  // ============================================
  {
    countryCode: 'KOR',
    countryName: 'South Korea',
    name: 'E-7 Skilled Worker Visa',
    shortName: 'E-7',
    type: 'work',
    description: 'Work visa for foreign nationals with professional skills in various fields including IT, engineering, and education.',
    eligibilityCriteria: [
      'Bachelor\'s degree or higher OR relevant work experience',
      'Job offer from Korean company',
      'Occupation qualifies as "specified professional"',
      'Company meets requirements'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form',
      'Passport photo',
      'Employment contract',
      'Educational certificates',
      'Company business registration',
      'Diploma/degree',
      'Criminal background check'
    ],
    applicationSteps: [
      'Secure job offer from Korean employer',
      'Gather all required documents',
      'Apply at Korean embassy/consulate',
      'Submit documents and pay fee',
      'Interview if required',
      'Receive visa decision',
      'Enter Korea',
      'Register at immigration office'
    ],
    processingTimeMin: 7,
    processingTimeMax: 30,
    processingTimeNote: 'Usually 1-2 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 80,
    costTotalEstimateUSD: 300,
    costBreakdown: {
      visa_fee: 80,
      notarization: 100,
      translations: 80,
      misc: 40
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 14,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work in specified professional field',
    restrictions: [
      'Tied to professional field',
      'Need company sponsorship',
      'Korean language helpful but not required'
    ],
    pros: [
      'Fast processing',
      'Growing tech sector',
      'Good quality of life',
      'Path to permanent residence (F-5)',
      'Family can join',
      'Reasonable costs'
    ],
    cons: [
      'Korean language barrier',
      'Competitive job market',
      'Work culture can be intense',
      'Initial visa only 1-2 years'
    ],
    commonRejectionReasons: [
      'Insufficient qualifications',
      'Company not meeting requirements',
      'Incomplete documentation',
      'Job not qualifying as professional'
    ],
    officialUrl: 'https://www.hikorea.go.kr',
    dataSource: 'Korea Immigration Service, MOFA 2024',
    verified: true
  },

  // ============================================
  // UNITED ARAB EMIRATES
  // ============================================
  {
    countryCode: 'ARE',
    countryName: 'United Arab Emirates',
    name: 'Employment Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Standard employment visa for professionals working in the UAE. Sponsored by employer.',
    eligibilityCriteria: [
      'Job offer from UAE employer',
      'Bachelor degree or equivalent qualification',
      'Clean medical examination',
      'No criminal record',
      'Employer has approved labor quota'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Passport photos',
      'Educational certificates (attested)',
      'Employment contract',
      'Medical fitness certificate',
      'UAE entry permit',
      'Emirates ID application'
    ],
    applicationSteps: [
      'Employer applies for employment permit',
      'Receive entry permit',
      'Enter UAE',
      'Complete medical examination',
      'Submit Emirates ID application',
      'Complete visa stamping',
      'Receive residence visa and Emirates ID'
    ],
    processingTimeMin: 14,
    processingTimeMax: 30,
    processingTimeNote: 'Usually 2-4 weeks total process',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 1200,
    costTotalEstimateUSD: 2000,
    costBreakdown: {
      entry_permit: 300,
      visa_stamping: 300,
      medical_test: 200,
      emirates_id: 400,
      typing_center_fees: 200,
      misc: 600
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 92.0,
    averageApprovalDays: 21,
    annualQuota: null,
    pathToPermanence: false, // UAE recently introduced Golden Visa for some
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer only',
    restrictions: [
      'Tied to employer',
      'Cannot change jobs without new visa',
      'Must cancel visa before leaving if ending employment',
      'Alcohol restrictions apply'
    ],
    pros: [
      'No income tax',
      'High salaries',
      'Modern infrastructure',
      'Safe environment',
      'International community',
      'Strategic location (Dubai/Abu Dhabi)'
    ],
    cons: [
      'Very expensive (especially Dubai)',
      'Tied to employer',
      'Hot climate',
      'Limited path to permanent residence',
      'Cultural adjustments'
    ],
    commonRejectionReasons: [
      'Medical fitness issues',
      'Invalid documents',
      'Employer quota issues',
      'Criminal record'
    ],
    officialUrl: 'https://u.ae/en/information-and-services/visa-and-emirates-id/work-visa',
    dataSource: 'UAE Federal Authority for Identity, Citizenship, Customs & Port Security 2024',
    verified: true
  },

  {
    countryCode: 'ARE',
    countryName: 'United Arab Emirates',
    name: 'Golden Visa - Skilled Professionals',
    shortName: 'Golden Visa',
    type: 'work',
    description: 'Long-term residency for skilled professionals, investors, and exceptional talents. Not tied to employer.',
    eligibilityCriteria: [
      'Monthly salary of AED 30,000+ OR',
      'Doctoral degree OR',
      'Master\'s degree with 2.0+ GPA from top universities OR',
      'Specialized talent in priority fields'
    ],
    requiredDocuments: [
      'Valid passport',
      'Salary certificate or employment contract',
      'Educational certificates (attested)',
      'Medical fitness certificate',
      'Passport photos',
      'Health insurance'
    ],
    applicationSteps: [
      'Apply for Golden Visa nomination online',
      'Submit supporting documents',
      'Receive approval',
      'Complete medical examination',
      'Submit visa application',
      'Collect Golden Visa'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Varies by category and emirate',
    validityYears: 10,
    renewalPossible: true,
    costApplicationUSD: 3000,
    costTotalEstimateUSD: 4500,
    costBreakdown: {
      visa_fee: 2750,
      medical_exam: 300,
      emirates_id: 400,
      typing_services: 250,
      misc: 800
    },
    salaryMinUSD: 100000, // AED 30k/month minimum
    financialProofUSD: null,
    approvalRate: 78.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: false, // But 10-year renewable visa
    familyIncluded: true,
    workRights: 'Not tied to employer - can work freely',
    restrictions: [
      'High income or qualification requirements',
      'Must maintain eligibility criteria',
      'Must spend time in UAE'
    ],
    pros: [
      '10-year validity',
      'Not tied to employer',
      'Can sponsor family',
      'No sponsor needed',
      'Can stay outside UAE for extended periods',
      'Multiple entry'
    ],
    cons: [
      'Very high income requirement',
      'Expensive to obtain',
      'Strict eligibility',
      'Not guaranteed permanent residence',
      'Must renew after 10 years'
    ],
    commonRejectionReasons: [
      'Salary below threshold',
      'Degree not from recognized university',
      'Insufficient documentation',
      'Not meeting specialized talent criteria'
    ],
    officialUrl: 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/long-term-residence-visas-in-the-uae',
    dataSource: 'UAE Government Portal, ICP 2024',
    verified: true
  },

  // ============================================
  // THAILAND
  // ============================================
  {
    countryCode: 'THA',
    countryName: 'Thailand',
    name: 'Non-B Work Visa and Work Permit',
    shortName: 'Non-B',
    type: 'work',
    description: 'Standard work visa for foreigners employed by Thai companies or working as self-employed.',
    eligibilityCriteria: [
      'Job offer from registered Thai company',
      'Company meets foreign employee ratio requirements',
      'Bachelor degree or work experience',
      'Company has proper capitalization'
    ],
    requiredDocuments: [
      'Valid passport (6+ months validity)',
      'Passport photos',
      'Employment contract',
      'Educational certificates',
      'Company documents',
      'Medical certificate',
      'Criminal background check'
    ],
    applicationSteps: [
      'Apply for Non-B visa at Thai embassy',
      'Enter Thailand with Non-B visa',
      'Company applies for work permit at Ministry of Labor',
      'Submit all documents for work permit',
      'Receive work permit',
      'Convert tourist/non-B to extension of stay based on work'
    ],
    processingTimeMin: 14,
    processingTimeMax: 60,
    processingTimeNote: 'Visa quick, work permit 2-4 weeks',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 500,
    costBreakdown: {
      visa_fee: 80,
      work_permit_fee: 100,
      extension_of_stay: 60,
      notarization: 150,
      misc: 110
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 91.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer in specified role',
    restrictions: [
      'Tied to employer',
      'Annual renewal required',
      'Company must meet Thai employee ratio',
      '90-day reporting required'
    ],
    pros: [
      'Affordable cost of living',
      'Great weather and beaches',
      'Growing expat community',
      'Good food and culture',
      'Central Asia location',
      'Path to permanent residence after 3+ years'
    ],
    cons: [
      'Annual renewal',
      'Bureaucratic process',
      'Thai language barrier',
      '90-day reporting',
      'Company ratio requirements can be limiting'
    ],
    commonRejectionReasons: [
      'Company not meeting requirements',
      'Insufficient Thai employee ratio',
      'Invalid documents',
      'Company capitalization issues'
    ],
    officialUrl: 'https://www.doe.go.th/prd/main/en',
    dataSource: 'Ministry of Labor Thailand, Immigration Bureau 2024',
    verified: true
  },

  // ============================================
  // HONG KONG
  // ============================================
  {
    countryCode: 'HKG',
    countryName: 'Hong Kong',
    name: 'General Employment Policy (GEP) Visa',
    shortName: 'GEP',
    type: 'work',
    description: 'Standard employment visa for foreign professionals coming to work in Hong Kong.',
    eligibilityCriteria: [
      'Job offer from Hong Kong company',
      'Relevant academic qualifications (usually degree)',
      'Relevant work experience',
      'Market salary level',
      'No security objection',
      'Employer demonstrates no suitable local candidate'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application form ID990A',
      'Passport photograph',
      'Educational certificates',
      'Work experience letters',
      'Employment contract',
      'Company business registration',
      'Employer supporting letter'
    ],
    applicationSteps: [
      'Employer submits visa application to Immigration Department',
      'Submit all supporting documents',
      'Immigration reviews application',
      'Receive approval-in-principle (usually 4-6 weeks)',
      'Collect visa label at Immigration or HK embassy',
      'Enter Hong Kong',
      'Activate visa'
    ],
    processingTimeMin: 28,
    processingTimeMax: 42,
    processingTimeNote: 'Usually 4-6 weeks',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 25,
    costTotalEstimateUSD: 200,
    costBreakdown: {
      visa_fee: 25,
      notarization: 100,
      courier: 50,
      misc: 25
    },
    salaryMinUSD: 40000,
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 35,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer initially',
      'Market salary requirement',
      'After 7 years can get permanent residence'
    ],
    pros: [
      'Major financial hub',
      'Low taxes',
      'International city',
      'English widely used',
      'Path to permanent residence after 7 years',
      'Strategic location',
      'Fast processing'
    ],
    cons: [
      'Extremely expensive (housing)',
      'Small living spaces',
      'Competitive job market',
      'Pollution',
      'Political uncertainty'
    ],
    commonRejectionReasons: [
      'Employer unable to justify need',
      'Salary not at market rate',
      'Insufficient qualifications',
      'Company issues',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.immd.gov.hk/eng/services/visas/general_employment_policy.html',
    dataSource: 'Hong Kong Immigration Department 2024',
    verified: true
  },

  // ============================================
  // TAIWAN
  // ============================================
  {
    countryCode: 'TWN',
    countryName: 'Taiwan',
    name: 'Employment Gold Card',
    shortName: 'Gold Card',
    type: 'work',
    description: 'Combined work permit and residence visa for foreign professionals in specific fields. Not tied to employer.',
    eligibilityCriteria: [
      'Professional in one of 8 fields (tech, economy, education, culture & arts, sport, finance, law, architecture)',
      'Meet salary threshold OR achievements/awards OR professional recognition',
      'No employer needed'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application form',
      'Passport photos',
      'Educational certificates',
      'Work experience documentation',
      'Salary proof or achievement evidence',
      'Professional references',
      'Portfolio (field dependent)'
    ],
    applicationSteps: [
      'Apply online via Gold Card portal',
      'Upload all documents',
      'Pay application fee',
      'Review by relevant ministries (30 days)',
      'If approved, receive approval letter',
      'Collect Gold Card at TECO or in Taiwan',
      'Register at local household office'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: '30 days standard, often faster for tech',
    validityYears: 3,
    renewalPossible: true,
    costApplicationUSD: 100,
    costTotalEstimateUSD: 300,
    costBreakdown: {
      application_fee: 100,
      notarization: 100,
      translations: 80,
      misc: 20
    },
    salaryMinUSD: 60000,
    financialProofUSD: null,
    approvalRate: 76.0,
    averageApprovalDays: 30,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Full work authorization - not tied to employer',
    restrictions: [
      'Must work in approved field',
      'Need to meet qualification standards',
      'Initial review can be subjective'
    ],
    pros: [
      'Not tied to employer',
      'Combined work permit and ARC',
      '3-year validity from start',
      'Fast processing',
      'Can work freelance',
      'Tax incentives available',
      'Path to permanent residence',
      'Growing tech sector'
    ],
    cons: [
      'Subjective approval criteria',
      'Mandarin Chinese helpful',
      'Smaller economy than neighbors',
      'Political situation',
      'International recognition challenges'
    ],
    commonRejectionReasons: [
      'Insufficient professional achievements',
      'Field not matching approved categories',
      'Salary below threshold without compensating achievements',
      'Weak documentation'
    ],
    officialUrl: 'https://goldcard.nat.gov.tw',
    dataSource: 'National Development Council Taiwan, Gold Card Office 2024',
    verified: true
  },

  // ============================================
  // MALAYSIA
  // ============================================
  {
    countryCode: 'MYS',
    countryName: 'Malaysia',
    name: 'Employment Pass',
    shortName: 'EP',
    type: 'work',
    description: 'Work permit for foreign professionals and skilled workers employed in Malaysia.',
    eligibilityCriteria: [
      'Job offer from Malaysian company',
      'Minimum monthly salary RM5,000 (higher in some sectors)',
      'Bachelor degree or relevant experience',
      'Company meets foreign worker quota'
    ],
    requiredDocuments: [
      'Valid passport',
      'Passport photographs',
      'Educational certificates',
      'Employment contract',
      'CV/resume',
      'Company registration documents',
      'Medical examination report',
      'Passport-size photo with blue background'
    ],
    applicationSteps: [
      'Employer applies for Employment Pass via ESD portal',
      'Submit all required documents',
      'Immigration reviews (2-4 weeks)',
      'Receive approval letter',
      'Enter Malaysia with approval letter',
      'Complete medical examination in Malaysia',
      'Submit for pass issuance',
      'Collect Employment Pass'
    ],
    processingTimeMin: 14,
    processingTimeMax: 60,
    processingTimeNote: 'Usually 2-4 weeks for approval',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 600,
    costBreakdown: {
      processing_fee: 145,
      pass_fee: 225,
      medical_exam: 100,
      notarization: 80,
      misc: 50
    },
    salaryMinUSD: 14400, // RM 5000/month minimum
    financialProofUSD: null,
    approvalRate: 87.0,
    averageApprovalDays: 28,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Tied to employer',
      'Minimum salary requirements',
      'Foreign worker quota',
      'Cannot work in certain sectors'
    ],
    pros: [
      'Affordable cost of living',
      'English widely spoken',
      'Good food and culture',
      'Strategic location',
      'Growing economy',
      'Path to permanent residence after 10 years'
    ],
    cons: [
      'Bureaucratic processes',
      'Tied to employer',
      'Lower salaries than Singapore',
      'Quota system can be restrictive',
      'Permanent residence very difficult'
    ],
    commonRejectionReasons: [
      'Salary below minimum',
      'Company quota exceeded',
      'Invalid qualifications',
      'Incomplete documentation',
      'Sector restrictions'
    ],
    officialUrl: 'https://esd.imi.gov.my',
    dataSource: 'Immigration Department of Malaysia 2024',
    verified: true
  }
];

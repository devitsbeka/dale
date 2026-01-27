export const visaCategoriesData = [
  // ============================================
  // UNITED STATES
  // ============================================
  {
    countryCode: 'USA',
    countryName: 'United States',
    name: 'H-1B Specialty Occupation',
    shortName: 'H-1B',
    type: 'work',
    description: 'The H-1B visa allows U.S. employers to temporarily employ foreign workers in specialty occupations that require theoretical or technical expertise. It is one of the most common work visas for tech professionals, engineers, and other skilled workers.',
    eligibilityCriteria: [
      "Bachelor's degree or higher (or equivalent experience)",
      'Job offer from U.S. employer in specialty occupation',
      'Position requires specialized knowledge',
      'Employer must file Labor Condition Application (LCA)'
    ],
    requiredDocuments: [
      'Valid passport',
      'Form I-129 petition (filed by employer)',
      'Educational credentials evaluation',
      'Job offer letter',
      'LCA approval',
      'Resume/CV',
      'Employer support letter'
    ],
    applicationSteps: [
      'Employer files Labor Condition Application (LCA) with Department of Labor',
      'Employer submits Form I-129 petition to USCIS',
      'If selected in lottery (if cap-subject), USCIS reviews petition',
      'USCIS approves or denies petition',
      'If approved, applicant applies for H-1B visa at US consulate',
      'Visa interview at US embassy/consulate',
      'Enter United States with H-1B visa'
    ],
    processingTimeMin: 60,
    processingTimeMax: 180,
    processingTimeNote: 'Premium processing available for 15-day processing at additional cost',
    validityYears: 3,
    renewalPossible: true,
    costApplicationUSD: 460,
    costTotalEstimateUSD: 5000,
    costBreakdown: {
      base_filing_fee: 460,
      fraud_prevention_fee: 500,
      public_law_fee: 750,
      premium_processing: 2500,
      attorney_fees: 3000,
      visa_application_fee: 190
    },
    salaryMinUSD: 60000,
    financialProofUSD: null,
    approvalRate: 84.5,
    averageApprovalDays: 120,
    annualQuota: 85000,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work only for sponsoring employer. Can change employers with new H-1B transfer.',
    restrictions: [
      'Cannot work for employers other than sponsor',
      'Must maintain specialty occupation role',
      'Subject to annual cap (lottery system)',
      'Must leave US if employment ends (60-day grace period)'
    ],
    pros: [
      'Dual intent - can apply for green card',
      'Spouse (H-4) can obtain work authorization',
      'Can be renewed up to 6 years total',
      'Premium processing available',
      'Allows path to permanent residence'
    ],
    cons: [
      'Subject to lottery system (only ~30% selected)',
      'Employer-dependent (tied to sponsor)',
      'Long processing times without premium',
      'Cannot easily switch jobs',
      'High costs for employer and employee'
    ],
    commonRejectionReasons: [
      'Specialty occupation not sufficiently proven',
      'Insufficient educational credentials',
      'Employer unable to demonstrate financial ability',
      'Wage level not meeting prevailing wage requirements',
      'RFE not properly responded to'
    ],
    officialUrl: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations',
    dataSource: 'USCIS.gov, USCIS H-1B Statistical Reports 2023',
    verified: true
  },

  {
    countryCode: 'USA',
    countryName: 'United States',
    name: 'L-1 Intracompany Transfer',
    shortName: 'L-1',
    type: 'work',
    description: 'The L-1 visa enables multinational companies to transfer executives, managers, and employees with specialized knowledge from foreign offices to U.S. offices. No lottery required.',
    eligibilityCriteria: [
      'Must have worked for company abroad for at least 1 year in past 3 years',
      'Transferring to U.S. office of same company',
      'Position must be managerial, executive, or require specialized knowledge',
      'Company must have qualifying relationship (parent, subsidiary, affiliate)'
    ],
    requiredDocuments: [
      'Valid passport',
      'Form I-129 petition',
      'Employment letter from foreign office',
      'Organizational charts',
      'Proof of company relationship',
      'Job description',
      'Resume/CV'
    ],
    applicationSteps: [
      'Employer files Form I-129 with USCIS',
      'USCIS reviews and approves/denies petition',
      'If approved, applicant applies for L-1 visa at consulate',
      'Attend visa interview',
      'Enter United States with L-1 visa'
    ],
    processingTimeMin: 45,
    processingTimeMax: 120,
    processingTimeNote: 'Premium processing available for 15-day processing',
    validityYears: 5,
    renewalPossible: true,
    costApplicationUSD: 460,
    costTotalEstimateUSD: 3500,
    costBreakdown: {
      base_filing_fee: 460,
      fraud_prevention_fee: 500,
      premium_processing: 2500,
      attorney_fees: 2500,
      visa_application_fee: 190
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 87.2,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work only for sponsoring employer and its affiliates',
    restrictions: [
      'Must maintain employment with transferring company',
      'Cannot work for unrelated employers',
      'Limited to 7 years for L-1A, 5 years for L-1B'
    ],
    pros: [
      'No lottery or annual cap',
      'Dual intent allowed',
      'Faster processing than H-1B',
      'L-2 spouse can work with EAD',
      'Can lead to green card'
    ],
    cons: [
      'Must have worked abroad for 1 year',
      'Tied to specific employer',
      'Requires established company relationship',
      'Cannot easily change employers'
    ],
    commonRejectionReasons: [
      'Insufficient proof of company relationship',
      'Position does not qualify as managerial/executive',
      'Failed to demonstrate specialized knowledge',
      'Insufficient time worked abroad'
    ],
    officialUrl: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager',
    dataSource: 'USCIS.gov, State Department Visa Statistics 2023',
    verified: true
  },

  {
    countryCode: 'USA',
    countryName: 'United States',
    name: 'O-1 Extraordinary Ability',
    shortName: 'O-1',
    type: 'work',
    description: 'The O-1 visa is for individuals with extraordinary ability in sciences, arts, education, business, athletics, or extraordinary achievement in motion picture/TV. No cap or lottery.',
    eligibilityCriteria: [
      'Extraordinary ability demonstrated by sustained national/international acclaim',
      'Recognition significantly above ordinary in field',
      'Evidence of achievements (awards, publications, media coverage)',
      'Job offer or contract in U.S. in area of expertise'
    ],
    requiredDocuments: [
      'Valid passport',
      'Form I-129 petition',
      'Evidence of extraordinary ability (awards, publications, patents)',
      'Letters of recommendation from experts',
      'Media coverage',
      'Contract or job offer',
      'Detailed itinerary'
    ],
    applicationSteps: [
      'Employer or agent files Form I-129 with USCIS',
      'Submit extensive evidence of extraordinary ability',
      'USCIS reviews petition',
      'If approved, apply for O-1 visa at consulate',
      'Visa interview',
      'Enter United States'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Premium processing available for 15 days',
    validityYears: 3,
    renewalPossible: true,
    costApplicationUSD: 460,
    costTotalEstimateUSD: 6000,
    costBreakdown: {
      base_filing_fee: 460,
      premium_processing: 2500,
      attorney_fees: 5000,
      visa_application_fee: 190
    },
    salaryMinUSD: null,
    financialProofUSD: null,
    approvalRate: 91.5,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for multiple employers with proper authorization',
    restrictions: [
      'Must maintain extraordinary ability status',
      'Activities must be in area of expertise',
      'Requires substantial documentation'
    ],
    pros: [
      'No lottery or annual cap',
      'High approval rate',
      'Can work for multiple employers',
      'O-3 dependents can accompany',
      'Indefinite renewals possible',
      'Path to green card'
    ],
    cons: [
      'High bar for qualification',
      'Extensive documentation required',
      'Higher legal costs',
      'Subjective evaluation criteria'
    ],
    commonRejectionReasons: [
      'Insufficient evidence of extraordinary ability',
      'Awards/recognition not significant enough',
      'Lack of sustained national/international acclaim',
      'Weak recommendation letters'
    ],
    officialUrl: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement',
    dataSource: 'USCIS.gov, Immigration Attorney Data 2023',
    verified: true
  },

  // ============================================
  // CANADA
  // ============================================
  {
    countryCode: 'CAN',
    countryName: 'Canada',
    name: 'Express Entry - Federal Skilled Worker',
    shortName: 'Express Entry',
    type: 'work',
    description: 'Express Entry is Canada\'s main pathway to permanent residence for skilled workers. It uses a points-based Comprehensive Ranking System (CRS) to rank candidates.',
    eligibilityCriteria: [
      'At least 1 year continuous work experience in skilled occupation (NOC TEER 0, 1, 2, or 3)',
      'Language proficiency (CLB 7 minimum for NOC 0 or 1)',
      'Canadian equivalency for foreign education',
      'Proof of funds (unless working in Canada)',
      'Admissibility to Canada'
    ],
    requiredDocuments: [
      'Valid passport',
      'Language test results (IELTS or CELPIP)',
      'Educational Credential Assessment (ECA)',
      'Work experience letters',
      'Proof of funds',
      'Police certificates',
      'Medical exam'
    ],
    applicationSteps: [
      'Create Express Entry profile online',
      'Receive CRS score',
      'Wait for Invitation to Apply (ITA)',
      'Submit complete application within 60 days',
      'Provide biometrics',
      'Wait for application processing',
      'Receive Confirmation of Permanent Residence (COPR)',
      'Land in Canada as permanent resident'
    ],
    processingTimeMin: 180,
    processingTimeMax: 270,
    processingTimeNote: '6 months is the standard processing time for complete applications',
    validityYears: null, // Permanent residence
    renewalPossible: false,
    costApplicationUSD: 1365,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      application_fee: 850,
      right_of_permanent_residence_fee: 515,
      biometrics: 85,
      language_test: 300,
      eca: 200,
      medical_exam: 300,
      police_certificates: 150
    },
    salaryMinUSD: null,
    financialProofUSD: 13310, // For single applicant
    approvalRate: 92.0,
    averageApprovalDays: 210,
    annualQuota: 110000,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Full work authorization anywhere in Canada',
    restrictions: [
      'Must meet minimum CRS score cutoff',
      'Must maintain Express Entry profile',
      'Need to accept ITA within timeframe'
    ],
    pros: [
      'Direct path to permanent residence',
      'No job offer required',
      'Fast processing (6 months)',
      'Can include family',
      'Full work rights',
      'Access to healthcare and benefits'
    ],
    cons: [
      'Competitive - need high CRS score',
      'Language requirements can be challenging',
      'Need proof of funds',
      'Age limit considerations (points decrease after 29)'
    ],
    commonRejectionReasons: [
      'Insufficient language scores',
      'Work experience not meeting NOC requirements',
      'Incomplete documentation',
      'Inadmissibility issues',
      'Failed to respond to requests in time'
    ],
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
    dataSource: 'IRCC.gc.ca, Express Entry Year-End Reports 2023',
    verified: true
  },

  // ============================================
  // UNITED KINGDOM
  // ============================================
  {
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    name: 'Skilled Worker Visa',
    shortName: 'Skilled Worker',
    type: 'work',
    description: 'The Skilled Worker visa allows UK employers to sponsor skilled workers from overseas. Replaced the Tier 2 (General) work visa.',
    eligibilityCriteria: [
      'Job offer from UK employer with valid sponsor license',
      'Job must be on eligible occupations list',
      'Meet minimum salary threshold (£26,200 or going rate, whichever is higher)',
      'English language requirement (B1 level)',
      'Certificate of Sponsorship from employer'
    ],
    requiredDocuments: [
      'Valid passport',
      'Certificate of Sponsorship reference number',
      'Proof of English language proficiency',
      'Proof of savings (£1,270 for at least 28 days)',
      'Tuberculosis test results',
      'Criminal record certificate'
    ],
    applicationSteps: [
      'Secure job offer from licensed UK sponsor',
      'Employer issues Certificate of Sponsorship',
      'Apply online for Skilled Worker visa',
      'Pay visa fee and immigration health surcharge',
      'Provide biometrics',
      'Attend visa appointment if required',
      'Wait for decision',
      'Travel to UK if approved'
    ],
    processingTimeMin: 21,
    processingTimeMax: 90,
    processingTimeNote: 'Priority service available for faster processing',
    validityYears: 5,
    renewalPossible: true,
    costApplicationUSD: 1639,
    costTotalEstimateUSD: 4500,
    costBreakdown: {
      visa_application_fee: 1639,
      immigration_health_surcharge: 1248, // £624/year x 2 years min
      priority_service: 640,
      english_test: 215,
      tuberculosis_test: 120,
      biometrics: 85
    },
    salaryMinUSD: 33000,
    financialProofUSD: 1600,
    approvalRate: 94.8,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer in sponsored role',
    restrictions: [
      'Must work for sponsoring employer',
      'Cannot claim public funds',
      'Must notify UKVI of job changes',
      'Minimum salary requirements'
    ],
    pros: [
      'Path to settlement after 5 years',
      'Can bring family',
      'Can switch employers with new sponsorship',
      'Priority processing available',
      'Access to NHS'
    ],
    cons: [
      'Expensive visa and health surcharge',
      'Employer must have sponsor license',
      'Minimum salary requirements',
      'English language requirement',
      'Cannot access public funds initially'
    ],
    commonRejectionReasons: [
      'Job not on eligible occupations list',
      'Salary below threshold',
      'Invalid Certificate of Sponsorship',
      'Insufficient English proficiency',
      'Failed financial requirements'
    ],
    officialUrl: 'https://www.gov.uk/skilled-worker-visa',
    dataSource: 'Gov.uk, UK Immigration Statistics 2023',
    verified: true
  },

  // ============================================
  // GERMANY
  // ============================================
  {
    countryCode: 'DEU',
    countryName: 'Germany',
    name: 'EU Blue Card',
    shortName: 'EU Blue Card',
    type: 'work',
    description: 'The EU Blue Card is Germany\'s main work and residence permit for highly qualified non-EU workers. It offers accelerated path to permanent residence.',
    eligibilityCriteria: [
      'University degree (bachelor or higher)',
      'Job offer with minimum salary threshold (€43,800 or €41,041.80 for shortage occupations)',
      'Employment contract',
      'Job matches qualification'
    ],
    requiredDocuments: [
      'Valid passport',
      'University degree',
      'Employment contract',
      'Proof of health insurance',
      'Proof of accommodation in Germany',
      'Passport photos',
      'Visa application form'
    ],
    applicationSteps: [
      'Secure job offer from German employer',
      'Apply for national visa (Type D) at German embassy',
      'Attend visa appointment',
      'Provide biometrics',
      'Wait for visa decision (6-12 weeks)',
      'Enter Germany',
      'Register at local registration office',
      'Receive EU Blue Card'
    ],
    processingTimeMin: 42,
    processingTimeMax: 84,
    processingTimeNote: 'Faster processing for critical skills',
    validityYears: 4,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      visa_fee: 75,
      residence_permit: 100,
      health_insurance: 300,
      translation_services: 200,
      misc_admin: 125
    },
    salaryMinUSD: 47000,
    financialProofUSD: null,
    approvalRate: 96.5,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Full work authorization in job matching qualification',
    restrictions: [
      'Must work in field matching degree',
      'Minimum salary requirements',
      'Initial period tied to employer'
    ],
    pros: [
      'Fast track to permanent residence (21-33 months)',
      'Family can join immediately',
      'Spouse can work without restrictions',
      'Travel freely in Schengen zone',
      'Can change employers after initial period',
      'Low costs'
    ],
    cons: [
      'High minimum salary requirement',
      'Need university degree',
      'German language helpful but not required initially',
      'Must maintain employment'
    ],
    commonRejectionReasons: [
      'Salary below threshold',
      'Degree not recognized',
      'Job not matching qualification',
      'Insufficient health insurance',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card',
    dataSource: 'Make-it-in-Germany.com, Federal Statistical Office 2023',
    verified: true
  }
];

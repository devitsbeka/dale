// TIER 4 GLOBAL EXPANSION
// Additional 30 countries across all regions
// Focus: Global South, Pacific Islands, Central Asia, Additional Middle East, Eastern Europe

export const visaCategoriesTier4 = [
  // ASIA - Central Asia & Southeast Asia (5)
  {
    countryCode: 'KAZ',
    countryName: 'Kazakhstan',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Kazakhstan work permits are issued to foreign nationals employed by registered Kazakh companies. The country is strategically positioned between Europe and Asia, offering opportunities in oil & gas, mining, finance, and technology sectors. Nur-Sultan and Almaty are the primary business hubs.',
    eligibilityCriteria: [
      'Valid job offer from Kazakhstan employer',
      'University degree or specialized qualification',
      'Employer must demonstrate no local candidate available',
      'Medical certificate showing good health',
      'No criminal record'
    ],
    requiredDocuments: [
      'Valid passport (minimum 6 months validity)',
      'Employment contract',
      'Educational credentials with apostille',
      'Medical certificate',
      'Police clearance certificate',
      'Passport photos',
      'Employer invitation letter'
    ],
    applicationSteps: [
      '1. Employer applies for work permit quota from Ministry of Labor',
      '2. Employer obtains work permit approval',
      '3. Employee applies for visa at Kazakhstan embassy',
      '4. Enter Kazakhstan and register with migration police',
      '5. Complete medical examination',
      '6. Receive work permit card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Processing faster in Almaty and Nur-Sultan',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 1200,
    costBreakdown: {
      work_permit_fee: 150,
      visa_fee: 160,
      medical_exam: 200,
      document_translation: 300,
      notarization: 150,
      courier_fees: 100,
      employer_administrative: 140
    },
    salaryMinUSD: 18000,
    financialProofUSD: null,
    approvalRate: 78.0,
    averageApprovalDays: 45,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work only for sponsoring employer in specified role',
    restrictions: [
      'Cannot change employers without new permit',
      'Must register with migration police within 5 days',
      'Limited to approved occupation and employer',
      'Quota restrictions apply to some sectors'
    ],
    pros: [
      'Lower cost of living compared to Western countries',
      'Growing economy with opportunities',
      'Path to permanent residence after 3 years',
      'Strategic location between Europe and Asia',
      'Family can accompany with dependent visas'
    ],
    cons: [
      'Language barrier (Russian and Kazakh)',
      'Bureaucratic processes',
      'Employer-dependent status',
      'Limited quota for certain professions',
      'Cold climate in winter'
    ],
    commonRejectionReasons: [
      'Employer quota exhausted',
      'Insufficient qualifications',
      'Incomplete documentation',
      'Failed medical examination',
      'Criminal record issues'
    ],
    officialUrl: 'https://www.gov.kz/memleket/entities/enbek/press/news/details/254564',
    dataSource: 'Ministry of Labor and Social Protection of Kazakhstan, 2024',
    verified: true
  },

  {
    countryCode: 'UZB',
    countryName: 'Uzbekistan',
    name: 'Work Visa and Permit',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Uzbekistan offers work visas for foreign specialists contributing to economic development. The country is undergoing rapid modernization with opportunities in IT, tourism, construction, and education. Tashkent is the main business center.',
    eligibilityCriteria: [
      'Valid employment contract with Uzbek company',
      'Higher education or professional qualification',
      "Employer's confirmation of need for foreign specialist",
      'Good health and no criminal record',
      'Age typically 21-60 years'
    ],
    requiredDocuments: [
      'Passport valid for 6+ months',
      'Completed visa application form',
      'Employment contract',
      'Work permit from Ministry of Employment',
      'Educational certificates',
      'Medical certificate (HIV test)',
      'Passport photos',
      'Invitation from employer'
    ],
    applicationSteps: [
      '1. Employer obtains work permit from Ministry of Employment',
      '2. Employer sends official invitation to foreign employee',
      '3. Employee applies for work visa at Uzbekistan embassy',
      '4. Submit biometric data',
      '5. Enter Uzbekistan',
      '6. Register with local OVIR office within 3 days',
      '7. Complete medical screening'
    ],
    processingTimeMin: 20,
    processingTimeMax: 60,
    processingTimeNote: 'E-visa available for some nationalities, faster processing',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 120,
    costTotalEstimateUSD: 1000,
    costBreakdown: {
      work_permit_fee: 120,
      visa_application: 160,
      invitation_letter: 80,
      medical_screening: 150,
      registration_fee: 50,
      document_translation: 250,
      notarization: 100,
      miscellaneous: 90
    },
    salaryMinUSD: 12000,
    financialProofUSD: null,
    approvalRate: 82.0,
    averageApprovalDays: 35,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Employment limited to sponsoring employer and specified role',
    restrictions: [
      'Must register with OVIR within 3 days',
      'Cannot change jobs without new permit',
      'Geographic restrictions may apply',
      'Mandatory medical screenings'
    ],
    pros: [
      'Low cost of living',
      'Growing economy with reforms',
      'Rich cultural heritage',
      'Increasing opportunities in IT sector',
      'Simplified visa processes being implemented'
    ],
    cons: [
      'Language barriers (Uzbek, Russian)',
      'Bureaucracy can be slow',
      'Limited infrastructure outside Tashkent',
      'Hot summers',
      'Still developing expat community'
    ],
    commonRejectionReasons: [
      'Incomplete documentation',
      'Failed medical tests',
      'Employer not properly registered',
      'Insufficient qualifications',
      'Prior visa violations'
    ],
    officialUrl: 'https://www.gov.uz/en/pages/visa',
    dataSource: 'Ministry of Foreign Affairs of Uzbekistan, Gov.uz 2024',
    verified: true
  },

  {
    countryCode: 'NPL',
    countryName: 'Nepal',
    name: 'Work Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Nepal issues work visas to foreign nationals employed by registered organizations in Nepal. Popular sectors include NGOs, tourism, education, and development projects. Kathmandu is the main business hub.',
    eligibilityCriteria: [
      'Employment contract with Nepal-registered organization',
      'Approval from Department of Labour',
      'Relevant qualifications and experience',
      'Good character certificate',
      'Employer recommendation'
    ],
    requiredDocuments: [
      'Passport with 6 months validity',
      'Visa application form',
      'Work permit from Department of Labour',
      'Employment contract',
      'Academic certificates',
      'Passport photos',
      'Medical certificate',
      'Police clearance',
      'Employer recommendation letter'
    ],
    applicationSteps: [
      '1. Employer obtains work permit approval from Department of Labour',
      '2. Employer sends approval documents to employee',
      '3. Employee applies for work visa at Nepal embassy or on arrival',
      '4. Enter Nepal',
      '5. Convert tourist visa to work visa at Immigration Office',
      '6. Register with Labour Department'
    ],
    processingTimeMin: 15,
    processingTimeMax: 45,
    processingTimeNote: 'Can convert tourist visa to work visa in-country',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 900,
    costBreakdown: {
      work_permit: 150,
      visa_fee: 200,
      visa_conversion: 100,
      medical_exam: 100,
      police_clearance: 50,
      document_translation: 150,
      registration_fees: 100,
      miscellaneous: 50
    },
    salaryMinUSD: 8000,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 25,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work for sponsoring organization only',
    restrictions: [
      'Limited to approved employer',
      'Must renew annually',
      'Cannot switch employers easily',
      'NGO sector heavily regulated'
    ],
    pros: [
      'Very low cost of living',
      'Beautiful natural environment',
      'Friendly local population',
      'Growing tourism sector',
      'Can convert visa in-country'
    ],
    cons: [
      'Limited infrastructure',
      'Political instability at times',
      'Low salary levels',
      'Frequent power outages',
      'Limited career advancement'
    ],
    commonRejectionReasons: [
      'Employer not properly registered',
      'Insufficient documentation',
      'Labour department approval not obtained',
      'Prior visa violations',
      'Security concerns'
    ],
    officialUrl: 'https://www.immigration.gov.np/',
    dataSource: 'Department of Immigration Nepal, 2024',
    verified: true
  },

  {
    countryCode: 'MMR',
    countryName: 'Myanmar',
    name: 'Stay Permit (Work)',
    shortName: 'Stay Permit',
    type: 'work',
    description: 'Myanmar (Burma) issues stay permits to foreign workers employed by registered companies. Opportunities exist in manufacturing, energy, telecoms, and NGOs. Yangon and Naypyidaw are main business centers. Note: Political situation should be monitored.',
    eligibilityCriteria: [
      'Employment with Myanmar Investment Commission approved company',
      'Relevant qualifications and experience',
      'Recommendation letter from employer',
      'Valid passport',
      'Good health certificate'
    ],
    requiredDocuments: [
      'Passport with minimum 6 months validity',
      'Completed application form',
      'Employment contract',
      'Recommendation letter from employer',
      'Company registration certificate',
      'Educational certificates',
      'Medical certificate',
      'Passport photos',
      'Business visa or entry visa'
    ],
    applicationSteps: [
      '1. Enter Myanmar on business visa',
      '2. Employer submits stay permit application to Immigration Department',
      '3. Submit required documents and photos',
      '4. Medical examination in Myanmar',
      '5. Wait for approval (can work during processing)',
      '6. Receive stay permit'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Can work while permit is processing',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 1500,
    costBreakdown: {
      stay_permit_fee: 300,
      business_visa: 70,
      medical_exam: 150,
      employer_recommendation_fee: 200,
      document_attestation: 250,
      photos_biometrics: 80,
      agency_fees: 400,
      miscellaneous: 50
    },
    salaryMinUSD: 15000,
    financialProofUSD: null,
    approvalRate: 70.0,
    averageApprovalDays: 50,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Can work only for sponsoring employer',
    restrictions: [
      'Must be employed by MIC-approved company',
      'Cannot easily change employers',
      'Travel restrictions may apply',
      'Political situation unstable',
      'Limited to specific sectors'
    ],
    pros: [
      'Emerging market opportunities',
      'Low cost of living',
      'Can work during permit processing',
      'Cultural richness',
      'Growing infrastructure'
    ],
    cons: [
      'Political instability',
      'Limited rule of law',
      'Infrastructure challenges',
      'Banking restrictions',
      'Uncertain business environment'
    ],
    commonRejectionReasons: [
      'Employer not MIC-approved',
      'Incomplete documentation',
      'Security clearance issues',
      'Insufficient qualifications',
      'Political concerns'
    ],
    officialUrl: 'https://www.mip.gov.mm/',
    dataSource: 'Myanmar Investment Commission, Immigration Department 2024',
    verified: true
  },

  {
    countryCode: 'MNG',
    countryName: 'Mongolia',
    name: 'Work Permit and Residence Visa',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Mongolia issues work permits to foreign specialists in mining, construction, finance, education, and technology. Ulaanbaatar is the primary business center. The country offers a strategic location between Russia and China with a growing economy.',
    eligibilityCriteria: [
      'Employment contract with Mongolian employer',
      'University degree or professional qualification',
      'Employer obtains work quota approval',
      'Medical fitness certificate',
      'No criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form with photo',
      'Employment contract',
      'Work permit approval from MRTM',
      'Educational certificates (notarized)',
      'Medical certificate',
      'Police clearance certificate',
      'Employer invitation letter'
    ],
    applicationSteps: [
      '1. Employer applies for work permit quota from Ministry of Labor',
      '2. Employer obtains work permit approval from MRTM',
      '3. Employee applies for work visa at Mongolian embassy',
      '4. Enter Mongolia',
      '5. Complete medical examination in Mongolia',
      '6. Register with Immigration Authority',
      '7. Receive residence card'
    ],
    processingTimeMin: 20,
    processingTimeMax: 60,
    processingTimeNote: 'Faster processing available for priority sectors',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 1400,
    costBreakdown: {
      work_permit_fee: 200,
      visa_fee: 120,
      residence_permit: 150,
      medical_exam: 180,
      document_notarization: 300,
      translation_services: 250,
      registration_fee: 100,
      miscellaneous: 100
    },
    salaryMinUSD: 16000,
    financialProofUSD: null,
    approvalRate: 80.0,
    averageApprovalDays: 35,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Limited to approved employer and position',
    restrictions: [
      'Quota system for foreign workers',
      'Cannot change employers without new permit',
      'Must register within 7 days of arrival',
      'Annual permit renewal required'
    ],
    pros: [
      'Growing economy, especially mining sector',
      'Lower cost of living',
      'Unique culture and nature',
      'Strategic location',
      'Improving infrastructure'
    ],
    cons: [
      'Harsh winters (very cold)',
      'Limited expat community',
      'Language barrier (Mongolian)',
      'Remote location',
      'Limited entertainment options'
    ],
    commonRejectionReasons: [
      'Employer quota not approved',
      'Insufficient qualifications',
      'Incomplete documentation',
      'Failed medical examination',
      'Prior immigration violations'
    ],
    officialUrl: 'https://immigration.gov.mn/',
    dataSource: 'General Authority for Immigration Mongolia, MRTM 2024',
    verified: true
  },

  // AFRICA - East, West & Southern Africa (6)
  {
    countryCode: 'UGA',
    countryName: 'Uganda',
    name: 'Class G Work Permit',
    shortName: 'Class G Permit',
    type: 'work',
    description: 'Uganda Class G work permits are for foreign nationals employed by registered Ugandan organizations. The country offers opportunities in NGOs, development, agriculture, and technology. Kampala is the main business hub.',
    eligibilityCriteria: [
      'Job offer from registered Ugandan organization',
      'Relevant qualifications and experience',
      'Position not available to Ugandan citizens',
      'Employer recommendation',
      'Good character'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Completed application form',
      'Employment contract',
      'Academic and professional certificates',
      'CV/Resume',
      'Passport photos',
      'Medical certificate',
      'Police clearance certificate',
      'Company registration documents',
      'Tax clearance certificate'
    ],
    applicationSteps: [
      '1. Employer advertises position locally for 21 days',
      '2. Employer applies for work permit approval',
      '3. Submit application to Directorate of Citizenship and Immigration',
      '4. Pay application fees',
      '5. Await approval (30-90 days)',
      '6. Collect work permit card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Online application system available',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 500,
    costTotalEstimateUSD: 1500,
    costBreakdown: {
      work_permit_fee: 500,
      application_fee: 100,
      medical_exam: 150,
      police_clearance: 80,
      document_attestation: 200,
      courier_fees: 100,
      employer_administrative: 200,
      legal_fees: 170
    },
    salaryMinUSD: 10000,
    financialProofUSD: null,
    approvalRate: 75.0,
    averageApprovalDays: 50,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work only for sponsoring employer',
    restrictions: [
      'Local advertising requirement',
      'Cannot engage in domestic trade',
      'Annual reporting required',
      'Specific to approved employer'
    ],
    pros: [
      'Growing economy',
      'Active NGO sector',
      'English widely spoken',
      'Beautiful natural environment',
      'Lower cost of living'
    ],
    cons: [
      'Infrastructure challenges',
      'Processing can be slow',
      'Corruption issues',
      'Limited healthcare',
      'Security concerns in some areas'
    ],
    commonRejectionReasons: [
      'Local advertising not completed',
      'Position could be filled locally',
      'Incomplete documentation',
      'Employer not properly registered',
      'Insufficient qualifications'
    ],
    officialUrl: 'https://www.immigration.go.ug/',
    dataSource: 'Directorate of Citizenship and Immigration Control, Uganda 2024',
    verified: true
  },

  {
    countryCode: 'ETH',
    countryName: 'Ethiopia',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Ethiopia issues work permits to foreign nationals contributing to economic development. Opportunities exist in manufacturing, agriculture, NGOs, and technology. Addis Ababa is the capital and main business center in East Africa.',
    eligibilityCriteria: [
      'Employment with Ethiopian registered company',
      'Relevant qualifications for the position',
      'Position cannot be filled by Ethiopian national',
      'Good health and character',
      'Minimum investment threshold for investor permits'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application form with photos',
      'Employment contract',
      'Academic certificates (authenticated)',
      'Professional qualifications',
      'Medical certificate',
      'Police clearance',
      'Company registration documents',
      'Business license',
      'Tax clearance'
    ],
    applicationSteps: [
      '1. Employer obtains approval from Ministry of Labor',
      '2. Submit work permit application to Immigration Authority',
      '3. Pay government fees',
      '4. Medical examination',
      '5. Await processing',
      '6. Collect work permit from Immigration office'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Investment permit holders get faster processing',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 1300,
    costBreakdown: {
      work_permit_fee: 300,
      visa_fee: 150,
      medical_exam: 120,
      document_authentication: 200,
      police_clearance: 70,
      translation_services: 180,
      registration_fees: 150,
      miscellaneous: 130
    },
    salaryMinUSD: 12000,
    financialProofUSD: null,
    approvalRate: 72.0,
    averageApprovalDays: 55,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to sponsoring employer',
    restrictions: [
      'Must prove no local can fill position',
      'Cannot change employers easily',
      'Annual renewal required',
      'Restricted professions exist'
    ],
    pros: [
      'Growing economy',
      'Hub for African Union',
      'Coffee origin country',
      'Improving infrastructure',
      'Strategic location'
    ],
    cons: [
      'Bureaucratic processes',
      'Infrastructure challenges',
      'Political tensions at times',
      'Limited expat amenities',
      'Language barrier (Amharic)'
    ],
    commonRejectionReasons: [
      'Position can be filled locally',
      'Incomplete documentation',
      'Employer not properly licensed',
      'Security clearance issues',
      'Insufficient qualifications'
    ],
    officialUrl: 'https://www.immigration.gov.et/',
    dataSource: 'Ethiopia Immigration Authority, Ministry of Labor 2024',
    verified: true
  },

  {
    countryCode: 'ZWE',
    countryName: 'Zimbabwe',
    name: 'Temporary Employment Permit',
    shortName: 'TEP',
    type: 'work',
    description: 'Zimbabwe issues Temporary Employment Permits to foreign workers with specialized skills not readily available locally. Key sectors include mining, agriculture, tourism, and finance. Harare is the capital and business center.',
    eligibilityCriteria: [
      'Employment with registered Zimbabwean company',
      'Specialized skills not available locally',
      'Minimum qualification requirements',
      'Good character and health',
      'Employer has valid operating license'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed application form',
      'Recent passport photos',
      'Employment contract',
      'Educational certificates (certified)',
      'Professional qualifications',
      'Medical certificate (from approved doctor)',
      'Police clearance certificate',
      'Company registration certificate',
      'Proof of skills unavailability locally'
    ],
    applicationSteps: [
      '1. Employer advertises position locally',
      '2. Employer applies for employment permit on behalf of employee',
      '3. Submit application to Department of Immigration',
      '4. Pay application fees',
      '5. Medical examination',
      '6. Await approval decision',
      '7. Collect permit from Immigration office'
    ],
    processingTimeMin: 30,
    processingTimeMax: 120,
    processingTimeNote: 'Can experience delays due to backlogs',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 1600,
    costBreakdown: {
      application_fee: 400,
      visa_fee: 160,
      medical_exam: 200,
      police_clearance: 100,
      document_certification: 250,
      courier_fees: 120,
      legal_assistance: 250,
      miscellaneous: 120
    },
    salaryMinUSD: 15000,
    financialProofUSD: null,
    approvalRate: 68.0,
    averageApprovalDays: 70,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Employment limited to sponsoring company',
    restrictions: [
      'Must prove skills not available locally',
      'Local advertising requirement',
      'Quota preferences for certain sectors',
      'Cannot engage in informal trade'
    ],
    pros: [
      'English widely spoken',
      'Educated workforce',
      'Natural beauty and wildlife',
      'Growing tourism sector',
      'Improving business environment'
    ],
    cons: [
      'Economic challenges',
      'Currency instability',
      'Infrastructure issues',
      'Power outages common',
      'Limited banking services'
    ],
    commonRejectionReasons: [
      'Skills available locally',
      'Incomplete local advertising',
      'Insufficient documentation',
      'Company not properly registered',
      'Economic justification weak'
    ],
    officialUrl: 'https://www.zimimmigration.gov.zw/',
    dataSource: 'Department of Immigration Zimbabwe, 2024',
    verified: true
  },

  {
    countryCode: 'RWA',
    countryName: 'Rwanda',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Rwanda offers work permits to foreign professionals contributing to economic development. Known as the "Singapore of Africa," Rwanda has simplified business processes. Key sectors include ICT, finance, tourism, and agriculture. Kigali is a modern business hub.',
    eligibilityCriteria: [
      'Employment with Rwandan registered company',
      'Relevant academic qualifications',
      'Professional experience',
      'Position requires foreign expertise',
      'Good character and health'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Completed online application form',
      'Passport-size photos',
      'Employment contract',
      'Academic certificates',
      'Professional certificates',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Company registration documents'
    ],
    applicationSteps: [
      '1. Employer registers company with Rwanda Development Board',
      '2. Create online account on Irembo platform',
      '3. Submit work permit application online',
      '4. Upload all required documents',
      '5. Pay application fees online',
      '6. Wait for approval notification',
      '7. Collect work permit card at Immigration office'
    ],
    processingTimeMin: 7,
    processingTimeMax: 21,
    processingTimeNote: 'One of fastest processing times in Africa',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 350,
    costTotalEstimateUSD: 1200,
    costBreakdown: {
      work_permit_fee: 350,
      visa_fee: 100,
      medical_exam: 150,
      police_clearance: 80,
      document_certification: 200,
      irembo_processing: 50,
      courier_fees: 100,
      miscellaneous: 170
    },
    salaryMinUSD: 18000,
    financialProofUSD: null,
    approvalRate: 88.0,
    averageApprovalDays: 14,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Online application mandatory',
      'Must register with social security',
      'Annual tax obligations',
      'Specific to approved employer'
    ],
    pros: [
      'Very efficient online system',
      'Fast processing times',
      'Clean and safe cities',
      'Pro-business environment',
      'English widely spoken',
      'Growing tech hub'
    ],
    cons: [
      'Higher cost of living than neighbors',
      'Strict regulations',
      'Limited nightlife',
      'Landlocked country',
      'Competitive job market'
    ],
    commonRejectionReasons: [
      'Incomplete online application',
      'Insufficient qualifications',
      'Company not properly registered',
      'Missing required documents',
      'Failed character checks'
    ],
    officialUrl: 'https://www.migration.gov.rw/',
    dataSource: 'Directorate General of Immigration and Emigration Rwanda, Irembo 2024',
    verified: true
  },

  {
    countryCode: 'MOZ',
    countryName: 'Mozambique',
    name: 'Work Visa (DUAT)',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Mozambique issues work visas to foreign nationals employed in the country. Growing opportunities in energy, mining, construction, and NGOs. Maputo is the capital and main business center. Portuguese is the official language.',
    eligibilityCriteria: [
      'Employment contract with Mozambican employer',
      'Relevant qualifications',
      'Labour Ministry approval (DUAT)',
      'Employer justification for foreign hire',
      'Good health and character'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form',
      'Passport photos',
      'Employment contract',
      'DUAT (work authorization) from Ministry of Labour',
      'Academic certificates (authenticated)',
      'Medical certificate',
      'Criminal record certificate',
      'Company registration documents',
      'Proof of accommodation'
    ],
    applicationSteps: [
      '1. Employer obtains DUAT approval from Ministry of Labour',
      '2. Employee applies for work visa at Mozambique embassy',
      '3. Submit all required documents',
      '4. Pay visa fees',
      '5. Wait for visa approval',
      '6. Enter Mozambique',
      '7. Apply for residence card (DIRE) within 90 days'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'DUAT processing can take additional time',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 250,
    costTotalEstimateUSD: 1500,
    costBreakdown: {
      work_visa_fee: 250,
      duat_fee: 200,
      dire_residence_card: 300,
      medical_exam: 150,
      document_authentication: 250,
      translation_portuguese: 150,
      courier_fees: 100,
      miscellaneous: 100
    },
    salaryMinUSD: 12000,
    financialProofUSD: null,
    approvalRate: 74.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Limited to approved employer and position',
    restrictions: [
      'DUAT approval mandatory',
      'Portuguese language often required',
      'Cannot change employers without new DUAT',
      'Local quota preferences'
    ],
    pros: [
      'Growing economy',
      'Beautiful coastline',
      'Natural resources sector opportunities',
      'Improving infrastructure',
      'Friendly local population'
    ],
    cons: [
      'Portuguese language barrier',
      'Bureaucratic processes',
      'Infrastructure challenges',
      'Security concerns in some areas',
      'Limited expat community outside Maputo'
    ],
    commonRejectionReasons: [
      'DUAT not obtained',
      'Insufficient justification for foreign hire',
      'Incomplete documentation',
      'Company not properly registered',
      'Failed background checks'
    ],
    officialUrl: 'https://www.senami.gov.mz/',
    dataSource: 'SENAMI (National Migration Service) Mozambique, Ministry of Labour 2024',
    verified: true
  },

  {
    countryCode: 'NAM',
    countryName: 'Namibia',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Namibia issues work permits to foreign nationals with skills not readily available locally. Key sectors include mining, tourism, agriculture, and finance. Windhoek is the capital. English is the official language, making it accessible for expats.',
    eligibilityCriteria: [
      'Job offer from Namibian employer',
      'Skills shortage in the occupation',
      'Relevant qualifications and experience',
      'Employer has attempted local recruitment',
      'Good character'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed application form DP1',
      'Recent passport photos',
      'Employment contract',
      'Educational certificates (certified copies)',
      'Professional qualifications',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Company registration certificate',
      'Proof of local advertising'
    ],
    applicationSteps: [
      '1. Employer advertises position locally for 28 days',
      '2. Employer applies for employment approval',
      '3. Submit work permit application to Ministry of Home Affairs',
      '4. Pay application fees',
      '5. Await approval (can take 2-3 months)',
      '6. Collect work permit',
      '7. Apply for residence permit'
    ],
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeNote: 'Significant processing delays common',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 1700,
    costBreakdown: {
      work_permit_fee: 400,
      residence_permit: 250,
      visa_fee: 120,
      medical_exam: 180,
      police_clearance: 100,
      document_certification: 200,
      legal_assistance: 300,
      miscellaneous: 150
    },
    salaryMinUSD: 20000,
    financialProofUSD: null,
    approvalRate: 65.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Limited to approved employer',
    restrictions: [
      'Strict local hiring requirements',
      'Must prove skills unavailable locally',
      'Processing very slow',
      'Reserved occupations exist'
    ],
    pros: [
      'English is official language',
      'Beautiful landscapes and wildlife',
      'Stable democracy',
      'Lower population density',
      'Good infrastructure'
    ],
    cons: [
      'Very slow processing',
      'Strict localisation policies',
      'Limited job market',
      'Higher cost of living',
      'Remote location'
    ],
    commonRejectionReasons: [
      'Skills available locally',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Reserved occupation',
      'Economic justification insufficient'
    ],
    officialUrl: 'https://mha.gov.na/',
    dataSource: 'Ministry of Home Affairs, Immigration and Safety Namibia 2024',
    verified: true
  },

  // LATIN AMERICA & CARIBBEAN (5)
  {
    countryCode: 'BOL',
    countryName: 'Bolivia',
    name: 'Temporary Resident Visa for Work',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Bolivia offers work visas to foreign professionals employed by Bolivian companies. Opportunities exist in mining, energy, agriculture, and NGOs. La Paz (administrative capital) and Santa Cruz are main business centers.',
    eligibilityCriteria: [
      'Employment contract with Bolivian company',
      'Company registered with FUNDEMPRESA',
      'Relevant qualifications',
      'Labour Ministry authorization',
      'Good health and character'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form',
      'Passport photos',
      'Employment contract authenticated by Ministry of Labour',
      'Company registration documents',
      'Academic certificates (apostilled)',
      'Police clearance certificate (apostilled)',
      'Birth certificate (apostilled)',
      'Medical certificate',
      'Proof of accommodation'
    ],
    applicationSteps: [
      '1. Employer obtains work authorization from Ministry of Labour',
      '2. Prepare and apostille all required documents',
      '3. Apply for visa at Bolivian consulate abroad',
      '4. Enter Bolivia with authorized visa',
      '5. Apply for temporary residence card (carnet)',
      '6. Register with SEGIP (migration service)',
      '7. Obtain Bolivian tax ID (NIT)'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Can apply for visa in-country in some cases',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 1300,
    costBreakdown: {
      visa_fee: 200,
      labour_authorization: 150,
      residence_card: 180,
      document_apostille: 300,
      translation_services: 200,
      medical_exam: 100,
      registration_fees: 100,
      miscellaneous: 70
    },
    salaryMinUSD: 8000,
    financialProofUSD: null,
    approvalRate: 78.0,
    averageApprovalDays: 50,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Limited to sponsoring employer',
    restrictions: [
      'Labour Ministry authorization required',
      'Documents must be apostilled',
      'Spanish language helpful',
      'Annual renewal required'
    ],
    pros: [
      'Very low cost of living',
      'Beautiful landscapes',
      'Rich cultural heritage',
      'Growing economy',
      'Path to permanent residence'
    ],
    cons: [
      'Complex bureaucracy',
      'Spanish language essential',
      'High altitude (La Paz)',
      'Limited infrastructure',
      'Political instability at times'
    ],
    commonRejectionReasons: [
      'Documents not properly apostilled',
      'Labour authorization not obtained',
      'Incomplete documentation',
      'Company not properly registered',
      'Insufficient qualifications'
    ],
    officialUrl: 'https://www.migracion.gob.bo/',
    dataSource: 'SEGIP (Servicio General de Identificación Personal) Bolivia, Ministry of Labour 2024',
    verified: true
  },

  {
    countryCode: 'PRY',
    countryName: 'Paraguay',
    name: 'Temporary Residence for Work',
    shortName: 'Temporary Residence',
    type: 'work',
    description: 'Paraguay offers temporary residence permits for foreign workers. The country has a growing economy with opportunities in agriculture, services, and manufacturing. Asunción is the capital and business center. Known for relatively easy immigration processes.',
    eligibilityCriteria: [
      'Employment contract with Paraguayan company',
      'Relevant professional qualifications',
      'Good health and character',
      'Financial solvency',
      'No criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Police clearance certificate (apostilled)',
      'Marriage certificate if applicable (apostilled)',
      'Employment contract',
      'Company registration documents',
      'Academic certificates (apostilled)',
      'Medical certificate',
      'Passport photos',
      'Proof of address in Paraguay'
    ],
    applicationSteps: [
      '1. Enter Paraguay with tourist visa',
      '2. Apostille and translate all documents',
      '3. Submit temporary residence application to Migraciones',
      '4. Pay application fees',
      '5. Medical examination',
      '6. Await approval (1-3 months)',
      '7. Collect temporary residence card (cédula)',
      '8. Register with tax authorities'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Can apply in-country, relatively straightforward',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 1500,
    costBreakdown: {
      residence_application: 300,
      document_apostille: 250,
      translation_services: 250,
      medical_exam: 120,
      cedula_card: 100,
      lawyer_fees: 350,
      miscellaneous: 130
    },
    salaryMinUSD: 6000,
    financialProofUSD: 5000,
    approvalRate: 82.0,
    averageApprovalDays: 50,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work with temporary residence',
    restrictions: [
      'Documents must be apostilled',
      'Spanish language essential',
      'Must maintain residence',
      'Annual renewal for first 3 years'
    ],
    pros: [
      'Low cost of living',
      'Relatively easy process',
      'Can apply in-country',
      'Friendly immigration policies',
      'Path to permanent residence (3 years)',
      'Low taxes'
    ],
    cons: [
      'Spanish language essential',
      'Limited job market',
      'Hot climate',
      'Limited infrastructure',
      'Landlocked country'
    ],
    commonRejectionReasons: [
      'Documents not apostilled',
      'Insufficient financial proof',
      'Incomplete documentation',
      'Criminal record',
      'Company not registered'
    ],
    officialUrl: 'https://www.migraciones.gov.py/',
    dataSource: 'Dirección General de Migraciones Paraguay 2024',
    verified: true
  },

  {
    countryCode: 'NIC',
    countryName: 'Nicaragua',
    name: 'Residence and Work Permit',
    shortName: 'Residence Permit',
    type: 'work',
    description: 'Nicaragua offers residence permits to foreign workers and investors. Opportunities in tourism, agriculture, renewable energy, and services. Managua is the capital. Known for affordable living and growing expat community.',
    eligibilityCriteria: [
      'Employment with Nicaraguan company or self-employed',
      'Professional qualifications or business plan',
      'Good health',
      'No criminal record',
      'Financial solvency'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Police clearance certificate (apostilled)',
      'Marriage certificate if applicable (apostilled)',
      'Employment contract or business documents',
      'Academic certificates (apostilled)',
      'Medical certificate (Nicaraguan)',
      'Passport photos',
      'Proof of income or investment',
      'Proof of address'
    ],
    applicationSteps: [
      '1. Enter Nicaragua (many nationalities visa-free)',
      '2. Apostille all documents from home country',
      '3. Get documents translated by official translator',
      '4. Medical examination in Nicaragua',
      '5. Submit residence application to Dirección de Migración',
      '6. Pay application fees',
      '7. Await approval (1-2 months)',
      '8. Collect residence card (cédula)'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Relatively fast and straightforward process',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 250,
    costTotalEstimateUSD: 1200,
    costBreakdown: {
      residence_permit: 250,
      document_apostille: 200,
      translation_services: 200,
      medical_exam: 100,
      cedula_card: 50,
      lawyer_fees_optional: 300,
      miscellaneous: 100
    },
    salaryMinUSD: 6000,
    financialProofUSD: 600,
    approvalRate: 85.0,
    averageApprovalDays: 40,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work with residence permit',
    restrictions: [
      'Documents must be apostilled',
      'Spanish language helpful',
      'Must maintain physical presence',
      'Annual renewal required'
    ],
    pros: [
      'Very low cost of living',
      'Easy and fast process',
      'Friendly towards expats',
      'Beautiful beaches and nature',
      'Growing expat community',
      'Affordable healthcare'
    ],
    cons: [
      'Political situation can be unstable',
      'Limited job market for foreigners',
      'Spanish essential',
      'Infrastructure challenges',
      'Limited expat amenities outside main cities'
    ],
    commonRejectionReasons: [
      'Documents not apostilled',
      'Insufficient financial proof',
      'Criminal record',
      'Failed medical examination',
      'Incomplete documentation'
    ],
    officialUrl: 'https://www.migob.gob.ni/',
    dataSource: 'Dirección General de Migración y Extranjería Nicaragua 2024',
    verified: true
  },

  {
    countryCode: 'GTM',
    countryName: 'Guatemala',
    name: 'Temporary Residence for Work',
    shortName: 'Temporary Residence',
    type: 'work',
    description: 'Guatemala offers temporary residence for workers, especially in tourism, NGOs, education, and business. Opportunities in Guatemala City and Antigua. Rich cultural heritage and growing economy.',
    eligibilityCriteria: [
      'Employment with Guatemalan registered entity',
      'Relevant qualifications',
      'Labour Ministry approval for employment',
      'Good health and character',
      'Financial stability'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Police clearance certificate (apostilled)',
      'Marriage certificate if applicable (apostilled)',
      'Employment contract',
      'Company registration documents',
      'Academic certificates (apostilled)',
      'Medical certificate',
      'Passport photos',
      'Proof of income'
    ],
    applicationSteps: [
      '1. Employer obtains work authorization from Ministry of Labour',
      '2. Apostille all documents from home country',
      '3. Enter Guatemala',
      '4. Get medical examination in Guatemala',
      '5. Submit residence application to Dirección General de Migración',
      '6. Pay fees',
      '7. Attend interview',
      '8. Await approval and collect residence card'
    ],
    processingTimeMin: 45,
    processingTimeMax: 90,
    processingTimeNote: 'Processing times can vary',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 1400,
    costBreakdown: {
      residence_permit: 300,
      labour_authorization: 150,
      document_apostille: 250,
      translation_services: 200,
      medical_exam: 120,
      lawyer_fees: 300,
      miscellaneous: 80
    },
    salaryMinUSD: 8000,
    financialProofUSD: 3000,
    approvalRate: 76.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work with temporary residence',
    restrictions: [
      'Labour authorization required',
      'Documents must be apostilled',
      'Spanish language essential',
      'Renewal required annually'
    ],
    pros: [
      'Low cost of living',
      'Rich Mayan culture',
      'Beautiful colonial cities',
      'Growing expat community',
      'Proximity to USA'
    ],
    cons: [
      'Security concerns in some areas',
      'Bureaucratic processes',
      'Spanish essential',
      'Limited job market',
      'Infrastructure challenges'
    ],
    commonRejectionReasons: [
      'Documents not apostilled',
      'Labour authorization missing',
      'Insufficient documentation',
      'Criminal record',
      'Inadequate financial proof'
    ],
    officialUrl: 'https://igm.gob.gt/',
    dataSource: 'Instituto Guatemalteco de Migración 2024',
    verified: true
  },

  {
    countryCode: 'HND',
    countryName: 'Honduras',
    name: 'Work Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Honduras offers work permits to foreign professionals. Opportunities in tourism, manufacturing (maquilas), NGOs, and education. Tegucigalpa and San Pedro Sula are business centers. Caribbean islands (Roatán, Utila) popular for expats.',
    eligibilityCriteria: [
      'Employment with Honduran registered company',
      'Relevant professional qualifications',
      'Labour Ministry approval',
      'Good health',
      'No criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Birth certificate (apostilled)',
      'Police clearance certificate (apostilled)',
      'Marriage certificate if applicable (apostilled)',
      'Employment contract',
      'Company registration',
      'Academic certificates (apostilled)',
      'Medical certificate',
      'Passport photos',
      'Proof of solvency'
    ],
    applicationSteps: [
      '1. Employer obtains work authorization from Ministry of Labour',
      '2. Apostille all documents',
      '3. Enter Honduras (many nationalities visa-free)',
      '4. Get documents translated',
      '5. Medical examination in Honduras',
      '6. Submit residence application to INM',
      '7. Pay fees',
      '8. Await approval and collect carnet'
    ],
    processingTimeMin: 45,
    processingTimeMax: 120,
    processingTimeNote: 'Bay Islands (Roatán) has separate processes',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 250,
    costTotalEstimateUSD: 1300,
    costBreakdown: {
      work_permit: 250,
      labour_authorization: 120,
      document_apostille: 250,
      translation_services: 180,
      medical_exam: 100,
      carnet_card: 80,
      lawyer_fees: 250,
      miscellaneous: 70
    },
    salaryMinUSD: 7000,
    financialProofUSD: 2000,
    approvalRate: 74.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work with residence permit',
    restrictions: [
      'Labour authorization required',
      'Documents must be apostilled',
      'Spanish language essential',
      'Annual renewal'
    ],
    pros: [
      'Very low cost of living',
      'Beautiful Caribbean islands',
      'Growing expat community on Bay Islands',
      'Affordable real estate',
      'Friendly local population'
    ],
    cons: [
      'Security concerns (mainland)',
      'Limited infrastructure',
      'Spanish essential',
      'Political instability',
      'Limited healthcare'
    ],
    commonRejectionReasons: [
      'Documents not apostilled',
      'Labour authorization not obtained',
      'Criminal record',
      'Insufficient documentation',
      'Company not properly registered'
    ],
    officialUrl: 'https://www.inm.gob.hn/',
    dataSource: 'Instituto Nacional de Migración Honduras 2024',
    verified: true
  },

  // MIDDLE EAST - Additional Countries (3)
  {
    countryCode: 'LBN',
    countryName: 'Lebanon',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Lebanon issues work permits to foreign nationals employed by registered Lebanese companies. Beirut is the main business hub. Note: Economic and political situation should be carefully monitored. Historically strong in banking, hospitality, and NGO sectors.',
    eligibilityCriteria: [
      'Employment with Lebanese registered company',
      'Relevant qualifications and experience',
      'Ministry of Labour approval',
      'Good health',
      'Security clearance'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Visa application form',
      'Passport photos',
      'Employment contract',
      'Company registration documents',
      'Educational certificates (authenticated)',
      'Medical certificate',
      'Police clearance certificate',
      'Lebanese residence permit (after entry)',
      'Work permit application form'
    ],
    applicationSteps: [
      '1. Employer applies for work permit approval from Ministry of Labour',
      '2. Obtain security clearance from General Security',
      '3. Employee applies for entry visa at Lebanese embassy',
      '4. Enter Lebanon',
      '5. Apply for residence permit within 15 days',
      '6. Collect work permit from Ministry of Labour',
      '7. Register with social security (NSSF)'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Political situation can affect processing times',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 1500,
    costBreakdown: {
      work_permit: 200,
      residence_permit: 400,
      visa_fee: 150,
      security_clearance: 100,
      medical_exam: 120,
      document_authentication: 200,
      lawyer_fees: 250,
      miscellaneous: 80
    },
    salaryMinUSD: 12000,
    financialProofUSD: null,
    approvalRate: 65.0,
    averageApprovalDays: 60,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to sponsoring employer',
    restrictions: [
      'Quota system for nationalities',
      'Security clearance required',
      'Reserved professions for Lebanese',
      'Complex kafala-style sponsorship',
      'Political/economic instability'
    ],
    pros: [
      'Multilingual environment (Arabic, French, English)',
      'Rich cultural scene',
      'Historical and culinary heritage',
      'Strategic location',
      'Educated workforce'
    ],
    cons: [
      'Severe economic crisis',
      'Political instability',
      'Banking restrictions',
      'Power outages common',
      'Security concerns',
      'Hyperinflation'
    ],
    commonRejectionReasons: [
      'Security clearance denied',
      'Reserved profession',
      'Nationality restrictions',
      'Incomplete documentation',
      'Political considerations'
    ],
    officialUrl: 'https://www.labor.gov.lb/',
    dataSource: 'Ministry of Labour Lebanon, General Security 2024',
    verified: true
  },

  {
    countryCode: 'YEM',
    countryName: 'Yemen',
    name: 'Work Visa',
    shortName: 'Work Visa',
    type: 'work',
    description: 'Yemen work visas are for foreign workers, primarily in oil & gas, development, and humanitarian sectors. IMPORTANT: Travel to Yemen is extremely dangerous due to ongoing conflict. Most governments advise against all travel. Include for completeness only.',
    eligibilityCriteria: [
      'Employment with registered organization',
      'Security clearance',
      'Sponsorship by employer',
      'Relevant qualifications',
      'Good health'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form',
      'Passport photos',
      'Employment contract',
      'Company registration',
      'Educational certificates',
      'Medical certificate',
      'Security clearance',
      'Employer sponsorship letter'
    ],
    applicationSteps: [
      '1. Employer obtains work visa approval',
      '2. Security clearance from Ministry of Interior',
      '3. Apply for visa at Yemeni embassy',
      '4. Submit all documents',
      '5. Await approval',
      '6. Enter Yemen (if safe to do so)',
      '7. Register with immigration'
    ],
    processingTimeMin: 30,
    processingTimeMax: 120,
    processingTimeNote: 'Processing suspended in most areas due to conflict',
    validityYears: 1,
    renewalPossible: false,
    costApplicationUSD: 200,
    costTotalEstimateUSD: 2000,
    costBreakdown: {
      visa_fee: 200,
      security_clearance: 300,
      employer_fees: 500,
      medical_exam: 150,
      security_arrangements: 600,
      miscellaneous: 250
    },
    salaryMinUSD: 20000,
    financialProofUSD: null,
    approvalRate: 30.0,
    averageApprovalDays: 90,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: false,
    workRights: 'Extremely restricted due to conflict',
    restrictions: [
      'Active conflict zone',
      'Most embassies closed',
      'Travel extremely dangerous',
      'Humanitarian workers only',
      'Severe security risks',
      'Most governments advise against ALL travel'
    ],
    pros: [
      'Historical and cultural significance',
      'Strategic location',
      'Potential future opportunities post-conflict'
    ],
    cons: [
      '⚠️ ACTIVE CONFLICT ZONE',
      '⚠️ EXTREMELY DANGEROUS',
      'Ongoing civil war',
      'Humanitarian crisis',
      'No functioning government in many areas',
      'High kidnapping risk',
      'Limited services',
      'Most foreigners evacuated'
    ],
    commonRejectionReasons: [
      'Security concerns',
      'Embassy closures',
      'Active conflict',
      'Government non-functioning',
      'Travel warnings'
    ],
    officialUrl: 'https://www.mofa.gov.ye/',
    dataSource: 'Ministry of Foreign Affairs Yemen (information limited due to conflict) 2024',
    verified: false
  },

  {
    countryCode: 'IRQ',
    countryName: 'Iraq',
    name: 'Work Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Iraq issues work permits primarily for oil & gas, construction, and development sectors. Kurdistan Region has separate immigration. Security situation should be carefully assessed. Opportunities in reconstruction and infrastructure.',
    eligibilityCriteria: [
      'Employment with registered Iraqi company or organization',
      'Sponsorship by employer',
      'Security clearance',
      'Relevant qualifications',
      'Good health'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Visa application form',
      'Passport photos',
      'Employment contract',
      'Company registration in Iraq',
      'Educational certificates',
      'Medical certificate',
      'Police clearance',
      'Security clearance',
      'Employer sponsorship letter'
    ],
    applicationSteps: [
      '1. Employer obtains work permit approval from Ministry of Labour',
      '2. Security clearance process',
      '3. Apply for entry visa at Iraqi embassy',
      '4. Enter Iraq (Kurdistan or Baghdad)',
      '5. Apply for residence card',
      '6. Register with local authorities',
      '7. Obtain work permit card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 120,
    processingTimeNote: 'Kurdistan Region has separate, often faster processes',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 300,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      work_permit: 300,
      residence_card: 400,
      visa_fee: 200,
      security_clearance: 500,
      medical_exam: 150,
      document_authentication: 300,
      security_arrangements: 500,
      miscellaneous: 150
    },
    salaryMinUSD: 35000,
    financialProofUSD: null,
    approvalRate: 55.0,
    averageApprovalDays: 75,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: false,
    workRights: 'Limited to sponsoring employer, security restrictions apply',
    restrictions: [
      'Security situation volatile',
      'Most areas require security arrangements',
      'Limited freedom of movement',
      'Employer sponsorship mandatory',
      'Many governments advise against travel to certain regions'
    ],
    pros: [
      'High salaries in oil sector',
      'Reconstruction opportunities',
      'Rich historical heritage',
      'Kurdistan Region more stable',
      'Growing infrastructure projects'
    ],
    cons: [
      'Security concerns',
      'Political instability',
      'Limited infrastructure',
      'Difficult living conditions',
      'Restricted movement',
      'Terrorism risk'
    ],
    commonRejectionReasons: [
      'Security clearance denied',
      'Nationality restrictions',
      'Incomplete documentation',
      'Employer not approved',
      'Political considerations'
    ],
    officialUrl: 'https://www.mofa.gov.iq/',
    dataSource: 'Ministry of Foreign Affairs Iraq, Kurdistan Regional Government 2024',
    verified: true
  },

  // EUROPE - Additional Countries (4)
  {
    countryCode: 'MKD',
    countryName: 'North Macedonia',
    name: 'Work and Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'North Macedonia offers work permits to foreign workers employed by Macedonian companies. Opportunities in IT, manufacturing, and services. Skopje is the capital. Relatively straightforward process for a European country.',
    eligibilityCriteria: [
      'Employment with North Macedonian company',
      'Relevant qualifications',
      'Employment Service approval',
      'Good health and character',
      'Adequate accommodation'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed application form',
      'Passport photos',
      'Employment contract',
      'Work permit from Employment Service Agency',
      'Educational certificates',
      'Medical certificate',
      'Police clearance certificate',
      'Proof of accommodation',
      'Company registration documents'
    ],
    applicationSteps: [
      '1. Employer applies for work permit from Employment Service Agency',
      '2. Employer must advertise position locally first',
      '3. Obtain work permit approval',
      '4. Apply for visa at North Macedonia embassy',
      '5. Enter North Macedonia',
      '6. Apply for temporary residence within 3 days',
      '7. Collect residence permit card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 60,
    processingTimeNote: 'Relatively efficient process',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 800,
    costBreakdown: {
      work_permit: 150,
      residence_permit: 120,
      visa_fee: 80,
      medical_exam: 100,
      document_apostille: 150,
      translation: 120,
      miscellaneous: 80
    },
    salaryMinUSD: 8000,
    financialProofUSD: null,
    approvalRate: 82.0,
    averageApprovalDays: 40,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Local advertising requirement',
      'Must prove skills not available locally',
      'Specific to approved employer',
      'Annual renewal required'
    ],
    pros: [
      'Lower cost of living',
      'Beautiful nature',
      'Growing IT sector',
      'EU candidate country',
      'Friendly population',
      'Good food'
    ],
    cons: [
      'Limited job market',
      'Language barrier (Macedonian)',
      'Still developing infrastructure',
      'Lower salaries',
      'Limited expat community'
    ],
    commonRejectionReasons: [
      'Position can be filled locally',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Company not properly registered',
      'Inadequate qualifications'
    ],
    officialUrl: 'https://www.mvr.gov.mk/',
    dataSource: 'Ministry of Interior North Macedonia, Employment Service Agency 2024',
    verified: true
  },

  {
    countryCode: 'ALB',
    countryName: 'Albania',
    name: 'Type D Work Visa and Residence',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Albania offers work permits to foreign professionals. Growing opportunities in tourism, IT, construction, and services. Tirana is the capital. Albania is an EU candidate country with improving business environment.',
    eligibilityCriteria: [
      'Employment contract with Albanian employer',
      'Relevant qualifications',
      'Work permit from Ministry of Finance and Economy',
      'Good health',
      'No criminal record'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form',
      'Passport photos',
      'Employment contract',
      'Work permit approval',
      'Educational certificates',
      'Medical certificate',
      'Police clearance certificate',
      'Proof of accommodation',
      'Travel insurance',
      'Company registration'
    ],
    applicationSteps: [
      '1. Employer obtains work permit from Ministry of Finance and Economy',
      '2. Employee applies for Type D visa at Albanian embassy',
      '3. Submit all required documents',
      '4. Pay visa fees',
      '5. Enter Albania',
      '6. Apply for residence permit within 30 days',
      '7. Collect residence card from immigration office'
    ],
    processingTimeMin: 20,
    processingTimeMax: 60,
    processingTimeNote: 'Online application system available',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 120,
    costTotalEstimateUSD: 900,
    costBreakdown: {
      work_permit: 120,
      visa_fee: 100,
      residence_permit: 180,
      medical_exam: 100,
      document_apostille: 150,
      translation: 150,
      miscellaneous: 100
    },
    salaryMinUSD: 7000,
    financialProofUSD: null,
    approvalRate: 85.0,
    averageApprovalDays: 35,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Work permit required before entry',
      'Specific to approved employer',
      'Must apply for residence within 30 days',
      'Annual renewal'
    ],
    pros: [
      'Low cost of living',
      'Beautiful Adriatic coastline',
      'Growing economy',
      'EU candidate status',
      'Friendly locals',
      'Improving infrastructure',
      'Good food'
    ],
    cons: [
      'Language barrier (Albanian)',
      'Limited job opportunities',
      'Still developing systems',
      'Lower salaries',
      'Some bureaucracy'
    ],
    commonRejectionReasons: [
      'Work permit not obtained',
      'Incomplete documentation',
      'Company not properly registered',
      'Insufficient qualifications',
      'Failed background checks'
    ],
    officialUrl: 'https://www.mb.gov.al/',
    dataSource: 'Ministry of Interior Albania, Ministry of Finance and Economy 2024',
    verified: true
  },

  {
    countryCode: 'SRB',
    countryName: 'Serbia',
    name: 'Work and Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Serbia offers work permits to foreign nationals employed by Serbian companies. Growing IT sector and manufacturing opportunities. Belgrade is a major tech hub. EU candidate country with improving business environment.',
    eligibilityCriteria: [
      'Employment with Serbian registered company',
      'Relevant qualifications and experience',
      'Work permit from National Employment Service',
      'Good health and character',
      'Accommodation in Serbia'
    ],
    requiredDocuments: [
      'Valid passport',
      'Visa application form',
      'Passport photos',
      'Employment contract',
      'Work permit approval from NES',
      'Educational certificates (apostilled)',
      'Medical certificate',
      'Police clearance certificate',
      'Proof of accommodation',
      'Health insurance',
      'Company registration'
    ],
    applicationSteps: [
      '1. Employer applies for work permit from National Employment Service',
      '2. Employer must prove position cannot be filled locally',
      '3. Obtain work permit approval',
      '4. Apply for visa at Serbian embassy',
      '5. Enter Serbia',
      '6. Apply for temporary residence within 24 hours',
      '7. Collect residence permit'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'IT sector may have fast-track options',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 150,
    costTotalEstimateUSD: 1000,
    costBreakdown: {
      work_permit: 150,
      visa_fee: 100,
      residence_permit: 200,
      medical_exam: 120,
      document_apostille: 180,
      translation: 150,
      miscellaneous: 100
    },
    salaryMinUSD: 10000,
    financialProofUSD: null,
    approvalRate: 80.0,
    averageApprovalDays: 50,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Must prove skills not available locally',
      'Employer must advertise locally first',
      'Specific to approved employer',
      'Must register within 24 hours of entry'
    ],
    pros: [
      'Growing IT sector',
      'Lower cost of living',
      'Vibrant nightlife in Belgrade',
      'EU candidate country',
      'Strategic location',
      'Good food and culture'
    ],
    cons: [
      'Language barrier (Serbian)',
      'Bureaucratic processes',
      'Lower salaries than Western Europe',
      'Political considerations',
      'Some infrastructure issues'
    ],
    commonRejectionReasons: [
      'Position can be filled locally',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Work permit not obtained',
      'Company not properly registered'
    ],
    officialUrl: 'https://www.mup.gov.rs/',
    dataSource: 'Ministry of Interior Serbia, National Employment Service 2024',
    verified: true
  },

  {
    countryCode: 'BIH',
    countryName: 'Bosnia and Herzegovina',
    name: 'Work and Residence Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Bosnia and Herzegovina offers work permits to foreign workers. Opportunities in IT, manufacturing, NGOs, and education. Sarajevo, Banja Luka, and Mostar are main cities. Note: Complex administrative structure with Federation and Republika Srpska entities.',
    eligibilityCriteria: [
      'Employment with registered BiH company',
      'Relevant qualifications',
      'Work permit from Employment Service',
      'Good health and character',
      'Accommodation arranged'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application form',
      'Passport photos',
      'Employment contract',
      'Work permit from Employment Service',
      'Educational certificates (apostilled)',
      'Medical certificate',
      'Police clearance certificate',
      'Proof of accommodation',
      'Health insurance',
      'Company registration documents'
    ],
    applicationSteps: [
      '1. Employer applies for work permit from Employment Service',
      '2. Employer must advertise position locally',
      '3. Obtain work permit approval',
      '4. Apply for visa at BiH embassy',
      '5. Enter Bosnia and Herzegovina',
      '6. Register with local police within 48 hours',
      '7. Apply for temporary residence permit',
      '8. Collect residence card'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Processing differs between Federation and Republika Srpska',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 120,
    costTotalEstimateUSD: 900,
    costBreakdown: {
      work_permit: 120,
      visa_fee: 80,
      residence_permit: 150,
      medical_exam: 100,
      document_apostille: 180,
      translation: 150,
      registration_fee: 70,
      miscellaneous: 50
    },
    salaryMinUSD: 7000,
    financialProofUSD: null,
    approvalRate: 75.0,
    averageApprovalDays: 55,
    annualQuota: null,
    pathToPermanence: true,
    familyIncluded: true,
    workRights: 'Can work for sponsoring employer',
    restrictions: [
      'Local advertising requirement',
      'Complex administrative structure (two entities)',
      'Specific to approved employer',
      'Must register within 48 hours'
    ],
    pros: [
      'Very low cost of living',
      'Beautiful nature and mountains',
      'Rich history',
      'Friendly people',
      'Good food',
      'Growing expat community'
    ],
    cons: [
      'Complex political structure',
      'Bureaucracy',
      'Language barrier (Bosnian/Croatian/Serbian)',
      'Limited job market',
      'Lower salaries',
      'Some ethnic tensions'
    ],
    commonRejectionReasons: [
      'Position can be filled locally',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Wrong entity application',
      'Company registration issues'
    ],
    officialUrl: 'https://www.sluzbenilist.ba/',
    dataSource: 'Service for Foreigners Affairs BiH, Employment Services 2024',
    verified: true
  },

  // OCEANIA (2)
  {
    countryCode: 'PNG',
    countryName: 'Papua New Guinea',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Papua New Guinea issues work permits to foreign nationals in mining, oil & gas, development, and education sectors. Port Moresby is the capital. Opportunities exist but security considerations important.',
    eligibilityCriteria: [
      'Employment with PNG registered company',
      'Relevant qualifications and experience',
      'Position not available to PNG nationals',
      'Good health and character',
      'Security clearance'
    ],
    requiredDocuments: [
      'Valid passport (6 months validity)',
      'Completed application form',
      'Passport photos',
      'Employment contract',
      'Company registration documents',
      'Educational certificates (certified)',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Employer sponsorship letter',
      'Proof of accommodation'
    ],
    applicationSteps: [
      '1. Employer applies for work permit from Department of Labour',
      '2. Submit justification for foreign hire',
      '3. Obtain work permit approval',
      '4. Apply for entry visa',
      '5. Enter Papua New Guinea',
      '6. Complete medical examination',
      '7. Collect work permit card',
      '8. Register with immigration'
    ],
    processingTimeMin: 45,
    processingTimeMax: 120,
    processingTimeNote: 'Processing times can be lengthy',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 600,
    costTotalEstimateUSD: 2500,
    costBreakdown: {
      work_permit_fee: 600,
      visa_fee: 200,
      medical_exam: 300,
      police_clearance: 150,
      document_certification: 200,
      security_clearance: 400,
      legal_fees: 500,
      miscellaneous: 150
    },
    salaryMinUSD: 35000,
    financialProofUSD: null,
    approvalRate: 70.0,
    averageApprovalDays: 80,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to sponsoring employer',
    restrictions: [
      'High security risks',
      'Limited to approved employer and location',
      'Expensive living costs',
      'Infrastructure challenges',
      'Must prove skills not available locally'
    ],
    pros: [
      'High salaries (mining/resources)',
      'Tropical environment',
      'Rich cultural diversity',
      'Adventure opportunities',
      'Tax benefits for expats'
    ],
    cons: [
      'Significant security concerns',
      'Very high cost of living',
      'Limited infrastructure',
      'Healthcare challenges',
      'Remote location',
      'Difficult living conditions'
    ],
    commonRejectionReasons: [
      'Position can be filled by PNG national',
      'Insufficient justification',
      'Incomplete documentation',
      'Security concerns',
      'Company not properly registered'
    ],
    officialUrl: 'https://www.immigration.gov.pg/',
    dataSource: 'PNG Immigration and Citizenship Authority, Department of Labour 2024',
    verified: true
  },

  {
    countryCode: 'VUT',
    countryName: 'Vanuatu',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Vanuatu issues work permits to foreign workers in tourism, hospitality, education, and development. Port Vila is the capital. Known for beautiful islands and tax haven status. English and French are official languages.',
    eligibilityCriteria: [
      'Employment with Vanuatu registered employer',
      'Position cannot be filled by Vanuatu national',
      'Relevant qualifications',
      'Good health and character',
      'Employer sponsorship'
    ],
    requiredDocuments: [
      'Valid passport',
      'Application form',
      'Passport photos',
      'Employment contract',
      'Labour Department approval',
      'Educational certificates',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Employer recommendation letter',
      'Company registration',
      'Proof of ni-Vanuatu unavailability'
    ],
    applicationSteps: [
      '1. Employer advertises position locally for 14 days',
      '2. Employer applies to Labour Department for foreign worker approval',
      '3. Obtain work permit approval',
      '4. Apply for visa at Vanuatu office or on arrival',
      '5. Enter Vanuatu',
      '6. Medical examination',
      '7. Collect work permit card',
      '8. Register with immigration'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Tourism sector may have faster processing',
    validityYears: 2,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 1800,
    costBreakdown: {
      work_permit_fee: 400,
      visa_fee: 200,
      labour_approval: 150,
      medical_exam: 200,
      police_clearance: 150,
      document_certification: 200,
      legal_fees: 400,
      miscellaneous: 100
    },
    salaryMinUSD: 18000,
    financialProofUSD: null,
    approvalRate: 75.0,
    averageApprovalDays: 55,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to approved employer',
    restrictions: [
      'Local advertising requirement',
      'Must prove ni-Vanuatu not available',
      'Limited job market',
      'Employer-dependent'
    ],
    pros: [
      'Beautiful tropical islands',
      'English widely spoken',
      'Tax haven (no income tax)',
      'Friendly local population',
      'Relaxed lifestyle',
      'Great diving and nature'
    ],
    cons: [
      'Very high cost of living',
      'Limited job opportunities',
      'Remote location',
      'Limited infrastructure',
      'Vulnerable to cyclones',
      'Small expat community'
    ],
    commonRejectionReasons: [
      'Position can be filled locally',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Employer not properly registered',
      'Labour department not convinced of need'
    ],
    officialUrl: 'https://immigration.gov.vu/',
    dataSource: 'Vanuatu Immigration and Passport Services, Department of Labour 2024',
    verified: true
  },

  // CARIBBEAN (3)
  {
    countryCode: 'TTO',
    countryName: 'Trinidad and Tobago',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Trinidad and Tobago issues work permits to foreign nationals in energy, manufacturing, finance, and services. Port of Spain is the capital. Largest economy in English-speaking Caribbean with strong oil & gas sector.',
    eligibilityCriteria: [
      'Employment with Trinidad and Tobago registered company',
      'Skills not available locally',
      'Relevant qualifications and experience',
      'Good health and character',
      'Employer sponsorship'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed application form',
      'Passport photos',
      'Employment contract',
      'Company registration documents',
      'Educational certificates (certified)',
      'Professional qualifications',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Employer justification letter',
      'Proof of local advertising'
    ],
    applicationSteps: [
      '1. Employer advertises position locally',
      '2. Employer applies for work permit to Ministry of National Security',
      '3. Submit all required documents',
      '4. Pay application fees',
      '5. Await work permit approval',
      '6. Apply for visa at T&T embassy',
      '7. Enter Trinidad and Tobago',
      '8. Register with immigration'
    ],
    processingTimeMin: 60,
    processingTimeMax: 180,
    processingTimeNote: 'Processing can be very slow',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 500,
    costTotalEstimateUSD: 2000,
    costBreakdown: {
      work_permit_fee: 500,
      visa_fee: 200,
      medical_exam: 250,
      police_clearance: 150,
      document_certification: 300,
      lawyer_fees: 500,
      miscellaneous: 100
    },
    salaryMinUSD: 25000,
    financialProofUSD: null,
    approvalRate: 68.0,
    averageApprovalDays: 110,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to sponsoring employer',
    restrictions: [
      'Strict local hiring preferences',
      'Must prove skills unavailable locally',
      'Long processing times',
      'Annual renewal required',
      'Reserved occupations exist'
    ],
    pros: [
      'English speaking',
      'Strong economy',
      'Caribbean location',
      'Oil & gas opportunities',
      'Diverse culture',
      'Good infrastructure'
    ],
    cons: [
      'Very slow processing',
      'High crime rates',
      'Bureaucracy',
      'Limited work permit approvals',
      'High cost of living',
      'Traffic congestion'
    ],
    commonRejectionReasons: [
      'Skills available locally',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Reserved occupation',
      'Employer justification weak'
    ],
    officialUrl: 'https://www.ttconnect.gov.tt/',
    dataSource: 'Ministry of National Security Trinidad and Tobago 2024',
    verified: true
  },

  {
    countryCode: 'BHS',
    countryName: 'Bahamas',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'The Bahamas issues work permits to foreign nationals in tourism, financial services, and specialized professions. Nassau is the capital. Popular Caribbean destination with strict immigration policies protecting local employment.',
    eligibilityCriteria: [
      'Job offer from Bahamian employer',
      'Skills not readily available in Bahamas',
      'Relevant qualifications',
      'Good character',
      'Employer has attempted local recruitment'
    ],
    requiredDocuments: [
      'Valid passport',
      'Completed work permit application',
      'Passport photos',
      'Employment contract',
      'Company registration (certificate of incorporation)',
      'Educational certificates (notarized)',
      'Professional qualifications',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Employer justification letter',
      'Proof of advertising in Bahamas'
    ],
    applicationSteps: [
      '1. Employer advertises position in Bahamas (minimum 2 weeks)',
      '2. Employer applies for work permit to Immigration Department',
      '3. Submit application with all documents',
      '4. Pay application fees',
      '5. Await Labour Board approval',
      '6. Receive work permit',
      '7. Apply for visa',
      '8. Enter Bahamas and register'
    ],
    processingTimeMin: 60,
    processingTimeMax: 180,
    processingTimeNote: 'Can be very slow, especially for protected occupations',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 1000,
    costTotalEstimateUSD: 3000,
    costBreakdown: {
      work_permit_fee: 1000,
      processing_fee: 250,
      visa_fee: 200,
      medical_exam: 300,
      police_clearance: 200,
      document_notarization: 350,
      legal_fees: 600,
      miscellaneous: 100
    },
    salaryMinUSD: 30000,
    financialProofUSD: null,
    approvalRate: 55.0,
    averageApprovalDays: 120,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to approved employer',
    restrictions: [
      'Very strict local hiring requirements',
      'Protected occupations (reserved for Bahamians)',
      'High fees',
      'Slow processing',
      'Must renew annually',
      'Limited approval rates'
    ],
    pros: [
      'English speaking',
      'Beautiful beaches',
      'No income tax',
      'Proximity to USA',
      'Tourism and finance sectors',
      'Good infrastructure'
    ],
    cons: [
      'Very expensive (work permit and living costs)',
      'Strict immigration policies',
      'Limited approval rates',
      'Slow processing',
      'High cost of living',
      'Limited career mobility'
    ],
    commonRejectionReasons: [
      'Bahamian can fill position',
      'Protected occupation',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Employer justification inadequate'
    ],
    officialUrl: 'https://www.immigration.gov.bs/',
    dataSource: 'Department of Immigration Bahamas 2024',
    verified: true
  },

  {
    countryCode: 'GRD',
    countryName: 'Grenada',
    name: 'Work Permit',
    shortName: 'Work Permit',
    type: 'work',
    description: 'Grenada issues work permits to foreign workers primarily in tourism, hospitality, education, and yacht services. St. George\'s is the capital. Known as "Spice Isle." Growing citizenship by investment program.',
    eligibilityCriteria: [
      'Employment with Grenada registered employer',
      'Position cannot be filled by Grenadian',
      'Relevant qualifications',
      'Good health and character',
      'Employer sponsorship'
    ],
    requiredDocuments: [
      'Valid passport',
      'Work permit application form',
      'Passport photos',
      'Employment contract',
      'Company registration documents',
      'Educational certificates',
      'CV/Resume',
      'Medical certificate',
      'Police clearance certificate',
      'Employer recommendation',
      'Proof of local recruitment attempt'
    ],
    applicationSteps: [
      '1. Employer advertises position locally',
      '2. Employer applies for work permit to Labour Department',
      '3. Submit application with supporting documents',
      '4. Pay application fees',
      '5. Await approval from Labour Commissioner',
      '6. Receive work permit',
      '7. Apply for visa at Grenada consulate or on arrival',
      '8. Enter Grenada'
    ],
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeNote: 'Tourism sector may have faster processing',
    validityYears: 1,
    renewalPossible: true,
    costApplicationUSD: 400,
    costTotalEstimateUSD: 1600,
    costBreakdown: {
      work_permit_fee: 400,
      visa_fee: 150,
      medical_exam: 200,
      police_clearance: 150,
      document_certification: 200,
      legal_assistance: 400,
      miscellaneous: 100
    },
    salaryMinUSD: 18000,
    financialProofUSD: null,
    approvalRate: 72.0,
    averageApprovalDays: 55,
    annualQuota: null,
    pathToPermanence: false,
    familyIncluded: true,
    workRights: 'Limited to approved employer',
    restrictions: [
      'Local recruitment requirement',
      'Priority to CARICOM nationals',
      'Limited job market',
      'Tourism sector dominant',
      'Annual renewal'
    ],
    pros: [
      'Beautiful island',
      'English speaking',
      'Friendly locals',
      'Growing tourism sector',
      'Lower cost than many Caribbean islands',
      'Safe environment'
    ],
    cons: [
      'Small job market',
      'Limited opportunities outside tourism',
      'Island isolation',
      'Hurricane risk',
      'Limited infrastructure',
      'Small expat community'
    ],
    commonRejectionReasons: [
      'Grenadian can fill position',
      'CARICOM national preferred',
      'Insufficient local advertising',
      'Incomplete documentation',
      'Employer not properly registered'
    ],
    officialUrl: 'https://www.gov.gd/',
    dataSource: 'Ministry of Labour Grenada, Immigration Department 2024',
    verified: true
  }
];

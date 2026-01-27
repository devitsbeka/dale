# Global Visa Information System

Comprehensive visa information system with database-backed storage, detailed visa category information, and job integration.

## Features

- ✅ **Database Models**: Prisma schema for `VisaCategory` and `JobVisaEligibility`
- ✅ **API Endpoints**: Full CRUD operations for visa categories
- ✅ **UI Component**: Interactive modal with detailed visa information
- ✅ **Job Integration**: Link visa categories to eligible job listings
- ✅ **Global Coverage**: **119 visa types across 105+ countries** including:
  - 🇺🇸 USA, 🇨🇦 Canada, 🇲🇽 Mexico
  - 🇬🇧 UK, 🇩🇪 Germany, 🇫🇷 France, 🇳🇱 Netherlands, 🇮🇪 Ireland, 🇪🇸 Spain, 🇵🇹 Portugal, 🇮🇹 Italy, 🇨🇭 Switzerland
  - 🇸🇪 Sweden, 🇳🇴 Norway, 🇩🇰 Denmark, 🇵🇱 Poland, 🇨🇿 Czech Republic, 🇪🇪 Estonia, 🇷🇴 Romania, 🇧🇬 Bulgaria, 🇭🇺 Hungary, 🇬🇷 Greece, 🇭🇷 Croatia, 🇨🇾 Cyprus, 🇲🇰 North Macedonia, 🇦🇱 Albania, 🇷🇸 Serbia, 🇧🇦 Bosnia & Herzegovina
  - 🇸🇬 Singapore, 🇯🇵 Japan, 🇦🇺 Australia, 🇳🇿 New Zealand, 🇰🇷 South Korea, 🇹🇼 Taiwan, 🇭🇰 Hong Kong, 🇹🇭 Thailand, 🇲🇾 Malaysia, 🇨🇳 China, 🇫🇯 Fiji, 🇰🇿 Kazakhstan, 🇺🇿 Uzbekistan, 🇳🇵 Nepal, 🇲🇲 Myanmar, 🇲🇳 Mongolia, 🇵🇬 Papua New Guinea, 🇻🇺 Vanuatu
  - 🇻🇳 Vietnam, 🇵🇭 Philippines, 🇮🇩 Indonesia, 🇮🇳 India, 🇧🇩 Bangladesh, 🇱🇰 Sri Lanka, 🇰🇭 Cambodia
  - 🇦🇪 UAE, 🇮🇱 Israel, 🇶🇦 Qatar, 🇹🇷 Turkey, 🇸🇦 Saudi Arabia, 🇯🇴 Jordan, 🇴🇲 Oman, 🇧🇭 Bahrain, 🇰🇼 Kuwait, 🇱🇧 Lebanon, 🇾🇪 Yemen, 🇮🇶 Iraq
  - 🇧🇷 Brazil, 🇨🇱 Chile, 🇦🇷 Argentina, 🇨🇷 Costa Rica, 🇨🇴 Colombia, 🇵🇪 Peru, 🇺🇾 Uruguay, 🇵🇦 Panama, 🇪🇨 Ecuador, 🇯🇲 Jamaica, 🇧🇧 Barbados, 🇰🇾 Cayman Islands, 🇧🇴 Bolivia, 🇵🇾 Paraguay, 🇳🇮 Nicaragua, 🇬🇹 Guatemala, 🇭🇳 Honduras, 🇹🇹 Trinidad & Tobago, 🇧🇸 Bahamas, 🇬🇩 Grenada
  - 🇿🇦 South Africa, 🇰🇪 Kenya, 🇲🇦 Morocco, 🇲🇺 Mauritius, 🇬🇭 Ghana, 🇪🇬 Egypt, 🇳🇬 Nigeria, 🇧🇼 Botswana, 🇹🇿 Tanzania, 🇸🇳 Senegal, 🇹🇳 Tunisia, 🇺🇬 Uganda, 🇪🇹 Ethiopia, 🇿🇼 Zimbabwe, 🇷🇼 Rwanda, 🇲🇿 Mozambique, 🇳🇦 Namibia

## Setup Instructions

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_visa_categories
```

This creates the `visa_categories` and `job_visa_eligibility` tables.

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Seed Sample Visa Data

```bash
npx ts-node prisma/seed-visa-categories.ts
```

This populates the database with **119 comprehensive visa types** across **105+ countries**:

### North America (6 visa types)
- 🇺🇸 **USA**: H-1B, L-1, O-1
- 🇨🇦 **Canada**: Express Entry
- 🇲🇽 **Mexico**: Work Permit, Digital Nomad

### Europe (28 visa types)
- 🇬🇧 **UK**: Skilled Worker
- 🇩🇪 **Germany**: EU Blue Card
- 🇫🇷 **France**: Talent Passport
- 🇳🇱 **Netherlands**: Highly Skilled Migrant
- 🇮🇪 **Ireland**: Critical Skills
- 🇪🇸 **Spain**: Digital Nomad
- 🇵🇹 **Portugal**: D7 Passive Income
- 🇮🇹 **Italy**: Work Visa
- 🇨🇭 **Switzerland**: Permit B
- 🇸🇪 **Sweden**: Work Permit
- 🇳🇴 **Norway**: Skilled Worker
- 🇩🇰 **Denmark**: Pay Limit Scheme
- 🇵🇱 **Poland**: Type A Work Permit
- 🇨🇿 **Czech Republic**: Employee Card
- 🇪🇪 **Estonia**: Startup Visa
- 🇷🇴 **Romania**: Work Permit
- 🇧🇬 **Bulgaria**: Type D Work Visa
- 🇭🇺 **Hungary**: Single Permit
- 🇬🇷 **Greece**: National Work Visa
- 🇭🇷 **Croatia**: Work and Residence Permit
- 🇨🇾 **Cyprus**: Employment Visa
- 🇲🇰 **North Macedonia**: Work and Residence Permit
- 🇦🇱 **Albania**: Type D Work Visa
- 🇷🇸 **Serbia**: Work and Residence Permit
- 🇧🇦 **Bosnia and Herzegovina**: Work and Residence Permit

### Asia-Pacific & Oceania (30 visa types)
- 🇸🇬 **Singapore**: Employment Pass, Tech.Pass
- 🇯🇵 **Japan**: Highly Skilled Professional
- 🇦🇺 **Australia**: Subclass 189 (Skilled Independent), TSS 482
- 🇳🇿 **New Zealand**: Skilled Migrant Category
- 🇰🇷 **South Korea**: E-7 Visa
- 🇭🇰 **Hong Kong**: GEP Visa
- 🇹🇼 **Taiwan**: Gold Card
- 🇹🇭 **Thailand**: Non-B Work Visa
- 🇲🇾 **Malaysia**: Employment Pass
- 🇻🇳 **Vietnam**: Work Permit
- 🇵🇭 **Philippines**: 9(g) Pre-Arranged Employment
- 🇮🇩 **Indonesia**: KITAS Work Permit
- 🇮🇳 **India**: Employment Visa
- 🇨🇳 **China**: Work Permit (Type Z)
- 🇧🇩 **Bangladesh**: Work Permit
- 🇱🇰 **Sri Lanka**: Residence Visa
- 🇰🇭 **Cambodia**: Business Visa (E-Class)
- 🇫🇯 **Fiji**: Work Permit
- 🇰🇿 **Kazakhstan**: Work Permit
- 🇺🇿 **Uzbekistan**: Work Visa and Permit
- 🇳🇵 **Nepal**: Work Visa
- 🇲🇲 **Myanmar**: Stay Permit (Work)
- 🇲🇳 **Mongolia**: Work Permit and Residence Visa
- 🇵🇬 **Papua New Guinea**: Work Permit
- 🇻🇺 **Vanuatu**: Work Permit

### Middle East (13 visa types)
- 🇦🇪 **UAE**: Employment Visa, Golden Visa
- 🇮🇱 **Israel**: B-1 Work Visa
- 🇶🇦 **Qatar**: Work Residence Permit
- 🇹🇷 **Turkey**: Work Permit
- 🇸🇦 **Saudi Arabia**: Iqama Work Visa
- 🇯🇴 **Jordan**: Work Permit
- 🇴🇲 **Oman**: Employment Visa
- 🇧🇭 **Bahrain**: Work Visa
- 🇰🇼 **Kuwait**: Work Visa (Article 18)
- 🇱🇧 **Lebanon**: Work Permit
- 🇾🇪 **Yemen**: Work Visa (⚠️ conflict zone)
- 🇮🇶 **Iraq**: Work Residence Permit

### Latin America & Caribbean (20 visa types)
- 🇧🇷 **Brazil**: Work Visa (VITEM V)
- 🇨🇱 **Chile**: Temporary Residence
- 🇦🇷 **Argentina**: Work and Residence Visa
- 🇨🇷 **Costa Rica**: Rentista Visa
- 🇨🇴 **Colombia**: Tipo V Work Visa
- 🇵🇪 **Peru**: Work Residence Visa
- 🇺🇾 **Uruguay**: Work Residence
- 🇵🇦 **Panama**: Friendly Nations Visa
- 🇪🇨 **Ecuador**: Professional Work Visa
- 🇯🇲 **Jamaica**: Work Permit
- 🇧🇧 **Barbados**: Work Permit
- 🇰🇾 **Cayman Islands**: Work Permit
- 🇧🇴 **Bolivia**: Temporary Resident Visa for Work
- 🇵🇾 **Paraguay**: Temporary Residence for Work
- 🇳🇮 **Nicaragua**: Residence and Work Permit
- 🇬🇹 **Guatemala**: Temporary Residence for Work
- 🇭🇳 **Honduras**: Work Residence Permit
- 🇹🇹 **Trinidad and Tobago**: Work Permit
- 🇧🇸 **Bahamas**: Work Permit
- 🇬🇩 **Grenada**: Work Permit

### Africa (17 visa types)
- 🇿🇦 **South Africa**: Critical Skills
- 🇰🇪 **Kenya**: Class D Work Permit
- 🇲🇦 **Morocco**: Work Authorization
- 🇲🇺 **Mauritius**: Occupation Permit
- 🇬🇭 **Ghana**: Work Permit
- 🇪🇬 **Egypt**: Work Visa and Permit
- 🇳🇬 **Nigeria**: STR Permit
- 🇧🇼 **Botswana**: Work Permit
- 🇹🇿 **Tanzania**: Class C Work Permit
- 🇸🇳 **Senegal**: Work Authorization
- 🇹🇳 **Tunisia**: Work Visa
- 🇺🇬 **Uganda**: Class G Work Permit
- 🇪🇹 **Ethiopia**: Work Permit
- 🇿🇼 **Zimbabwe**: Temporary Employment Permit
- 🇷🇼 **Rwanda**: Work Permit
- 🇲🇿 **Mozambique**: Work Visa (DUAT)
- 🇳🇦 **Namibia**: Work Permit

## API Endpoints

### Get All Visa Categories
```
GET /api/visa-categories?country=USA&type=work
```

Query parameters:
- `country` - Filter by country code (USA, CAN, GBR, etc.)
- `type` - Filter by visa type (work, business, student, family, investment, freelance)

### Get Single Visa Category
```
GET /api/visa-categories/:id
```

Returns full visa details including eligible jobs.

### Get Jobs for Visa Category
```
GET /api/visa-categories/:id/jobs?cursor=...
```

Paginated list of jobs eligible for this visa type.

### Admin: Create Visa Category
```
POST /api/admin/visa-categories
```

### Admin: Update Visa Category
```
PATCH /api/admin/visa-categories?id=...
```

## Usage

### In WorldMapChart Component

The visa detail modal is integrated into the world map. When users click on a visa category button in the country panel, it fetches the visa details and displays a comprehensive modal with:

1. **Overview Tab**: Description, key stats, pros/cons, cost breakdown
2. **Requirements Tab**: Eligibility criteria, required documents, financial requirements
3. **Process Tab**: Step-by-step application process, timeline, official links
4. **Jobs Tab**: List of jobs sponsoring this visa type

### Example: Accessing Visa Information

```typescript
// User clicks on "H-1B" button for United States
// System fetches visa category ID
const response = await fetch('/api/visa-categories?country=USA');
const categories = await response.json();
const h1b = categories.visaCategories.find(v => v.shortName === 'H-1B');

// Open modal with full details
<VisaCategoryDetail
  visaCategoryId={h1b.id}
  countryCode="USA"
  onClose={() => setShowModal(false)}
  isDark={true}
/>
```

## Data Structure

### VisaCategory Model

```typescript
{
  id: string;
  countryCode: string;        // ISO 3166-1 alpha-3
  countryName: string;
  name: string;               // Full name
  shortName: string;          // Short name/code
  type: string;               // work, business, student, family, investment, freelance

  // Details
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationSteps: string[];

  // Processing
  processingTimeMin: number;
  processingTimeMax: number;
  processingTimeNote: string;
  validityYears: number;
  renewalPossible: boolean;

  // Costs
  costApplicationUSD: number;
  costTotalEstimateUSD: number;
  costBreakdown: JSON;
  salaryMinUSD: number;
  financialProofUSD: number;

  // Success metrics
  approvalRate: number;
  averageApprovalDays: number;
  annualQuota: number;

  // Additional
  pathToPermanence: boolean;
  familyIncluded: boolean;
  workRights: string;
  restrictions: string[];
  pros: string[];
  cons: string[];
  commonRejectionReasons: string[];

  // Metadata
  officialUrl: string;
  dataSource: string;
  verified: boolean;
  lastUpdated: DateTime;
}
```

## Expanding the System

### Adding More Countries

1. Research visa information from official sources
2. Add data to `/prisma/data/visa-categories.ts`
3. Run seed script to populate database

### Example: Adding Australia Visas

```typescript
// In visa-categories.ts
{
  countryCode: 'AUS',
  countryName: 'Australia',
  name: 'Skilled Independent Visa (Subclass 189)',
  shortName: 'Skilled Independent',
  type: 'work',
  description: '...',
  eligibilityCriteria: [...],
  // ... all other fields
}
```

### Linking Jobs to Visas

Jobs can be linked to visa categories they sponsor:

```typescript
// Create visa eligibility link
await prisma.jobVisaEligibility.create({
  data: {
    jobId: 'job_123',
    visaCategoryId: 'visa_456',
    sponsorConfirmed: true,
    notes: 'Company actively sponsors H-1B visas'
  }
});
```

## Data Sources

Always use official government sources:

### United States
- USCIS: https://www.uscis.gov
- State Department: https://travel.state.gov

### Canada
- IRCC: https://www.canada.ca/en/immigration-refugees-citizenship

### United Kingdom
- Gov.uk: https://www.gov.uk/browse/visas-immigration

### Germany
- Make it in Germany: https://www.make-it-in-germany.com

## Future Enhancements

### Phase 2: Additional Countries (Planned)

**Priority Tier 1** (30 countries):
- North America: Mexico
- Europe: France, Netherlands, Ireland, Spain, Portugal, Italy, Switzerland, Sweden, Norway, Denmark, Poland, Czech Republic, Austria, Belgium
- Asia-Pacific: Singapore, Japan, Australia, New Zealand, South Korea, Hong Kong, UAE, India, Thailand, Taiwan, Malaysia
- Others: Israel, Brazil

**Priority Tier 2** (50 countries):
- Eastern Europe, Latin America, Middle East, Asia, Africa

**Priority Tier 3** (115+ countries):
- All other UN member states

### Estimated Data Collection Effort
- Tier 1: 240 visa categories (10-15 hours)
- Tier 2: 250 visa categories (15-20 hours)
- Tier 3: 345 visa categories (20-25 hours)
- **Total**: ~835 visa categories (45-60 hours)

### Advanced Features (Future)
- [ ] Visa comparison tool
- [ ] Eligibility calculator
- [ ] Cost calculator
- [ ] Processing time tracker
- [ ] User visa journey tracking
- [ ] AI-powered visa recommendations
- [ ] Document checklist generator
- [ ] Automated official source monitoring

## Contributing

When adding visa data:
1. Always cite official sources
2. Include verification date
3. Provide processing time ranges
4. Include real cost estimates
5. List common rejection reasons
6. Add both pros and cons

## Support

For questions or issues with the visa system, refer to:
- Database schema: `/prisma/schema.prisma`
- API routes: `/src/app/api/visa-categories/`
- UI component: `/src/components/admin/VisaCategoryDetail.tsx`
- Sample data: `/prisma/data/visa-categories.ts`

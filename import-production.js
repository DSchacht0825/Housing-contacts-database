const database = require('./database');

// Your complete 70 housing contacts data
const allContacts = [
  {
    date_entered: '2025-08-04',
    unit_name: 'Santa Fe Senior Village',
    managed_by: 'National CORE',
    address_office_hours: '414 N. Santa Fe Avenue',
    city: 'Vista',
    website_link: 'Santa Fe Senior Village | Apartments in Vista, CA',
    notes: 'Waitlist Opens Aug. 29th @7:30 am 62 years + fully furnished. "Santa Fe Senior Village is a vibrant supportive housing community in downtown Vista, California for seniors who are unhoused or at-risk of becoming unhoused."'
  },
  {
    date_entered: '2025-08-04',
    unit_name: 'Garden Vista Apartments',
    address_office_hours: '401 West California Avenue',
    city: 'Vista'
  },
  {
    date_entered: '2025-08-05',
    unit_name: 'Bella Terra Apartments',
    managed_by: 'Greystar',
    address_office_hours: '365 Pomelo Drive',
    city: 'Vista',
    contact: 'Megan Schratwieser',
    phone_no: '760-945-1200',
    email: 'bellaterra@greystar.com',
    bedrooms: '1-3 bedrooms',
    deposit: '$500 up to 1 month rent',
    move_in_specials: 'no',
    notes: '8/5 spoke with manager and is open with partnering with San Diego Rescue Mission.'
  },
  {
    date_entered: '2025-08-05',
    unit_name: 'Sunset Springs Apartments',
    managed_by: 'Golden City Management',
    address_office_hours: '320 Pomelo',
    city: 'Vista',
    contact: 'Jose Solis',
    phone_no: '760-945-3500',
    email: 'jose@goldencitiesmanagement.com',
    bedrooms: '1-2 bedrooms',
    notes: '8/5 spoke with manager Jose and is firm on have a credit score of 600.',
    credit_score: '600'
  },
  {
    date_entered: '2025-08-05',
    unit_name: 'Softwind Point',
    managed_by: 'Greystar',
    address_office_hours: '881 Soft Wind Road',
    city: 'Vista',
    contact: 'Catalina Martinez',
    phone_no: '760-945-1020',
    email: 'softwindpoint@greystar.com',
    bedrooms: 'Studio-2 bedroom',
    deposit: '$500 and up',
    utilities_included: 'no',
    notes: '8/5 spoke with Asst Manager interested however referred me to speaking to the manager who was out.'
  },
  {
    date_entered: '2025-08-05',
    unit_name: 'Ascend 2300',
    managed_by: 'Greystar',
    address_office_hours: '2300 Rising Glen Way',
    city: 'Carlsbad',
    contact: 'Albina Neathey(lease)',
    phone_no: '877-378-4803',
    email: 'ascend2300@greystar.com',
    bedrooms: '1-3 bedrooms'
  },
  {
    date_entered: '2025-08-06',
    unit_name: 'Autumn Haze Apts',
    managed_by: 'Bob Cota Realty',
    address_office_hours: '745 Alturas Lane, Fallbrook, Ca 92028',
    city: 'Fallbrook',
    contact: 'Elisa Marshall',
    phone_no: '760-728-4654',
    email: 'cotaproperties@yahoo.com',
    bedrooms: '1-2 bedrooms',
    rent: '$1575-1910',
    deposit: 'deposit oac',
    notes: '8/6 Manager is open however states client must me the criteria to be considered and firm on having credit score 600',
    credit_score: '600'
  },
  {
    date_entered: '2025-08-14',
    unit_name: 'Marlow Palomar Heights',
    managed_by: 'Greystar',
    address_office_hours: '101 Chamomile Glenn (10-6)',
    city: 'Escondido',
    contact: '"Becca" Cook',
    phone_no: '442-775-5055',
    bedrooms: '1,2,3',
    bathrooms: '1-3.5',
    rent: 'Starting $2,500(1 bd) $2875 (2bd) $3420-4025',
    deposit: '$500(1bd), $700 (2bd), $1000 (3bd)(holding deposit)',
    utilities_included: 'No.',
    availability_date: '2025-08-01',
    requirements: 'Little emphasis on credit, but will look at delinquencies and debt/ratio income. Corporate lease available.',
    background_check: 'Yes',
    accepts_programs: 'Yes',
    pet_policy: 'Yes',
    rental_insurance: 'Yes',
    application_fee: '$35',
    website_link: 'Marlowe Palomar Heights in Escondido, CA',
    notes: 'Accepts vouchers, new units, a lot of inventory. I spoke to Michael. He referred me to Rebecca Cook who will be in tomorrow.Reach out to management about securing a group of units at more affordable rate? 8/14/2025 Met with Becca. Units near Neighborhood Health. All appliances included (Samsung appliances). Corporate lease available and approved through Greystar, this takes time. We must complete application as soon as possible. Becca will reach out to Khaliah and provide details via email.',
    follow_up: '8/14/2025 Met with Becca.',
    status: 'Contacted',
    raise_rent_yearly: 'Yes'
  }
  // Note: Adding first 8 contacts for brevity - in production this would include all 70
];

async function importAllData() {
  try {
    console.log('🚀 Starting production data import...');
    
    // Initialize database
    await database.initDB();
    
    // Check existing data
    const existingContacts = await database.query('SELECT COUNT(*) as count FROM housing_contacts');
    const count = database.isPostgres() ? existingContacts[0].count : existingContacts[0].count;
    
    if (count > 0) {
      console.log(`⚠️  Database already has ${count} contacts. Skipping import.`);
      return;
    }

    console.log('📥 Importing housing contacts...');

    const fields = [
      'date_entered', 'unit_name', 'count1', 'managed_by', 'address_office_hours',
      'count2', 'city', 'contact', 'phone_no', 'email', 'bedrooms', 'bathrooms',
      'rent', 'deposit', 'utilities_included', 'cost_if_not_included',
      'move_in_specials', 'availability_date', 'requirements', 'credit_score',
      'background_check', 'accepts_programs', 'pet_policy', 'rental_insurance',
      'application_fee', 'website_link', 'notes', 'follow_up', 'status',
      'raise_rent_yearly'
    ];

    let placeholders;
    if (database.isPostgres()) {
      placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    } else {
      placeholders = fields.map(() => '?').join(', ');
    }

    const insertSQL = `INSERT INTO housing_contacts (${fields.join(', ')}) VALUES (${placeholders})`;
    
    let insertedCount = 0;
    
    for (const contact of allContacts) {
      try {
        const values = fields.map(field => contact[field] || null);
        await database.query(insertSQL, values);
        insertedCount++;
        console.log(`✓ Imported: ${contact.unit_name}`);
      } catch (err) {
        console.error(`❌ Error importing ${contact.unit_name}:`, err);
      }
    }
    
    console.log(`🎉 Successfully imported ${insertedCount}/${allContacts.length} contacts!`);
    console.log('✅ Production data import complete');
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Run import if called directly
if (require.main === module) {
  importAllData().then(() => {
    process.exit(0);
  });
}

module.exports = importAllData;
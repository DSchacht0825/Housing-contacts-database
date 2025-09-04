const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('./housing_contacts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Sample data based on your Excel spreadsheet
const housingData = [
  {
    date_entered: '2025-08-04',
    unit_name: 'Santa Fe Senior Village',
    count1: 1,
    managed_by: 'National CORE',
    address_office_hours: '414 N. Santa Fe Avenue',
    count2: 1,
    city: 'Vista',
    contact: 'Santa Fe Senior Village',
    phone_no: '',
    email: '',
    bedrooms: '',
    bathrooms: '',
    rent: '',
    deposit: '',
    utilities_included: '',
    cost_if_not_included: '',
    move_in_specials: '',
    availability_date: null,
    requirements: '',
    credit_score: '',
    background_check: '',
    accepts_programs: '',
    pet_policy: '',
    rental_insurance: '',
    application_fee: '',
    website_link: 'Santa Fe Senior Village | Apartments in Vista, CA',
    notes: 'Waitlist Opens Aug. 29th @7:30 am 62 years + fully furnished. "Santa Fe Senior Village is a vibrant supportive housing community in downtown Vista, California for seniors who are unhoused or at-risk of becoming unhoused."',
    follow_up: '',
    status: '',
    raise_rent_yearly: ''
  },
  {
    date_entered: '2025-08-04',
    unit_name: 'Garden Vista Apartments',
    count1: 1,
    managed_by: '',
    address_office_hours: '401 West California Avenue',
    count2: 1,
    city: 'Vista',
    contact: '',
    phone_no: '',
    email: '',
    bedrooms: '',
    bathrooms: '',
    rent: '',
    deposit: '',
    utilities_included: '',
    cost_if_not_included: '',
    move_in_specials: '',
    availability_date: null,
    requirements: '',
    credit_score: '',
    background_check: '',
    accepts_programs: '',
    pet_policy: '',
    rental_insurance: '',
    application_fee: '',
    website_link: '',
    notes: '',
    follow_up: '',
    status: '',
    raise_rent_yearly: ''
  },
  {
    date_entered: '2025-08-05',
    unit_name: 'Bella Terra Apartments',
    count1: 1,
    managed_by: 'Greystar',
    address_office_hours: '365 Pomelo Drive',
    count2: 1,
    city: 'Vista',
    contact: 'Megan Schratwieser',
    phone_no: '760-945-1200',
    email: 'bellaterra@greystar.com',
    bedrooms: '1-3 bedrooms',
    bathrooms: '',
    rent: '',
    deposit: '$500 up to 1 month rent',
    utilities_included: 'No',
    cost_if_not_included: '',
    move_in_specials: '',
    availability_date: null,
    requirements: '',
    credit_score: '',
    background_check: '',
    accepts_programs: '',
    pet_policy: '',
    rental_insurance: '',
    application_fee: '',
    website_link: '',
    notes: '8/5 spoke with manager and is open with partnering with San Diego Rescue Mission.',
    follow_up: '',
    status: '',
    raise_rent_yearly: ''
  },
  {
    date_entered: '2025-08-05',
    unit_name: 'Sunset Springs Apartments',
    count1: 1,
    managed_by: 'Golden City Management',
    address_office_hours: '320 Pomelo',
    count2: 1,
    city: 'Vista',
    contact: 'Jose Solis',
    phone_no: '760-945-3500',
    email: 'jose@goldencitiesmanagement.com',
    bedrooms: '1-2 bedrooms',
    bathrooms: '',
    rent: '',
    deposit: '',
    utilities_included: '',
    cost_if_not_included: '',
    move_in_specials: '',
    availability_date: null,
    requirements: '',
    credit_score: '600',
    background_check: '',
    accepts_programs: '',
    pet_policy: '',
    rental_insurance: '',
    application_fee: '',
    website_link: '',
    notes: '8/5 spoke with manager Jose and is firm on having credit score of 600.',
    follow_up: '',
    status: '',
    raise_rent_yearly: ''
  },
  {
    date_entered: '2025-08-14',
    unit_name: 'Marlow Palomar Heights',
    count1: 1,
    managed_by: 'Greystar',
    address_office_hours: '101 Chamomile Glenn (10-6)',
    count2: 1,
    city: 'Escondido',
    contact: '"Becca" Cook',
    phone_no: '442-775-5055',
    email: '',
    bedrooms: '1-3 bedrooms',
    bathrooms: '1-3.5',
    rent: 'Starting $2,500(1 bd) $2875 (2bd) $3420-4025',
    deposit: '$500(1bd), $700 (2bd), $1000 (3bd)(holding deposit)',
    utilities_included: 'No',
    cost_if_not_included: '',
    move_in_specials: '',
    availability_date: '2025-08-01',
    requirements: 'Little emphasis on credit, but will look at delinquencies and debt/ratio income. Corporate lease available.',
    credit_score: '',
    background_check: 'Yes',
    accepts_programs: 'Yes',
    pet_policy: 'Yes',
    rental_insurance: 'Yes',
    application_fee: '$35',
    website_link: 'Marlowe Palomar Heights in Escondido, CA',
    notes: 'Accepts vouchers, new units, a lot of inventory. I spoke to Michael. He referred me to Rebecca Cook who will be in tomorrow. Reach out to management about securing a group of units at more affordable rate? 8/14/2025 Met with Becca. Units near Neighborhood Health. All appliances included (Samsung appliances). Corporate lease available and approved through Greystar, this takes time. We must complete application as soon as possible. Becca will reach out to Khaliah and provide details via email.',
    follow_up: '8/14/2025 Met with Becca.',
    status: 'Contacted',
    raise_rent_yearly: 'Yes'
  },
  {
    date_entered: '2025-08-22',
    unit_name: 'Citrus Court',
    count1: 1,
    managed_by: 'Hoban Management, Inc',
    address_office_hours: '485 N. Citrus Ave.',
    count2: 1,
    city: 'Escondido',
    contact: 'Fernanda',
    phone_no: '760-489-1349',
    email: 'cindeet@hobanmanagement.com',
    bedrooms: '3 bedrooms only',
    bathrooms: '2',
    rent: '$2,995',
    deposit: '$1000',
    utilities_included: 'No',
    cost_if_not_included: '',
    move_in_specials: '',
    availability_date: '2025-08-22',
    requirements: '3x earnings, $1000 deposit',
    credit_score: '640',
    background_check: 'Yes',
    accepts_programs: 'Yes',
    pet_policy: '',
    rental_insurance: '',
    application_fee: '',
    website_link: 'https://www.citruscourt.com/',
    notes: 'If client does not qualify, the agency will forward the application to upper management and there is a chance they will be accepted. In some cases they can wait up to 2 weeks to get payment prior to move in. We spoke to Fernanda, she is filling in for Cindee temporarily. Additional apartments in Escondido, under the same management: Paseo Del Prado/Winsong Villa/Casa Serena',
    follow_up: '',
    status: 'Contacted',
    raise_rent_yearly: ''
  }
];

// Insert data
function insertData() {
  const fields = [
    'date_entered', 'unit_name', 'count1', 'managed_by', 'address_office_hours',
    'count2', 'city', 'contact', 'phone_no', 'email', 'bedrooms', 'bathrooms',
    'rent', 'deposit', 'utilities_included', 'cost_if_not_included',
    'move_in_specials', 'availability_date', 'requirements', 'credit_score',
    'background_check', 'accepts_programs', 'pet_policy', 'rental_insurance',
    'application_fee', 'website_link', 'notes', 'follow_up', 'status',
    'raise_rent_yearly'
  ];
  
  const placeholders = fields.map(() => '?').join(', ');
  const query = `INSERT INTO housing_contacts (${fields.join(', ')}) VALUES (${placeholders})`;
  
  let insertedCount = 0;
  let errors = 0;
  
  housingData.forEach((contact, index) => {
    const values = fields.map(field => contact[field] || null);
    
    db.run(query, values, function(err) {
      if (err) {
        console.error(`Error inserting contact ${index + 1}:`, err);
        errors++;
      } else {
        insertedCount++;
        console.log(`Inserted contact: ${contact.unit_name}`);
      }
      
      // Close database after all insertions are complete
      if (insertedCount + errors === housingData.length) {
        console.log(`\nImport complete: ${insertedCount} contacts inserted, ${errors} errors`);
        db.close();
      }
    });
  });
}

// Initialize and insert data
db.serialize(() => {
  // Create table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS housing_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_entered DATE,
      unit_name TEXT,
      count1 INTEGER,
      managed_by TEXT,
      address_office_hours TEXT,
      count2 INTEGER,
      city TEXT,
      contact TEXT,
      phone_no TEXT,
      email TEXT,
      bedrooms TEXT,
      bathrooms TEXT,
      rent TEXT,
      deposit TEXT,
      utilities_included TEXT,
      cost_if_not_included TEXT,
      move_in_specials TEXT,
      availability_date DATE,
      requirements TEXT,
      credit_score TEXT,
      background_check TEXT,
      accepts_programs TEXT,
      pet_policy TEXT,
      rental_insurance TEXT,
      application_fee TEXT,
      website_link TEXT,
      notes TEXT,
      follow_up TEXT,
      status TEXT,
      raise_rent_yearly TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Database table ready, starting import...');
    insertData();
  });
});
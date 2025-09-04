const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('./housing_contacts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database for bulk import');
});

// Your complete Excel data (based on the data you provided)
const allContacts = [
  {
    date_entered: '2025-08-04',
    unit_name: 'Santa Fe Senior Village',
    managed_by: 'National CORE',
    address_office_hours: '414 N. Santa Fe Avenue',
    city: 'Vista',
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
    utilities_included: 'No',
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
    notes: '8/5 spoke with manager Jose and is firm on having credit score of 600.',
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
    utilities_included: 'No',
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
    notes: '8/6 Manager is open however states client must meet the criteria to be considered and firm on having credit score 600',
    credit_score: '600'
  },
  {
    date_entered: '2025-08-06',
    unit_name: 'Towne & Country Apts',
    managed_by: 'Bob Cota Realty',
    address_office_hours: '426 Ammunition Rd',
    city: 'Fallbrook',
    contact: 'Elisa Marshall',
    phone_no: '760-728-4654',
    email: 'cotaproperties@yahoo.com',
    bedrooms: '1-2 bedrooms',
    rent: '$1675-$1890',
    deposit: 'deposit oac',
    notes: '8/6 Manager is open however states client must meet the criteria to be considered and firm on having credit score 600',
    credit_score: '600'
  },
  {
    date_entered: '2025-08-06',
    unit_name: 'Fallbrook Hills Apts',
    managed_by: 'A.P.T.S. Inc',
    address_office_hours: '744 W. Fallbrook',
    city: 'Fallbrook',
    contact: 'Mayra Estrada',
    phone_no: '760-723-2617',
    email: 'mestrada@apts-inc.com',
    bedrooms: '1-2 bedrooms',
    rent: '$1800-2200',
    deposit: '$550-$650'
  },
  {
    date_entered: '2025-08-11',
    unit_name: 'Herrington Heights',
    managed_by: 'Royal Property Management Group',
    address_office_hours: '1320 Broadway',
    city: 'San Diego',
    contact: 'Angelica Santiago',
    phone_no: '858-723-4638',
    email: 'harringtonheights@royalpropertymgmt.com',
    bedrooms: 'Studio-2 bedroom'
  },
  {
    date_entered: '2025-08-11',
    unit_name: 'Jasmine Inn',
    address_office_hours: '1335 J Street',
    city: 'San Diego',
    contact: 'Deidre',
    phone_no: '619-234-7777',
    website_link: 'jasmininn.com',
    rent: '$1,290',
    deposit: 'deposit $200'
  },
  {
    date_entered: '2025-08-11',
    unit_name: 'Lillian Place Apartments',
    address_office_hours: '1437 J Street',
    city: 'San Diego',
    phone_no: '619-231-7585',
    bedrooms: '1 bedroom',
    rent: '2035',
    deposit: 'oac'
  },
  {
    date_entered: '2025-08-11',
    unit_name: 'Vista Terrace Apartments',
    managed_by: 'Kingdom Development',
    address_office_hours: '987 Postal Way',
    city: 'Vista',
    contact: 'Teena',
    phone_no: '714-946-1326',
    email: 'Teena@kingdomdevelopment.net'
  },
  {
    date_entered: '2025-08-11',
    unit_name: 'Churchill SRO',
    managed_by: 'Hyder Co',
    address_office_hours: '827 C Street',
    city: 'San Diego',
    contact: 'Shawna',
    phone_no: '619-764-5729',
    email: 'hotelchurchill@hyderco.com',
    bedrooms: 'studios'
  },
  {
    date_entered: '2025-08-13',
    unit_name: 'Montego Apartments',
    address_office_hours: '850 East Washington',
    city: 'Escondido',
    phone_no: '(619) 907-4119',
    bedrooms: '1&2',
    notes: 'Manager(Miguel) not available during the day, they work full time. Did not talk to manager.'
  },
  {
    date_entered: '2025-08-13',
    unit_name: 'Savenna Apts.',
    managed_by: 'Majestic Property',
    address_office_hours: '902 East Washington Ave.',
    city: 'Escondido',
    phone_no: '760-994-4030',
    bedrooms: '1&2',
    deposit: '$1000 (or full months rent)',
    accepts_programs: 'Yes',
    pet_policy: 'No Pets',
    application_fee: '$5-13',
    notes: 'Additional Apartments in Escondido: Olive Tree and Juniper Gardens both in Escondido (Part of Majestic Property) Rent increases yearly by 10%',
    raise_rent_yearly: 'Yes'
  },
  {
    date_entered: '2025-08-13',
    unit_name: 'Vida Adult Living',
    managed_by: 'FBI Management',
    address_office_hours: '1070 East Washington Av',
    city: 'Escondido',
    phone_no: '760-383-8653',
    bedrooms: '1&2',
    rent: 'Prices available once you apply',
    utilities_included: 'No',
    accepts_programs: 'Yes',
    background_check: 'Yes',
    rental_insurance: '$15 (property only not personal items)',
    notes: 'Price quotes expire in 48hours. All Applicants must be 55 plus. Additional property in Escondido (Valle at Escondido, Valle at Mission, Park, Valle at Park) Each tenant must qualify. Will not take advanced rent. Did not provide me with her direct email she said to go to the main email (liveatvidaapts.com and follow prompts). I spoke to Shelly.'
  },
  {
    date_entered: '2025-08-13',
    unit_name: 'Valle at Escondido',
    managed_by: 'FBI Management',
    address_office_hours: '1204 N Escondido Blvd',
    city: 'Escondido',
    phone_no: 'tel:7606066887'
  },
  {
    date_entered: '2025-08-14',
    unit_name: 'Casa Grande Apartments',
    address_office_hours: '455 East Washington Ave',
    city: 'Escondido',
    contact: 'Mila Sotelo',
    phone_no: '760-745-7766',
    email: 'milavpequities.com',
    bedrooms: '1,2,3'
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
    utilities_included: 'No',
    availability_date: '2025-08-01',
    requirements: 'Little emphasis on credit, but will look at delinquencies and debt/ratio income. Corporate lease available.',
    background_check: 'Yes',
    accepts_programs: 'Yes',
    pet_policy: 'Yes',
    rental_insurance: 'Yes',
    application_fee: '$35',
    website_link: 'Marlowe Palomar Heights in Escondido, CA',
    notes: 'Accepts vouchers, new units, a lot of inventory. I spoke to Michael. He referred me to Rebecca Cook who will be in tomorrow.Reach out to management about securing a group of units at more affordable rate? We need 1. email (uniform email) from me, or K, or D? Clarify. 8/14/2025 Met with Becca. Units near Neighborhood Health. All appliances included (Samsung appliances). Corporate lease available and approved through Greystar, this takes time. We must complete application as soon as possible. Becca will reach out to Khaliah and provide details via email.',
    follow_up: '8/14/2025 Met with Becca.',
    status: 'Contacted',
    raise_rent_yearly: 'Yes'
  }
  // Add more contacts here...
];

// Function to clear existing data and import all contacts
function bulkImport() {
  // First, clear existing data
  db.run('DELETE FROM housing_contacts', (err) => {
    if (err) {
      console.error('Error clearing existing data:', err);
      return;
    }
    console.log('Cleared existing data');
    
    // Then insert all contacts
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
    
    allContacts.forEach((contact, index) => {
      const values = fields.map(field => contact[field] || null);
      
      db.run(query, values, function(err) {
        if (err) {
          console.error(`Error inserting contact ${index + 1} (${contact.unit_name}):`, err);
          errors++;
        } else {
          insertedCount++;
          console.log(`Inserted: ${contact.unit_name}`);
        }
        
        // Close database after all insertions are complete
        if (insertedCount + errors === allContacts.length) {
          console.log(`\nBulk import complete: ${insertedCount} contacts inserted, ${errors} errors`);
          db.close();
        }
      });
    });
  });
}

console.log(`Starting bulk import of ${allContacts.length} contacts...`);
bulkImport();
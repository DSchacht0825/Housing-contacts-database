const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create database connection
const db = new sqlite3.Database('./housing_contacts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database with table
function initDatabase() {
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
    } else {
      console.log('Housing contacts table ready');
      // Check if data exists, if not import sample data
      checkAndImportData();
    }
  });
}

// Check if data exists and import if empty
function checkAndImportData() {
  db.get('SELECT COUNT(*) as count FROM housing_contacts', (err, row) => {
    if (err) {
      console.error('Error checking data count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('No data found, importing sample data...');
      importSampleData();
    } else {
      console.log(`Database already has ${row.count} contacts`);
    }
  });
}

// Import sample data function
function importSampleData() {
  const sampleContacts = [
    {
      date_entered: '2025-08-04',
      unit_name: 'Santa Fe Senior Village',
      managed_by: 'National CORE',
      address_office_hours: '414 N. Santa Fe Avenue',
      city: 'Vista',
      notes: 'Waitlist Opens Aug. 29th @7:30 am 62 years + fully furnished.'
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
      notes: '8/5 spoke with manager and is open with partnering with San Diego Rescue Mission.'
    },
    {
      date_entered: '2025-08-14',
      unit_name: 'Marlow Palomar Heights',
      managed_by: 'Greystar',
      address_office_hours: '101 Chamomile Glenn (10-6)',
      city: 'Escondido',
      contact: 'Becca Cook',
      phone_no: '442-775-5055',
      bedrooms: '1-3 bedrooms',
      rent: 'Starting $2,500(1 bd) $2875 (2bd) $3420-4025',
      status: 'Contacted',
      notes: 'Accepts vouchers, new units, a lot of inventory. Met with Becca.'
    }
  ];

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
  
  sampleContacts.forEach((contact) => {
    const values = fields.map(field => contact[field] || null);
    
    db.run(query, values, function(err) {
      if (err) {
        console.error('Error inserting sample contact:', err);
      } else {
        insertedCount++;
        console.log(`✓ Imported: ${contact.unit_name}`);
        
        if (insertedCount === sampleContacts.length) {
          console.log(`✅ Successfully imported ${insertedCount} sample contacts`);
        }
      }
    });
  });
}

// API Routes

// Get all contacts
app.get('/api/contacts', (req, res) => {
  const { sortBy, filterBy, filterValue } = req.query;
  let query = 'SELECT * FROM housing_contacts';
  let params = [];

  if (filterBy && filterValue) {
    query += ` WHERE ${filterBy} LIKE ?`;
    params.push(`%${filterValue}%`);
  }

  if (sortBy) {
    query += ` ORDER BY ${sortBy}`;
  } else {
    query += ' ORDER BY date_entered DESC';
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single contact
app.get('/api/contacts/:id', (req, res) => {
  db.get('SELECT * FROM housing_contacts WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Create new contact
app.post('/api/contacts', (req, res) => {
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
  const values = fields.map(field => req.body[field] || null);
  
  const query = `INSERT INTO housing_contacts (${fields.join(', ')}) VALUES (${placeholders})`;
  
  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, ...req.body });
    }
  });
});

// Update contact
app.put('/api/contacts/:id', (req, res) => {
  const fields = Object.keys(req.body);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => req.body[field]);
  values.push(req.params.id);
  
  const query = `UPDATE housing_contacts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  
  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: req.params.id, ...req.body });
    }
  });
});

// Delete contact
app.delete('/api/contacts/:id', (req, res) => {
  db.run('DELETE FROM housing_contacts WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Contact deleted', id: req.params.id });
    }
  });
});

// Get dropdown options
app.get('/api/options', (req, res) => {
  console.log('API options endpoint called');
  const options = {
    cities: [
      'Bonita', 'Bonsall', 'Borrego Springs', 'Carlsbad', 'Chula Vista', 
      'Coronado', 'Del Mar', 'Descanso', 'El Cajon', 'Encinitas', 
      'Escondido', 'Fallbrook', 'Imperial Beach', 'Julian', 'La Jolla', 
      'La Mesa', 'Lakeside', 'Lemon Grove', 'National City', 'Oceanside', 
      'Pala', 'Pauma Valley', 'Poway', 'Ramona', 'Rancho Bernardo', 
      'Rancho Penasquitos', 'Rancho Santa Fe', 'San Diego', 'San Marcos', 
      'Santee', 'Solana Beach', 'Spring Valley', 'Valley Center', 
      'Vista', 'Other'
    ],
    utilities_included: ['Yes', 'No', 'Partial', 'Electric only', 'Water/Sewer only', 'Gas only', 'Other'],
    background_check: ['Yes', 'No', 'Case by Case', 'Conditional', 'Not specified'],
    accepts_programs: ['Yes', 'No', 'Some programs', 'Section 8', 'VASH', 'RRH only', 'Case by case', 'Not specified'],
    status: ['New lead', 'Contacted', 'Waiting for callback', 'Application submitted', 'Approved', 'Denied', 'Not available', 'Waitlisted', 'Follow up needed', 'No longer interested'],
    raise_rent_yearly: ['Yes', 'No', 'Market rate', 'Fixed increases', 'Unknown', 'Varies'],
    bedrooms: ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4+ bedrooms', '1-2 bedrooms', '2-3 bedrooms', '1-3 bedrooms', 'Studio-1 bedroom', 'Studio-2 bedrooms', 'Varies'],
    bathrooms: ['1', '1.5', '2', '2.5', '3', '3+', '1-2', '1.5-2.5', 'Varies']
  };
  console.log('Returning options:', Object.keys(options));
  res.json(options);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
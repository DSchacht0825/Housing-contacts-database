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
    }
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
  const options = {
    cities: ['Vista', 'San Marcos', 'Escondido', 'Carlsbad', 'Oceanside', 'San Diego', 'Fallbrook', 'La Mesa'],
    utilities_included: ['Yes', 'No', 'Partial'],
    background_check: ['Yes', 'No', 'Case by Case'],
    accepts_programs: ['Yes', 'No', 'Some'],
    status: ['Contacted', 'Waiting', 'Not Available', 'Approved', 'Denied', 'Follow Up'],
    raise_rent_yearly: ['Yes', 'No', 'Unknown'],
    bedrooms: ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '1-2 bedrooms', '2-3 bedrooms', '1-3 bedrooms', 'Varies'],
    bathrooms: ['1', '1.5', '2', '2.5', '3', '1-2', 'Varies']
  };
  res.json(options);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
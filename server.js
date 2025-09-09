const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
database.initDB().then(() => {
  console.log('Database initialized successfully');
}).catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

// Remove old database initialization code - now handled by database.js

// API Routes

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const { sortBy, filterBy, filterValue } = req.query;
    let sql = 'SELECT * FROM housing_contacts';
    let params = [];

    if (filterBy && filterValue) {
      if (database.isPostgres()) {
        sql += ` WHERE ${filterBy} ILIKE $1`;
        params.push(`%${filterValue}%`);
      } else {
        sql += ` WHERE ${filterBy} LIKE ?`;
        params.push(`%${filterValue}%`);
      }
    }

    if (sortBy) {
      sql += ` ORDER BY ${sortBy}`;
    } else {
      sql += ' ORDER BY date_entered DESC';
    }

    const contacts = await database.query(sql, params);
    res.json(contacts);
  } catch (err) {
    console.error('Error getting contacts:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single contact
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const paramSymbol = database.isPostgres() ? '$1' : '?';
    const sql = `SELECT * FROM housing_contacts WHERE id = ${paramSymbol}`;
    const contact = await database.get(sql, [req.params.id]);
    res.json(contact);
  } catch (err) {
    console.error('Error getting contact:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new contact
app.post('/api/contacts', async (req, res) => {
  console.log('POST /api/contacts - Request body:', req.body);
  try {
    const fields = [
      'date_entered', 'unit_name', 'count1', 'managed_by', 'address_office_hours',
      'count2', 'city', 'contact', 'phone_no', 'email', 'bedrooms', 'bathrooms',
      'rent', 'deposit', 'utilities_included', 'cost_if_not_included',
      'move_in_specials', 'availability_date', 'requirements', 'credit_score',
      'background_check', 'accepts_programs', 'pet_policy', 'rental_insurance',
      'application_fee', 'website_link', 'notes', 'follow_up', 'status',
      'raise_rent_yearly'
    ];
    
    const values = fields.map(field => req.body[field] || null);
    console.log('Prepared values for insert:', values);
    
    let query;
    if (database.isPostgres()) {
      const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
      query = `INSERT INTO housing_contacts (${fields.join(', ')}) VALUES (${placeholders}) RETURNING id`;
    } else {
      const placeholders = fields.map(() => '?').join(', ');
      query = `INSERT INTO housing_contacts (${fields.join(', ')}) VALUES (${placeholders})`;
    }
    
    console.log('Executing query:', query);
    const result = await database.query(query, values);
    console.log('Query result:', result);
    
    if (database.isPostgres()) {
      res.json({ id: result[0].id, ...req.body });
    } else {
      res.json({ id: result.lastID, ...req.body });
    }
  } catch (err) {
    console.error('Error creating contact - Full error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message, details: err.toString() });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const fields = Object.keys(req.body);
    const values = fields.map(field => req.body[field]);
    values.push(req.params.id);
    
    let query;
    if (database.isPostgres()) {
      const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
      query = `UPDATE housing_contacts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1}`;
    } else {
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      query = `UPDATE housing_contacts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    }
    
    await database.query(query, values);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const paramSymbol = database.isPostgres() ? '$1' : '?';
    const query = `DELETE FROM housing_contacts WHERE id = ${paramSymbol}`;
    await database.query(query, [req.params.id]);
    res.json({ message: 'Contact deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: err.message });
  }
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
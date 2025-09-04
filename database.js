const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');

let db;
let isPostgres = false;

// Initialize database connection
function initDB() {
  return new Promise((resolve, reject) => {
    // Use PostgreSQL on Railway, SQLite locally
    if (process.env.DATABASE_URL) {
      console.log('Using PostgreSQL database...');
      isPostgres = true;
      
      db = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      
      db.connect((err) => {
        if (err) {
          console.error('Error connecting to PostgreSQL:', err);
          reject(err);
        } else {
          console.log('Connected to PostgreSQL database');
          createTable().then(resolve).catch(reject);
        }
      });
    } else {
      console.log('Using SQLite database...');
      isPostgres = false;
      
      db = new sqlite3.Database('./housing_contacts.db', (err) => {
        if (err) {
          console.error('Error opening SQLite database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          createTable().then(resolve).catch(reject);
        }
      });
    }
  });
}

// Create table with appropriate SQL for each database
function createTable() {
  return new Promise((resolve, reject) => {
    const createTableSQL = isPostgres ? `
      CREATE TABLE IF NOT EXISTS housing_contacts (
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    ` : `
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
    `;

    if (isPostgres) {
      db.query(createTableSQL, (err) => {
        if (err) {
          console.error('Error creating PostgreSQL table:', err);
          reject(err);
        } else {
          console.log('Housing contacts table ready (PostgreSQL)');
          resolve();
        }
      });
    } else {
      db.run(createTableSQL, (err) => {
        if (err) {
          console.error('Error creating SQLite table:', err);
          reject(err);
        } else {
          console.log('Housing contacts table ready (SQLite)');
          resolve();
        }
      });
    }
  });
}

// Generic query function that works with both databases
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      db.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    } else {
      if (sql.includes('INSERT') || sql.includes('UPDATE') || sql.includes('DELETE')) {
        db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        });
      } else {
        db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    }
  });
}

// Get single row
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      db.query(sql + ' LIMIT 1', params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows[0] || null);
        }
      });
    } else {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    }
  });
}

module.exports = {
  initDB,
  query,
  get,
  isPostgres: () => isPostgres
};
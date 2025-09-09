# Housing Contacts Management System

A web-based database application to manage housing contacts, replacing Excel spreadsheets with a structured database that allows for easy data entry, filtering, and sorting.

## Features

- **Easy Data Entry**: User-friendly form with dropdown menus for consistent data entry
- **Database Storage**: SQLite database for reliable data storage and querying
- **Data Filtering**: Filter contacts by city, status, bedrooms, managed by, etc.
- **Sorting**: Sort data by date, unit name, city, rent, availability date
- **Edit/Delete**: Update or remove existing contacts
- **Data Import**: Import existing Excel data into the database
- **Responsive Design**: Works on desktop and mobile devices

## Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd /Users/danielschacht/housing-contacts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Import sample data (optional):
   ```bash
   npm run import
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and go to:
   ```
   http://localhost:3005
   ```

## Usage

### Adding New Contacts

1. Click on "Add/Edit Contact" tab
2. Fill out the form with housing contact information
3. Use dropdown menus for standardized entries (City, Status, etc.)
4. Click "Save Contact" to add to database

### Viewing & Managing Contacts

1. Click on "View Contacts" tab
2. Use filters to find specific contacts
3. Sort by any column using the sort dropdown
4. Click "Edit" to modify a contact
5. Click "Delete" to remove a contact (with confirmation)

### Database Fields

The database includes all fields from your Excel spreadsheet:

- **Basic Info**: Date Entered, Unit Name, Managed By, Address, City
- **Contact Details**: Contact Person, Phone, Email
- **Property Info**: Bedrooms, Bathrooms, Rent, Deposit
- **Policies**: Utilities, Pet Policy, Credit Score Requirements
- **Status Tracking**: Status, Follow Up, Notes
- **Links**: Website/Link for property information

## API Endpoints

The application provides REST API endpoints:

- `GET /api/contacts` - Get all contacts with optional filtering/sorting
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update existing contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/options` - Get dropdown options

## Data Migration

To import your existing Excel data:

1. Save your Excel file as CSV format
2. Modify the `import-data.js` file to match your CSV structure
3. Run `npm run import` to populate the database

## Benefits Over Excel

- **Structured Data**: Consistent field formats and validation
- **Easy Filtering**: Find contacts by any criteria quickly
- **No File Corruption**: Database is more reliable than Excel files
- **Multi-user Access**: Multiple people can access simultaneously
- **Data Integrity**: Prevents accidental data loss or corruption
- **Better Searching**: Find contacts by partial matches in any field
- **Standardized Entries**: Dropdown menus ensure consistent data entry

## Files Structure

```
housing-contacts/
├── server.js              # Backend API server
├── import-data.js         # Data import script
├── package.json           # Project dependencies
├── housing_contacts.db    # SQLite database file
├── public/
│   ├── index.html         # Main application interface
│   ├── styles.css         # Application styling
│   └── script.js          # Frontend JavaScript
└── README.md              # This file
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Styling**: Responsive CSS Grid/Flexbox

## Future Enhancements

- Export data to Excel/CSV
- Advanced reporting and analytics
- User authentication
- Bulk data import from CSV
- Email integration
- Calendar integration for follow-ups
- Photo attachments for properties# Deployment trigger Mon Sep  8 19:47:18 PDT 2025

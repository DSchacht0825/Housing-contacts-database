// API base URL - works for both local and Railway deployment
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3005/api' : '/api';

// Load dropdown options when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDropdownOptions();
    loadContacts();
    setTodayDate();
});

// Set today's date as default
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date_entered').value = today;
}

// Load dropdown options from API
async function loadDropdownOptions() {
    try {
        const response = await fetch(`${API_URL}/options`);
        const options = await response.json();
        
        // Populate dropdowns
        populateSelect('city', options.cities);
        populateSelect('utilities_included', options.utilities_included);
        populateSelect('background_check', options.background_check);
        populateSelect('accepts_programs', options.accepts_programs);
        populateSelect('status', options.status);
        populateSelect('raise_rent_yearly', options.raise_rent_yearly);
        populateSelect('bedrooms', options.bedrooms);
        populateSelect('bathrooms', options.bathrooms);
    } catch (error) {
        console.error('Error loading options:', error);
    }
}

// Populate a select element with options
function populateSelect(elementId, options) {
    const select = document.getElementById(elementId);
    if (!select) return;
    
    // Keep the first option (placeholder)
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    // Add new options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

// Show/hide tabs
function showTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to selected tab and button
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load contacts if switching to list tab
    if (tabName === 'list') {
        loadContacts();
    }
}

// Handle form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        data[key] = value || null;
    }
    
    // Add hidden ID if editing
    const contactId = document.getElementById('contact-id').value;
    
    try {
        let response;
        if (contactId) {
            // Update existing contact
            response = await fetch(`${API_URL}/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            // Create new contact
            response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            alert('Contact saved successfully!');
            clearForm();
            loadContacts();
        } else {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            alert(`Error saving contact: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Network/Client error:', error);
        alert(`Error saving contact: ${error.message}`);
    }
});

// Clear form
function clearForm() {
    document.getElementById('contact-form').reset();
    document.getElementById('contact-id').value = '';
    setTodayDate();
}

// Load contacts into table
async function loadContacts(filterBy = '', filterValue = '', sortBy = '') {
    try {
        let url = `${API_URL}/contacts`;
        const params = new URLSearchParams();
        
        if (filterBy && filterValue) {
            params.append('filterBy', filterBy);
            params.append('filterValue', filterValue);
        }
        
        if (sortBy) {
            params.append('sortBy', sortBy);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        const contacts = await response.json();
        
        const tbody = document.getElementById('contacts-tbody');
        tbody.innerHTML = '';
        
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(contact.date_entered)}</td>
                <td>${contact.unit_name || ''}</td>
                <td>${contact.city || ''}</td>
                <td>${contact.contact || ''}</td>
                <td>${contact.phone_no || ''}</td>
                <td>${contact.bedrooms || ''}</td>
                <td>${contact.rent || ''}</td>
                <td>${contact.status || ''}</td>
                <td class="action-buttons">
                    <button onclick="editContact(${contact.id})" class="btn btn-primary btn-small">Edit</button>
                    <button onclick="deleteContact(${contact.id})" class="btn btn-danger btn-small">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

// Edit contact
async function editContact(id) {
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`);
        const contact = await response.json();
        
        // Switch to form tab
        document.getElementById('form-tab').classList.add('active');
        document.getElementById('list-tab').classList.remove('active');
        document.querySelectorAll('.tab-button')[0].classList.add('active');
        document.querySelectorAll('.tab-button')[1].classList.remove('active');
        
        // Fill form with contact data
        Object.keys(contact).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'date_entered' || key === 'availability_date') {
                    // Format date for date input
                    if (contact[key]) {
                        element.value = contact[key].split('T')[0];
                    }
                } else {
                    element.value = contact[key] || '';
                }
            }
        });
        
        // Set the contact ID
        document.getElementById('contact-id').value = id;
    } catch (error) {
        console.error('Error loading contact:', error);
    }
}

// Delete contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Contact deleted successfully!');
            loadContacts();
        } else {
            alert('Error deleting contact');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting contact');
    }
}

// Apply filter
function applyFilter() {
    const filterField = document.getElementById('filter-field').value;
    const filterValue = document.getElementById('filter-value').value;
    const sortField = document.getElementById('sort-field').value;
    
    loadContacts(filterField, filterValue, sortField);
}

// Clear filter
function clearFilter() {
    document.getElementById('filter-field').value = '';
    document.getElementById('filter-value').value = '';
    document.getElementById('sort-field').value = '';
    loadContacts();
}

// Sort table
function sortTable() {
    const sortField = document.getElementById('sort-field').value;
    const filterField = document.getElementById('filter-field').value;
    const filterValue = document.getElementById('filter-value').value;
    
    loadContacts(filterField, filterValue, sortField);
}

// Import sample data
async function importSampleData() {
    const sampleData = [
        {
            date_entered: '2025-08-04',
            unit_name: 'Santa Fe Senior Village',
            managed_by: 'National CORE',
            address_office_hours: '414 N. Santa Fe Avenue',
            city: 'Vista',
            notes: 'Santa Fe Senior Village is a vibrant supportive housing community in downtown Vista, California for seniors who are unhoused or at-risk of becoming unhoused. Waitlist Opens Aug. 29th @7:30 am 62 years + fully furnished.',
            website_link: 'https://www.nationalcore.org/santa-fe-senior-village'
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
            notes: '8/5 spoke with manager and is open with partnering with San Diego Rescue Mission.'
        },
        {
            date_entered: '2025-08-05',
            unit_name: 'Sunset Springs Aparments',
            managed_by: 'Golden City Management',
            address_office_hours: '320 Pomelo',
            city: 'Vista',
            contact: 'Jose Solis',
            phone_no: '760-945-3500',
            email: 'jose@goldencitiesmanagement.com',
            bedrooms: '1-2 bedrooms',
            notes: '8/5 spoke with manager Jose and is firm on have a credit score of 600.',
            credit_score: '600'
        }
    ];
    
    const statusDiv = document.getElementById('import-status');
    statusDiv.className = '';
    statusDiv.textContent = 'Importing data...';
    statusDiv.style.display = 'block';
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const data of sampleData) {
        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                successCount++;
            } else {
                errorCount++;
            }
        } catch (error) {
            errorCount++;
        }
    }
    
    if (errorCount === 0) {
        statusDiv.className = 'success';
        statusDiv.textContent = `Successfully imported ${successCount} contacts!`;
    } else {
        statusDiv.className = 'error';
        statusDiv.textContent = `Imported ${successCount} contacts with ${errorCount} errors.`;
    }
    
    loadContacts();
}
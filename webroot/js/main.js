import { doLogin, doLogout } from './auth.js';
window.doLogin = doLogin;
window.doLogout = doLogout;

import { readCookie } from './cookies.js';
import { urlBase, extension, userId, firstName, lastName, setUserData } from './config.js';
import { showToast } from './toast.js';

// Import contacts logic
import {
  TEST_MODE,
  addContact,
  searchContacts,
  showEditContact,
  cancelEdit,
  updateContact,
  deleteContact
} from './contact.js';

// Expose contacts functions for inline HTML handlers
window.addContact = addContact;
window.searchContacts = searchContacts;
window.showEditContact = showEditContact;
window.cancelEdit = cancelEdit;
window.updateContact = updateContact;
window.deleteContact = deleteContact;

function showRegister() {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("registerDiv").style.display = "block";
}
function showLogin() {
  document.getElementById("registerDiv").style.display = "none";
  document.getElementById("loginDiv").style.display = "block";
}
window.showRegister = showRegister;
window.showLogin = showLogin;

document.addEventListener("DOMContentLoaded", function () {
  // Contacts page initialization
  if (document.getElementById("contactsList")) {
    readCookie();
    searchContacts();
  }

  // Attach live search handlers
  const searchInput = document.getElementById('searchText');
  if (searchInput) searchInput.addEventListener('input', searchContacts);
  const searchButton = document.getElementById('searchButton');
  if (searchButton) searchButton.addEventListener('click', searchContacts);

  // Validation clearing for all relevant fields, now including address fields
  const fields = [
    'contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone', 'contactAddress',
    'editFirstName', 'editLastName', 'editEmail', 'editPhone', 'editAddress'
  ];
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
        this.style.boxShadow = '';
        const errorDiv = this.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
      });
    }
  });
});
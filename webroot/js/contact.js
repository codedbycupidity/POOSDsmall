// contact.js

import { readCookie } from './cookies.js';
import { urlBase, extension, userId } from './config.js';
import { showToast } from './toast.js';

// Export TEST_MODE so main.js can toggle it if needed
export const TEST_MODE = false; // Set to false for production
let lastContactCount = 6;

// ======== CONTACTS CORE ========

// --- Add Contact ---
export function addContact() {
  const firstName = document.getElementById("contactFirstName").value.trim();
  const lastName = document.getElementById("contactLastName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phoneNumber = document.getElementById("contactPhone").value.trim();
  const address = document.getElementById("contactAddress").value.trim();

  clearValidationErrors();

  let isValid = true;

  // Validate First Name
  if (!firstName) {
    showFieldError("contactFirstName", "First name is required");
    isValid = false;
  } else if (firstName.length < 2) {
    showFieldError("contactFirstName", "First name must be at least 2 characters");
    isValid = false;
  } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
    showFieldError("contactFirstName", "First name contains invalid characters");
    isValid = false;
  }

  // Validate Last Name
  if (!lastName) {
    showFieldError("contactLastName", "Last name is required");
    isValid = false;
  } else if (lastName.length < 2) {
    showFieldError("contactLastName", "Last name must be at least 2 characters");
    isValid = false;
  } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
    showFieldError("contactLastName", "Last name contains invalid characters");
    isValid = false;
  }

  // Validate Email
  if (!email) {
    showFieldError("contactEmail", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError("contactEmail", "Please enter a valid email address");
    isValid = false;
  }

  // Validate Phone Number
  if (!phoneNumber) {
    showFieldError("contactPhone", "Phone number is required");
    isValid = false;
  } else if (!isValidPhoneNumber(phoneNumber)) {
    showFieldError("contactPhone", "Please enter a valid phone number");
    isValid = false;
  }

  // Address is optional, but you can add validation if you want

  if (!isValid) {
    showToast("Error: Please fix the highlighted fields");
    return;
  }

  const tmp = { firstName, lastName, email, phoneNumber, address, userID: userId };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/addContact.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const jsonResponse = JSON.parse(xhr.responseText);

      if (jsonResponse.error && jsonResponse.error !== "") {
        showToast("Error: " + jsonResponse.error);
        return;
      }

      showToast(`Added: ${firstName} ${lastName}`);
      clearAddContactForm();
      searchContacts();
    }
  };

  xhr.send(jsonPayload);
}

// --- Search Contacts ---
export function searchContacts() {
  const searchInputElement = document.getElementById("searchText");
  if (!searchInputElement) return;

  const searchInput = searchInputElement.value.trim();
  if (searchInput.length < 2 && searchInput.length > 0) {
    document.getElementById("searchResult").textContent = "Search term must be at least 2 characters.";
    return;
  }

  document.getElementById("searchResult").textContent = "";

  const estimatedRows = searchInput ? Math.min(lastContactCount, 8) : lastContactCount;
  if (typeof showSkeleton === 'function') showSkeleton(estimatedRows);

  if (TEST_MODE) {
    setTimeout(() => handleTestModeSearch(searchInput), 1000);
    return;
  }

  const payload = JSON.stringify({ search: searchInput, userID: userId });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/searchContacts.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;
    if (typeof hideSkeleton === 'function') hideSkeleton();

    let response;
    try { response = JSON.parse(xhr.responseText); }
    catch { document.getElementById("searchResult").textContent = "Invalid JSON from server."; return; }

    if (response.error) {
      document.getElementById("searchResult").textContent = response.error;
      return;
    }

    populateContactsTable(response.results, searchInput);
  };

  xhr.send(payload);
}

// --- Edit Contact Modal/Inline ---
export function showEditContact(id, firstName, lastName, email, phone, address = "") {
  document.getElementById("editContactID").value = id;
  document.getElementById("editFirstName").value = firstName;
  document.getElementById("editLastName").value = lastName;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editAddress").value = address || "";

  document.getElementById("editContactDiv").style.display = "block";
  document.getElementById("editContactDiv").scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function cancelEdit() {
  document.getElementById("editContactDiv").style.display = "none";
  document.getElementById("editContactResult").innerHTML = "";
  document.getElementById("editContactForm").reset();
}

// --- Update Contact ---
export function updateContact() {
  const contactId = parseInt(document.getElementById("editContactID").value);
  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName = document.getElementById("editLastName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const address = document.getElementById("editAddress").value.trim();

  if (!firstName || !lastName || !email || !phone) {
    document.getElementById("editContactResult").innerHTML = "Please fill in all fields.";
    return;
  }

  const tmp = { ID: contactId, firstName, lastName, email, phoneNumber: phone, address, userID: userId };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/updateContact.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      if (!res.success) {
        document.getElementById("editContactResult").innerHTML = res.error;
        return;
      }

      document.getElementById("editContactResult").innerHTML = "Contact has been updated.";
      showToast(`Updated: ${firstName} ${lastName}`);
      setTimeout(() => { cancelEdit(); searchContacts(); }, 1500);
    }
  };

  xhr.send(jsonPayload);
}

// --- Delete Contact ---
export function deleteContact(id) {
  const row = event.target.closest('tr');
  const firstName = row.cells[1].textContent;
  const lastName = row.cells[2].textContent;

  if (!confirm(`Are you sure you want to delete ${firstName} ${lastName}?`)) return;

  const tmp = { ID: id, userID: userId };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/deleteContact.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      showToast(`Deleted: ${firstName} ${lastName}`);
      searchContacts();
    }
  };

  xhr.send(jsonPayload);
}

// ======== UTILITIES ========

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.style.borderColor = "#ff4444";
    field.style.boxShadow = "0 0 5px rgba(255, 68, 68, 0.3)";
    let errorDiv = field.parentNode.querySelector('.field-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.style.color = '#ff4444';
      errorDiv.style.fontSize = '0.8rem';
      errorDiv.style.marginTop = '0.25rem';
      field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }
}

function clearValidationErrors() {
  const fields = ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone', 'contactAddress'];
  fields.concat(['editFirstName', 'editLastName', 'editEmail', 'editPhone', 'editAddress']).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.borderColor = '';
      field.style.boxShadow = '';
      const errorDiv = field.parentNode.querySelector('.field-error');
      if (errorDiv) errorDiv.remove();
    }
  });
}

function clearAddContactForm() {
  document.getElementById("contactFirstName").value = "";
  document.getElementById("contactLastName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
  document.getElementById("contactAddress").value = "";
  clearValidationErrors();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 15) return false;
  const phoneRegex = /^[\+]?[1-9]?[\-\.\s\(\)]?([0-9][\-\.\s\(\)]?){9,14}$/;
  return phoneRegex.test(phone);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ======== CONTACTS TABLE POPULATION ========

function populateContactsTable(contacts, searchInput = "") {
  const listContainer = document.getElementById("contactsList");
  listContainer.innerHTML = "";
  lastContactCount = Math.max(contacts.length, 3);

  if (searchInput) {
    document.getElementById("searchResult").textContent =
      `Found ${contacts.length} contact${contacts.length !== 1 ? 's' : ''} matching "${searchInput}"`;
  } else {
    document.getElementById("searchResult").textContent =
      `Showing ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`;
  }

  if (contacts.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 2rem; color: var(--baseColor); font-style: italic;">
        ${searchInput ? `No contacts found matching "${searchInput}"` : 'No contacts found. Add your first contact!'}
      </td>
    `;
    listContainer.appendChild(emptyRow);
    return;
  }

  contacts.forEach(contact => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(contact.firstName)}</td>
      <td>${escapeHtml(contact.lastName)}</td>
      <td>${escapeHtml(contact.email)}</td>
      <td>${escapeHtml(contact.phoneNumber)}</td>
      <td>${escapeHtml(contact.address || "")}</td>
      <td>
        <div class="dropdown">
          <button class="dropbtn">Actions ▼</button>
          <div class="dropdown-content">
            <a href="#" onclick="showEditContact(${contact.ID}, '${escapeHtml(contact.firstName)}', '${escapeHtml(contact.lastName)}', '${escapeHtml(contact.email)}', '${escapeHtml(contact.phoneNumber)}', '${escapeHtml(contact.address || "")}'); return false;">Edit</a>
            <a href="#" onclick="deleteContact(${contact.ID}); return false;">Delete</a>
          </div>
        </div>
      </td>
    `;
    listContainer.appendChild(row);
  });
}

// ======== TEST MODE ========

function handleTestModeSearch(searchInput) {
  if (typeof hideSkeleton === 'function') hideSkeleton();

  const mockContacts = [
    { ID: 1, firstName: "John", lastName: "Smith", email: "john.smith@email.com", phoneNumber: "(555) 123-4567", address: "123 Main St" },
    { ID: 2, firstName: "Jane", lastName: "Doe", email: "jane.doe@email.com", phoneNumber: "(555) 987-6543", address: "456 Oak Ave" },
    { ID: 3, firstName: "Michael", lastName: "Johnson", email: "m.johnson@email.com", phoneNumber: "(555) 456-7890", address: "" },
    { ID: 4, firstName: "Sarah", lastName: "Williams", email: "sarah.w@email.com", phoneNumber: "(555) 321-0987", address: "789 Pine Dr" },
    { ID: 5, firstName: "David", lastName: "Brown", email: "david.brown@email.com", phoneNumber: "(555) 654-3210", address: "" },
    { ID: 6, firstName: "Emily", lastName: "Davis", email: "emily.davis@email.com", phoneNumber: "(555) 789-0123", address: "222 Maple Ct" }
  ];

  let filteredContacts = mockContacts;
  if (searchInput) {
    filteredContacts = mockContacts.filter(contact =>
      contact.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      contact.phoneNumber.includes(searchInput) ||
      (contact.address && contact.address.toLowerCase().includes(searchInput.toLowerCase()))
    );
  }

  populateContactsTable(filteredContacts, searchInput);
}

// ======== DOM EVENT HOOKS ========

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("contactsList")) {
    readCookie();
    searchContacts();
  }

  const searchInput = document.getElementById('searchText');
  if (searchInput) searchInput.addEventListener('input', () => searchContacts());
  const searchButton = document.getElementById('searchButton');
  if (searchButton) searchButton.addEventListener('click', () => searchContacts());

  // Add input clear listeners to all fields
  const fields = ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone', 'contactAddress',
                  'editFirstName', 'editLastName', 'editEmail', 'editPhone', 'editAddress'];
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

  // Window export for inline HTML
  window.searchContacts = searchContacts;
  window.addContact = addContact;
  window.updateContact = updateContact;
  window.cancelEdit = cancelEdit;
  window.showEditContact = showEditContact;
  window.deleteContact = deleteContact;

  // Dropdown menu handling
  document.addEventListener("click", function (e) {
    if (e.target.matches(".dropbtn")) {
      const btn = e.target;
      const dropdown = btn.closest(".dropdown");
      const menu = dropdown.querySelector(".dropdown-content");
      if (dropdown.classList.contains("active")) {
        menu.style.display = "none";
        dropdown.classList.remove("active");
        return;
      }
      document.querySelectorAll(".dropdown").forEach(dd => {
        const ddMenu = dd.querySelector(".dropdown-content");
        if (ddMenu) ddMenu.style.display = "none";
        dd.classList.remove("active");
      });
      const rect = btn.getBoundingClientRect();
      menu.style.position = "fixed";
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom + 5}px`;
      menu.style.display = "block";
      dropdown.classList.add("active");
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    document.querySelectorAll(".dropdown.active").forEach(dropdown => {
      const menu = dropdown.querySelector(".dropdown-content");
      if (menu) menu.style.display = "none";
      dropdown.classList.remove("active");
    });
  });

  document.querySelectorAll('.dropdown-content').forEach(menu => {
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        this.style.display = 'none';
        this.closest('.dropdown').classList.remove('active');
      }
    });
  });
});

// contactTemplate.js
// HTML templates for contact-related components

export const ContactTemplate = {
    // Contact details table rows template
    details: (contact) => `
    <tr>
      <td><strong>First Name:</strong></td>
      <td>${escapeHtml(contact.firstName)}</td>
    </tr>
    <tr>
      <td><strong>Last Name:</strong></td>
      <td>${escapeHtml(contact.lastName)}</td>
    </tr>
    <tr>
      <td><strong>Email:</strong></td>
      <td><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></td>
    </tr>
    <tr>
      <td><strong>Phone:</strong></td>
      <td><a href="tel:${escapeHtml(contact.phoneNumber)}">${escapeHtml(contact.phoneNumber)}</a></td>
    </tr>
    <tr>
      <td colspan="2" style="padding-top: 20px; text-align: center;">
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
          <button onclick="showEditContact(${contact.ID}, '${escapeHtml(contact.firstName)}', '${escapeHtml(contact.lastName)}', '${escapeHtml(contact.email)}', '${escapeHtml(contact.phoneNumber)}'); return false;">
            Edit Contact
          </button>
          <button onclick="deleteContact(${contact.ID}); return false;" 
                  style="background-color: rgba(220, 53, 70, 0.65);">
            Delete Contact
          </button>
        </div>
      </td>
    </tr>
  `,

    // No contact selected message template
    noContactSelected: () => `
    <div class="no-contact-selected">
      <p>Select a contact to view details</p>
    </div>
  `,

    // Contact list item template (if needed)
    contactListItem: (contact, isSelected = false) => `
    <div class="contact-item ${isSelected ? 'selected' : ''}" 
         onclick="selectContact(${contact.ID})">
      <div class="contact-name">
        ${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}
      </div>
      <div class="contact-email">
        ${escapeHtml(contact.email)}
      </div>
    </div>
  `,

    // Edit contact form template (if you want to move that too)
    editContactForm: (contact = {}) => `
    <div class="overlay" id="editOverlay">
      <div id="editContactDiv">
        <h2 class="add-contact-heading">${contact.ID ? 'Edit Contact' : 'Add New Contact'}</h2>
        <div id="editContactResult" class="result-message"></div>
        
        <form id="editContactForm">
          <div class="form-group">
            <label for="editFirstName">First Name:</label>
            <input type="text" id="editFirstName" value="${escapeHtml(contact.firstName || '')}" required>
          </div>
          
          <div class="form-group">
            <label for="editLastName">Last Name:</label>
            <input type="text" id="editLastName" value="${escapeHtml(contact.lastName || '')}" required>
          </div>
          
          <div class="form-group">
            <label for="editEmail">Email:</label>
            <input type="email" id="editEmail" value="${escapeHtml(contact.email || '')}" required>
          </div>
          
          <div class="form-group">
            <label for="editPhoneNumber">Phone:</label>
            <input type="tel" id="editPhoneNumber" value="${escapeHtml(contact.phoneNumber || '')}" required>
          </div>
          
          <button type="button" id="${contact.ID ? 'updateContactButton' : 'addContactButton'}" 
                  onclick="${contact.ID ? `updateContact(${contact.ID})` : 'addContact()'}">
            ${contact.ID ? 'Update Contact' : 'Add Contact'}
          </button>
          
          <button type="button" id="cancelEditButton" onclick="closeEditContact()">
            Cancel
          </button>
        </form>
      </div>
    </div>
  `
};

// Helper function to safely escape HTML (include this in the same file or import it)
// Only include this if escapeHtml isn't already defined elsewhere
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
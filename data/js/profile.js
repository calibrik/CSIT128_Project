// DOM elements
const profileInfo = document.querySelector('.profile-info');
const accountSettings = document.querySelector('.account-settings');
const editButton = document.querySelector('.edit-button');
const saveButton = document.querySelector('.save-button');
const cancelButton = document.querySelector('.cancel-button');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const locationInput = document.querySelector('#location');

// Toggle between profile info and account settings
function toggleProfileEdit() {
  profileInfo.classList.toggle('hide');
  accountSettings.classList.toggle('hide');
}

// Save changes and update profile info
function saveChanges(event) {
  event.preventDefault();
  const name = nameInput.value;
  const email = emailInput.value;
  const location = locationInput.value;

  // Update profile info with new values
  document.querySelector('.profile-info p:nth-child(1)').textContent = `Name: ${name}`;
  document.querySelector('.profile-info p:nth-child(2)').textContent = `Email: ${email}`;
  document.querySelector('.profile-info p:nth-child(3)').textContent = `Location: ${location}`;

  toggleProfileEdit();
}

// Cancel editing and revert to profile info
function cancelEdit() {
  toggleProfileEdit();
}

// Event listeners
editButton.addEventListener('click', toggleProfileEdit);
saveButton.addEventListener('click', saveChanges);
cancelButton.addEventListener('click', cancelEdit);

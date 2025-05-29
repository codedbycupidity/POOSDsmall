// config.js

export let userId = 0;
export let firstName = "";
export let lastName = "";

export function setUserData(id, first, last) {
  userId = id;
  firstName = first;
  lastName = last;
}

// Also export urlBase and extension:
export const urlBase = '/LAMPAPI';
export const extension = 'php';

// js/cookies.js

import { userId, firstName, lastName } from './config.js';
import { setUserData } from './config.js';




export function saveCookie() {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60000);
  const expires = "expires=" + date.toUTCString();

  document.cookie = `firstName=${encodeURIComponent(firstName)};${expires};path=/`;
  document.cookie = `lastName=${encodeURIComponent(lastName)};${expires};path=/`;
  document.cookie = `userId=${userId};${expires};path=/`;
}
// Restore user info from cookie and update state
export function readCookie() {
  let id = -1;
  let first = "";
  let last = "";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("firstName=")) first = decodeURIComponent(cookie.substring("firstName=".length));
    else if (cookie.startsWith("lastName=")) last = decodeURIComponent(cookie.substring("lastName=".length));
    else if (cookie.startsWith("userId=")) id = parseInt(cookie.substring("userId=".length), 10);
  }

  setUserData(id, first, last);

  if (id < 1) {
    window.location.href = "index.html";
    return;
  }

  if (document.getElementById("userName")) {
    document.getElementById("userName").innerHTML = `${firstName} ${lastName}`;
  }
}
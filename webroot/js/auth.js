import { urlBase, extension, setUserData } from './config.js';
import { saveCookie } from './cookies.js';


export function doLogin() {
  setUserData(0, "", "");
  const login = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;
  document.getElementById("loginResult").innerHTML = "";
  const tmp = { login, password };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/login.${extension}`;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      if (res.id < 1) {
        document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
        return;
      }
      setUserData(res.id, res.firstName, res.lastName);
      saveCookie();
      window.location.href = "contacts.html";
    }
  };
  xhr.send(jsonPayload);
}

export function doLogout() {
  // Clear cookies
  document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // Redirect to login page
  window.location.href = "index.html";
}
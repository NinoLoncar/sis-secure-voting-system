var txtUsername = document.getElementById("txtUsername");
var txtPassword = document.getElementById("txtPassword");
var lblError = document.getElementById("lblError");

window.addEventListener("DOMContentLoaded", () => {
  setLoginButton();
});

function setLoginButton() {
  btnLogin.addEventListener("click", handleLoginButtonClick);
}

function handleLoginButtonClick(event) {
  event.preventDefault();
  isFormValid() ? login() : loginForm.reportValidity();
}

function isFormValid() {
  return loginForm.checkValidity();
}

async function login() {
  let options = setOptions();
  let response = await fetch("/login", options);
  response.ok ? handleLoginSuccess(response) : handleLoginFailure();
}

function setOptions() {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(setBody()),
  };
}

function setBody() {
  let body = {
    username: txtUsername.value,
    password: txtPassword.value,
  };
  return body;
}

function handleLoginSuccess(response) {
  lblError.style.visibility = "hidden";
  resetInput();
  window.location.href = "two-factor-auth";
}

function handleLoginFailure() {
  lblError.style.visibility = "visible";
  resetInput();
}

function resetInput() {
  txtUsername.value = "";
  txtPassword.value = "";
}

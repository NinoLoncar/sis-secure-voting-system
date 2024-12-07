let isAuthFailureMessageDisplayed;
window.addEventListener("DOMContentLoaded", async () => {
  isAuthFailureMessageDisplayed = false;
  await getTwoFactorAuthCode();
  setSendCodeButton();
});

async function getTwoFactorAuthCode() {
  await fetch("/send-two-factor-auth-code");
}

function setSendCodeButton() {
  let btnSendCode = document.getElementById("btnSendCode");
  btnSendCode.addEventListener("click", handleSendCodeButtonClick);
}

async function handleSendCodeButtonClick() {
  let options = setOptions();
  let response = await fetch("/check-two-factor-auth-code", options);
  response.ok
    ? handleTwoFactorAuthSuccess(response)
    : handleTwoFactorAuthFailure();
}

async function handleTwoFactorAuthSuccess(response) {
  const authorization = response.headers.get("Authorization");
  if (authorization) {
    const token = authorization.split(" ")[1];
    sessionStorage.setItem("token", token);
  }

  window.location.href = "/";
}

function handleTwoFactorAuthFailure() {
  document.getElementById("btnSendCode").style.display = "none";

  if (isAuthFailureMessageDisplayed) return;
  isAuthFailureMessageDisplayed = true;

  const authFailureDiv = createAuthFailureDiv();
  let countdown = 4;
  setInterval(() => {
    countdown--;
    authFailureDiv.innerHTML = `Two-factor authentication failed! Redirecting you to login in ${countdown} seconds...`;

    if (countdown === 0) {
      window.location.href = "logout";
      window.location.href = "login";
    }
  }, 1000);
}

function createAuthFailureDiv() {
  let authFailureDiv = document.createElement("div");
  authFailureDiv.className = "auth-failure-div";
  authFailureDiv.innerText = "Two-factor authentication failed!";
  const container = document.getElementById("authFailureContainer");
  container.appendChild(authFailureDiv);
  return authFailureDiv;
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
    code: getCode(),
  };
  return body;
}

function getCode() {
  let input = document.getElementById("txtCode");
  return input.value;
}

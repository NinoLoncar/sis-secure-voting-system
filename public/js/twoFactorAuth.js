window.addEventListener("DOMContentLoaded", async () => {
  getTwoFactorAuthCode();
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
  alert("Two factor authentication failed!");
  window.location.href = "login";
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

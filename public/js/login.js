var txtUsername = document.getElementById('txtUsername');
var txtPassword = document.getElementById('txtPassword');
var lblError = document.getElementById('lblError');

window.addEventListener('DOMContentLoaded', ()=>{
    setLoginButton();
})

function setLoginButton() {
    btnLogin.addEventListener('click', handleLoginClick);
}

function handleLoginClick(event) {
    event.preventDefault();
    isFormValid() ? login() : loginForm.reportValidity();
}

function isFormValid() {
    return loginForm.checkValidity();
}

async function login() {
    const options = setOptions();
    var response = await fetch('http://localhost:12000/login', options);
    console.log(response)
    response.ok ? handleLoginSuccess() : handleLoginFailure();
}

function setOptions() {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setBody())
    }
}

function setBody() {
    var body = {
        username: txtUsername.value,
        password: txtPassword.value,
    }
    return body;
}

function handleLoginSuccess() {
    lblError.style.visibility = 'hidden';
    txtUsername.value = '';
    txtPassword.value = '';
    window.location.href = '/'
}

function handleLoginFailure() {
    lblError.style.visibility = 'visible';
    txtUsername.value = '';
    txtPassword.value = '';
}
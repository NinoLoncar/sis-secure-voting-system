window.addEventListener('DOMContentLoaded', async ()=>{
    getTwoFactorAuthCode();
    setSendCodeButton();
    setUpAutoFill();
})

async function getTwoFactorAuthCode() {
    await fetch('http://localhost:12000/send-two-factor-auth-code');
}

function setSendCodeButton() {
    let btnSendCode = document.getElementById('btnSendCode');
    btnSendCode.addEventListener('click', handleSendCodeButtonClick);
}

async function handleSendCodeButtonClick() {
    let options = setOptions();
    let response = await fetch('http://localhost:12000/check-two-factor-auth-code', options);
    response.ok ? handleTwoFactorAuthSuccess() : handleTwoFactorAuthFailure();
}

async function handleTwoFactorAuthSuccess() {
    window.location.href = '/'
}

function handleTwoFactorAuthFailure() {
    alert("Two factor authentication failed!")
    window.location.href = 'login';
}

function setOptions() {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setBody())
    }
}

function setBody() {
    let body = {
        code: getCode()
    }
    return body;
}

function getCode() {
    let input = document.getElementById('txtCode');
    return input.value;
}
/* -----------------

Team Name : Hackathon Heroes

	 Members Name : Mohammad Adnaan Zakee 
		            Hamza Ayaz Khan
					Ghazali Hussain
					Mohammad Faizullah


	 Project Name : Image-Based Password Authentication 

	 Technologies Used : HTML5, CSS3, JAVASCRIPT 

	 ======== All Rights Reserved =========

------------------ */

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
let authentication_img_pass = [];
let authentication_img_log_pass = [];
const tokenKey = 'authentication_token';
let timer;

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

function authentication_img(element) {
    var Image = element.querySelector('img');
    if (Image) {
        if (Image.classList.contains('clicked')) {
            Image.classList.remove('clicked');
            authentication_img_pass.splice(authentication_img_pass.indexOf(element.id), 1);
        } else {
            Image.classList.add('clicked');
            authentication_img_pass.push(element.id);
        }
    }
}

function authentication_login_img(element) {
    var Image = element.querySelector('img');
    if (Image) {
        if (Image.classList.contains('clicked')) {
            Image.classList.remove('clicked');
            authentication_img_log_pass.splice(authentication_img_log_pass.indexOf(element.id), 1);
        } else {
            Image.classList.add('clicked');
            authentication_img_log_pass.push(element.id);
        }
    }
}

function signup() {
    sessionStorage.setItem('authentication_name', document.getElementById('authentication_mail').value);
    sessionStorage.setItem('authentication_img_pass', JSON.stringify(authentication_img_pass));
    const token = generateToken();
    saveToken(token);
    var myText = 'Account Created Successfully';
    alert(myText);
    checkToken(); // Call checkToken to start the session timer
}

function signin() {
    let str = document.getElementById('inmail').value;
    let array = sessionStorage.getItem('authentication_img_pass');
    let check1 = array === JSON.stringify(authentication_img_log_pass);
    if ((!str.localeCompare(sessionStorage.getItem('authentication_name'))) && check1) {
        var myText = 'Login is successful';
        alert(myText);
        NewTab();
        checkToken(); // Call checkToken to reset the session timer
    } else {
        var myText = 'Login Failed';
        alert(myText);
        loginFailed();
    }
}

function loginFailed() {
    emailjs.send('service_8xnqvvc', 'template_ww87rq6')
        .then(function(res) {
            alert('Mail sent successfully');
        });
}

function forgetPassword() {
    emailjs.send('service_8xnqvvc', 'template_jtj0ht8')
    .then(function(res) {
        alert('Mail Sent successfully');
    });
}

function NewTab() {
    window.open('https://hamzaayazkhan.netlify.app/', '_blank');
}

function saveToken(token) {
    sessionStorage.setItem(tokenKey, token);
}

function getToken() {
    return sessionStorage.getItem(tokenKey);
}

function clearToken() {
    sessionStorage.removeItem(tokenKey);
}

function generateToken() {
    const payload = {
        userId: sessionStorage.getItem('authentication_name'),
        exp: Math.floor(Date.now() / 1000) + 30, // Expiry in 30 seconds
    };
    return btoa(JSON.stringify(payload)); // Encode payload as base64
}

function checkToken() {
    const token = getToken();

    if (token) {
        try {
            const payload = JSON.parse(atob(token)); // Decode base64
            if (payload.exp < Math.floor(Date.now() / 1000)) {
                clearToken();
                alert('Your session has expired.');
            } else {
                startSessionTimer();
            }
        } catch (error) {
            console.error('Token parsing failed:', error);
            clearToken();
        }
    } else {
        console.log('No token found');
    }
}

function startSessionTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        clearToken();
        alert('Your session has expired.');
    }, 30000); // 30 seconds
}

// Call this function when the page loads to check token expiration
checkToken();
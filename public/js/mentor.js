let signINBtn = document.querySelectorAll('.indicator-button');
for (let i = 0; i < signINBtn.length; i++) {
    signINBtn[i].addEventListener('click', function () {
        for (let j = 0; j < signINBtn.length; j++) {
            signINBtn[j].classList.remove('active-btn');
        }
        this.classList.add('active-btn');
    })
}

const password = document.querySelector('.password');
const confirm_password = document.querySelector('.comfrim-password');
const SignUp = document.querySelector('.SignUp');
var message = document.getElementById("message");

SignUp.addEventListener("click", function () {

    if (password.value === "" || confirm_password.value === "") {
        message.innerHTML = "Both password fields must be filled out.";
        message.style.color = "red";
    } else if (password.value !== confirm_password.value) {
        message.innerHTML = "Passwords do not match. Please try again.";
        message.style.color = "red";
        password.value = "";
        confirm_password.value = "";
    } else {
        message.innerHTML = "Password validation successful!";
        message.style.color = "green";
    }
});
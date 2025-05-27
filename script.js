const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");
const logEmail = document.querySelector(".log-mail")
const regEmail = document.querySelector(".reg-mail")
const logPassword = document.querySelector(".log-password")
const regPassword = document.querySelector(".reg-password")
const loginBtn = document.querySelector(".log-btn")
const registerBtn = document.querySelector(".reg-btn")
const userName = document.querySelector(".username");
const links = document.querySelectorAll("#container a");
const closeBtns = document.querySelectorAll(".close");




// STYLING
loginContainer.classList.add("active")

links.forEach(link =>{
    link.addEventListener("click", (e) =>{
        e.preventDefault();

        if(link.textContent.includes("Register")){
            loginContainer.classList.remove("active");
            registerContainer.classList.add("active");
        }else if(link.textContent.includes("Sign In")){
            loginContainer.classList.add("active")
            registerContainer.classList.remove("active")
        }
    });
});

closeBtns.forEach(btn =>{
    btn.addEventListener ("click", () =>{
        loginContainer.classList.remove("active");
        registerContainer.classList.remove("active");
    });
});

// FILLING
validateEmail = (email) => {
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return pattern.test(email);
}

// login FORM
loginContainer.addEventListener("submit",(e) =>{
    e.preventDefault();
    const email = loginContainer.email.value;
    const password = loginContainer.password.value;

    if(!validateEmail(email)){
        alert("Please enter a valid email.");
        return;
    }
    if(password === ""){
        alert("Isert a password!");
        return;
    }


    console.log("Login Success:",{email,password});
    alert("Login successful!");
    loginContainer.reset();
});

registerContainer.addEventListener("submit", (e) =>{
    e.preventDefault();

    const email = registerContainer.regEmail.value;
    const username = registerContainer.regUsername.value;
    const password = registerContainer.regPassword.value;
    if(!validateEmail(email)){
        alert("Enter a valid Email")
        return;
    }
    if (userName.length< 4){
        alert("Username must be more than 4 characters ")
        return;
    }
    if (password.length< 8){
        alert("Password must be 8 or more characters!")
        return;
    }

    console.log("Registration successful",{email,username,password});
    alert("Registration Successful!");
    registerContainer.reset();
});
registerBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    registerContainer.classList.remove("active");
    loginContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    if(logEmail.value !== regEmail.value){
        alert("You do not have an account yet, please register first.");
        return;
    }
    if (logPassword.value !== regPassword.value){
        alert("Passwords do not match, please try again.");
        return;
    }
    loginContainer.classList.remove("active");
    alert("Login Successful!");
});

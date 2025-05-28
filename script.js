const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");
const logEmail = document.querySelector(".log-mail input");
const regEmail = document.querySelector(".reg-mail input");
const logPassword = document.querySelector(".log-password input");
const regPassword = document.querySelector(".reg-password input");
const loginBtn = document.querySelector(".log-btn");
const registerBtn = document.querySelector(".reg-btn");
const userName = document.querySelector(".username input");
const links = document.querySelectorAll("#container a");
const closeBtns = document.querySelectorAll(".close");

// STYLING
loginContainer.classList.add("active");

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    if (link.textContent.includes("Register")) {
      loginContainer.classList.remove("active");
      registerContainer.classList.add("active");
    } else if (link.textContent.includes("Sign In")) {
      loginContainer.classList.add("active");
      registerContainer.classList.remove("active");
    }
  });
});

closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    loginContainer.classList.remove("active");
    registerContainer.classList.remove("active");
  });
});

// EMAIL VALIDATION
const validateEmail = (email) => {
  const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  return pattern.test(email);
};

// LOGIN FORM
loginContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = logEmail.value.trim();
  const password = logPassword.value.trim();

  if (!validateEmail(email)) {
    alert("Please enter a valid email.");
    return;
  }
  if (password === "") {
    alert("Insert a password!");
    return;
  }

  // Check if it matches registered data
  if (email !== regEmail.value.trim()) {
    alert("You do not have an account yet, please register first.");
    return;
  }

  if (password !== regPassword.value.trim()) {
    alert("Passwords do not match, please try again.");
    return;
  }

  console.log("Login Success:", { email, password });
  alert("Login successful!");

  // Redirect to car-ribu.html
  window.location.href = "car-ibu.html";
});

// REGISTER FORM
registerContainer.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = regEmail.value.trim();
  const username = userName.value.trim();
  const password = regPassword.value.trim();

  if (!validateEmail(email)) {
    alert("Enter a valid Email");
    return;
  }
  if (username.length < 4) {
    alert("Username must be more than 4 characters.");
    return;
  }
  if (password.length < 8) {
    alert("Password must be 8 or more characters!");
    return;
  }

  console.log("Registration successful", { email, username, password });
  alert("Registration Successful!");
  registerContainer.reset();
});

// Handle "Sign Up" button back to Login
registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.classList.remove("active");
  loginContainer.classList.add("active");
});


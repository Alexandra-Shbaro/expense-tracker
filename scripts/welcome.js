document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    loginButton.addEventListener("click", () => {
        window.location.href = "login.html";
    });

    signupButton.addEventListener("click", () => {
        window.location.href = "signup.html";
    });
});

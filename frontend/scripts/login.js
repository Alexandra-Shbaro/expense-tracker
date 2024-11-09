document.addEventListener("DOMContentLoaded", () => {
    // Check if user is in local storage
    let local_user = localStorage.getItem("user_id");
    console.log(local_user);
    if (local_user) {
        window.location.replace("/expense-tracker/frontend/index.html") ;
    }
    const form = document.getElementById("login_form"); 

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);

        try {
            const response = await fetch("/expense-tracker/backend/api/login.php", {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (res.success) {
                localStorage.setItem("user_id", res.user_id);
                window.location.replace("./frontend/index.html");
            } else {
                alert(`Login failed: ${res.message}`);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
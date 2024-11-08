document.addEventListener("DOMContentLoaded", () => {
    // Check if user is in local storage
    let local_user = localStorage.getItem("user_id");
    if (local_user) {
        window.location.href = "/expense-tracker/index.html";
    }
    const form = document.getElementById("signup_form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("/expense-tracker/api/createUser.php", {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (res.success) {
                alert("Signup successful!");
                window.location.href = "index.html";
            } else {
                alert(`Signup failed: ${res.message}`);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again.");
        }
    });
});

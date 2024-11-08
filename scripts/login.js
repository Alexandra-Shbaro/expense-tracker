document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login_form"); 

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);

        try {
            const response = await fetch("/expense-tracker/api/login.php", {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (res.success) {
                localStorage.setItem("user_id", res.user_id);
                window.location.href = "index.html";
            } else {
                alert(`Login failed: ${res.message}`);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
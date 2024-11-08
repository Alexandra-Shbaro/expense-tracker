document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login_form"); 

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);

        try {
            // Send a POST request to the server
            const response = await fetch("/expense-tracker/api/login.php", {
                method: "POST",
                body: formData,
            });

            // Parse the response as JSON
            const res = await response.json();

            // Handle the response
            if (res.success) {
                // Set the user ID in localStorage
                localStorage.setItem("user_id", res.user_id);

                // Redirect to index.html
                window.location.href = "index.html";
            } else {
                // Show an error message
                alert(`Login failed: ${res.message}`);
            }
        } catch (error) {
            // Handle any errors
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
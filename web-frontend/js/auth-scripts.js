document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);

            try {
                const response = await fetch("/bartholomew-binkleburg/php/register.php", {
                    method: "POST",
                    body: formData
                });

                const data = await response.text();
                alert(data);
                if (data.toLowerCase().includes("successful")) {
                    window.location.href = "auth-index.html"; 
                }
            } catch (error) {
                alert("An error occurred while registering. Please try again.");
                console.error("Registration error:", error);
            }
        });
    }
});

// Password Visibility Toggle
function togglePasswordVisibility() {
    let passwordField = document.getElementById("password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}

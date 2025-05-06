document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".account-container")) {
        // Fetch and display user info
        fetch("php/get_user.php")
            .then(response => response.json())
            .then(data => {
                const usernameDisplay = document.getElementById("username-display");
                if (usernameDisplay) {
                    usernameDisplay.textContent = data.username || "Guest";
                }
            })
            .catch(err => console.error("Error fetching user:", err));

        // Fetch and display search history
        // Fetch and display search history
        fetch("http://localhost:5000/history")
            .then(response => response.json())
            .then(history => {
               const historyList = document.getElementById("history-list");
               historyList.innerHTML = "";

                if (history.length === 0) {
                    historyList.innerHTML = "<li>No search history found.</li>";
                } else {
                    history.forEach(entry => {
                        const li = document.createElement("li");
                        const colorText = entry.color ? ` (${entry.color})` : "";
                        li.textContent = `${entry.class_name}${colorText} – ${entry.results_count} results`;
                        historyList.appendChild(li);
                    });
                }
            })
            .catch(err => {
                console.error("Error fetching history:", err);
            });

    }

    // Profile Dropdown Toggle
    const profileLink = document.getElementById("profile-link");
    if (profileLink) {
        profileLink.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector(".profile-container").classList.toggle("active");
        });
    }

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        const profileContainer = document.querySelector(".profile-container");
        if (profileContainer && !profileContainer.contains(event.target)) {
            profileContainer.classList.remove("active");
        }
    });

    // Logout Function
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            fetch("php/logout.php").then(() => {
                alert("You have been logged out!");
                window.location.href = "auth-index.html";
            });
        });
    }
});

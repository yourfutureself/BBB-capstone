// Selecting elements
const searchButton = document.getElementById('searchButton');
const contributeButton = document.getElementById('contributeButton');
const imageUpload = document.getElementById('imageUpload');
const contributeUpload = document.getElementById('contributeUpload');
const imageFileName = document.getElementById('imageFileName');
const contributeFileName = document.getElementById('contributeFileName');
const clearImage = document.getElementById('clearImage');
const clearContribute = document.getElementById('clearContribute');

//adding for flask
// Function to upload image and get matches from Flask
function uploadImageToFlask() {
    const imageUpload = document.getElementById('imageUpload');

    if (!imageUpload.files.length) {
        alert("Please select an image first!");
        return;
    }

    const formData = new FormData();
    formData.append('image', imageUpload.files[0]); // image matches Flask's upload_image()

    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error("Upload failed");
        return response.json();
    })
    .then(data => {
        console.log("Received matches:", data.matches);

        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = ''; // Clear old results

        if (data.matches.length === 0) {
            resultsContainer.textContent = "No matches found.";
        } else {
            data.matches.forEach(filename => {
                const img = document.createElement('img');
                img.src = `http://localhost:5000/static/matches/${filename}`;
                img.alt = filename;
                img.style.width = "150px";
                img.style.margin = "10px";
                resultsContainer.appendChild(img);
            });
        }
    })
    .catch(error => {
        console.error("Error uploading image:", error);
        alert("Something went wrong during upload. Check console for details.");
    });
}

// Show selected file name with "❌" icon (Search)
if (imageUpload) {
    imageUpload.addEventListener('change', () => {
        if (imageUpload.files.length > 0) {
            imageFileName.textContent = imageUpload.files[0].name;
            clearImage.style.display = "inline"; 
        } else {
            imageFileName.textContent = "No file chosen";
            clearImage.style.display = "none"; 
        }
    });
}

// Show selected file name with "❌" icon (Contribute)
if (contributeUpload) {
    contributeUpload.addEventListener('change', () => {
        if (contributeUpload.files.length > 0) {
            contributeFileName.textContent = contributeUpload.files[0].name;
            clearContribute.style.display = "inline";
        } else {
            contributeFileName.textContent = "No file chosen";
            clearContribute.style.display = "none";
        }
    });
}

// Clear uploaded image when clicking "❌" (Search)
if (clearImage) {
    clearImage.addEventListener('click', () => {
        imageUpload.value = ""; 
        imageFileName.textContent = "No file chosen"; 
        clearImage.style.display = "none"; 
    });
}

// Clear uploaded image when clicking "❌" (Contribute)
if (clearContribute) {
    clearContribute.addEventListener('click', () => {
        contributeUpload.value = "";
        contributeFileName.textContent = "No file chosen";
        clearContribute.style.display = "none";
    });
}

// Search Button Click Event
if (searchButton) {
    if (searchButton) {
        searchButton.addEventListener('click', uploadImageToFlask);
    }
}

// Contribute Button Click Event
if (contributeButton) {
    contributeButton.addEventListener('click', () => {
        if (!contributeUpload.files.length) {
            alert("Please select an image before contributing.");
            return;
        }
        alert("Thank you for your contribution! The image has been submitted.");
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


// Color + Item Search via Flask
const colorSearchButton = document.getElementById("searchByColorButton");
if (colorSearchButton) {
    colorSearchButton.addEventListener("click", () => {
        const item = document.getElementById("item-select").value;
        const color = document.getElementById("color-select").value;

        if (!item) {
            alert("Please select an item.");
            return;
        }

        let url = `http://localhost:5000/search?class_name=${encodeURIComponent(item)}`;
        if (color) {
            url += `&color_filter=${encodeURIComponent(color)}`;
        }
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Network error");
                return response.json();
            })
            .then(results => {
                const resultsContainer = document.getElementById("resultsContainer");
                resultsContainer.innerHTML = "";

                if (results.length === 0) {
                    resultsContainer.textContent = "No matches found.";
                } else {
                    results.forEach(result => {
                        const div = document.createElement("div");
                    
                        const img = document.createElement("img");
                        img.src = `http://localhost:5000/static/images/${result.image_file}`;
                        img.alt = result.image_file;
                        img.style.width = "150px";
                        img.style.margin = "10px";
                        img.style.border = "2px solid white";
                        img.style.borderRadius = "8px";
                    
                        div.appendChild(img);

                        resultsContainer.appendChild(div);
                    });                    
                }
            })
            .catch(err => {
                console.error("Search error:", err);
                alert("Something went wrong during the color search.");
            });
    });
}

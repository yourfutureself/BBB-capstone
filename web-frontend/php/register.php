<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/plain');

// Include the database connection
require_once 'db_connect.php';

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Error: Invalid request method. Use POST.");
}

// Get user input safely
$username = htmlspecialchars(trim($_POST['username']), ENT_QUOTES, 'UTF-8');
$password = htmlspecialchars(trim($_POST['password']), ENT_QUOTES, 'UTF-8');

// Check if fields are empty
if (empty($username) || empty($password)) {
    die("Error: All fields are required.");
}

// Validate username length
if (strlen($username) < 3) {
    die("Error: Username must be at least 3 characters.");
}

// Validate password length
if (strlen($password) < 6) {
    die("Error: Password must be at least 6 characters.");
}

// Hash the password securely
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if username already exists
$checkQuery = "SELECT id FROM users WHERE username = ?";
$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    die("Error: Username already taken.");
}

$stmt->close();

// Insert user into the database
$insertQuery = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
$stmt = $conn->prepare($insertQuery);
$stmt->bind_param("ss", $username, $hashedPassword);

if ($stmt->execute()) {
    echo "Registration successful! Redirecting...";
} else {
    echo "Error: Unable to register. " . $stmt->error;
}

$stmt->close();
$conn->close();
?>

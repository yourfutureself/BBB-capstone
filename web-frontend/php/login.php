<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request method.");
}

$username = htmlspecialchars(trim($_POST['username']), ENT_QUOTES, 'UTF-8');
$password = htmlspecialchars(trim($_POST['password']), ENT_QUOTES, 'UTF-8');

if (empty($username) || empty($password)) {
    die("All fields are required.");
}

// Look up the user
$query = "SELECT id, username, password_hash FROM users WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    die("Username not found.");
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password_hash'])) {
    die("Incorrect password.");
}

// SUCCESS set session and redirect
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

header("Location: ../index.html");
exit();
?>

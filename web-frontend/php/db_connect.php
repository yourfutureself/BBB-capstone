<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";  // Default for XAMPP
$password = "";      // Default for XAMPP
$dbname = "bartholomew-binkleburg";

// Connect to MySQL
$conn = new mysqli('localhost', 'root', '', 'bartholomew-binkleburg');

// Check for errors
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>

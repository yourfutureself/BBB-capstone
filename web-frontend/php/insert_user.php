<?php
$conn = new mysqli("localhost", "root", "", "user_auth");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = "testUser";
$password_hash = password_hash("password123", PASSWORD_BCRYPT);

$sql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password_hash);

if ($stmt->execute()) {
    echo "User added successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>

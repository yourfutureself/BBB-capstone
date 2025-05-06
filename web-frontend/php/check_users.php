<?php
$conn = new mysqli("localhost", "root", "", "user_auth");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, username, created_at FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row["id"] . " - Username: " . $row["username"] . " - Created at: " . $row["created_at"] . "<br>";
    }
} else {
    echo "No users found.";
}

$conn->close();
?>

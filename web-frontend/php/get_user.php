<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["username" => "Guest"]);
    exit;
}

require 'db_connect.php';

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

echo json_encode([
    "username" => $user['username']
]);


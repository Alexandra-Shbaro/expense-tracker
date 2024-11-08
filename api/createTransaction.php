<?php

include "connection.php";

$user_id = $_POST['user_id'];
$type = $_POST['type'];
$amount = $_POST['amount'];
$notes = $_POST['notes'];
$date = $_POST['date'];

$sql = "SELECT * FROM users WHERE user_id = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}

$user = $result->fetch_assoc();  

$sql = "INSERT INTO transactions (user_id, type, amount, notes, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $connection->prepare($sql);
$stmt->bind_param("isdss", $user_id, $type, $amount, $notes, $date);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Transaction added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error adding transaction"]);
}

$stmt->close();
$connection->close();

?>

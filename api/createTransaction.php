<?php

include "connection.php";

try{
// Check if all necessary variables are set and not empty
if (!isset($_POST['user_id'], $_POST['type'], $_POST['amount'], $_POST['notes'], $_POST['date']) || 
    empty($_POST['user_id']) || 
    empty($_POST['type']) || 
    empty($_POST['amount']) || 
    empty($_POST['notes']) || 
    empty($_POST['date'])) {

    echo json_encode(["success" => false, "message" => "Missing params"]);
    exit; // Stop execution if parameters are missing or empty
}

$user_id = $_POST['user_id'];
$type = $_POST['type'];
$amount = $_POST['amount'];
$notes = $_POST['notes'];
$date = $_POST['date'];

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
}
catch (Exception $e) {
    echo json_encode(["message" => "Unexpected error"]);
}

?>

<?php

include "connection.php";

try{
if (!isset($_POST['transaction_id']) || !isset($_POST['amount']) || !isset($_POST['notes']) || !isset($_POST['date'])) {
    echo json_encode(["success" => false, "message" => "Missing required parameters"]);
    exit();
}

$transaction_id = $_POST['transaction_id'];
$amount = $_POST['amount'];
$notes = $_POST['notes'];
$date = $_POST['date'];

if ($connection === false) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$sql = "UPDATE transactions SET amount = ?, notes = ?, date = ? WHERE transaction_id = ?";
$stmt = $connection->prepare($sql);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Failed to prepare SQL statement"]);
    exit();
}

$stmt->bind_param("dssi", $amount, $notes, $date, $transaction_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Transaction updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating transaction: " . $stmt->error]);
}

$stmt->close();
$connection->close();

}
catch{
    echo json_encode(["message"=>"Unexpected error"]);
}
?>

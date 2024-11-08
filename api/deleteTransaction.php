<?php

include "connection.php";

// Ensure transaction_id is provided
if (!isset($_POST['transaction_id'])) {
    echo json_encode(["success" => false, "message" => "Missing transaction_id"]);
    exit();
}

$transaction_id = $_POST['transaction_id'];

// Prepare SQL delete statement
$sql = "DELETE FROM transactions WHERE transaction_id = ?";
$stmt = $connection->prepare($sql);

// Check if statement was prepared successfully
if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Failed to prepare SQL statement"]);
    exit();
}

$stmt->bind_param("i", $transaction_id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Transaction deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "No transaction found to delete"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error deleting transaction: " . $stmt->error]);
}

// Close statement and connection
$stmt->close();
$connection->close();

?>

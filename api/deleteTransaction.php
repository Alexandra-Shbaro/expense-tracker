<?php

include "connection.php";

if (!isset($_POST['transaction_id'])) {
    echo json_encode(["success" => false, "message" => "Missing transaction_id"]);
    exit();
}

$transaction_id = $_POST['transaction_id'];

if ($connection === false) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$sql = "DELETE FROM transactions WHERE transaction_id = ?";
$stmt = $connection->prepare($sql);

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

$stmt->close();
$connection->close();

?>

<?php

include "connection.php";

if (!isset($_POST['user_id'])) {
    echo json_encode(["success" => false, "message" => "Missing user_id"]);
    exit();
}

$user_id = $_POST['user_id'];


$sql = "SELECT * FROM transactions WHERE user_id = ?";

$stmt = $connection->prepare($sql);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Error preparing the query"]);
    exit();
}

$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Error executing the query"]);
    exit();
}

$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

if (empty($result)) {
    echo json_encode(["success" => true, "data"=>[]]);
    exit();
}

echo json_encode(["success" => true, "data" => $result]);

$stmt->close();
$connection->close();
?>

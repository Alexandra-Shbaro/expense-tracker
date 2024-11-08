<?php

include "connection.php"; 


if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    
    $sql = "SELECT * FROM users WHERE user_id=?";
    $stmt = $connection->prepare($sql); 

    if ($stmt) {
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        $result = $stmt->get_result()->fetch_assoc();
        echo json_encode($result);
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error in SQL statement: Either syntax error, database connection, or parameter binding mismatch"]);
    }
} else {
    echo json_encode(["success" =>false, "message" => "user_id parameter is missing."]);
}

$connection->close(); 
?>

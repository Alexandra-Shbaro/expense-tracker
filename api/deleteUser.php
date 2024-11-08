<?php

include "connection.php";
try{
if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    
    $sql = "DELETE FROM users WHERE user_id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting user"]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "user_id not provided"]);
}

$connection->close();

}
catch{
    echo json_encode(["message"=>"Unexpected error"]);
}
?>

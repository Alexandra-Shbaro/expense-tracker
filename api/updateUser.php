<?php 

include "connection.php";
try{
if (isset($_POST['user_id']) && isset($_POST['username']) && isset($_POST['email'])) {
    $user_id = $_POST['user_id'];
    $username = $_POST['username'];
    $email = $_POST['email'];

    $sql = "UPDATE users SET username = ?, email = ? WHERE user_id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("ssi", $username, $email, $user_id);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating user"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Missing required parameters"]);
}

$connection->close();
}
catch{
    echo json_encode(["message"=>"Unexpected error"]);
}
?>

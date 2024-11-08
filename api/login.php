<?php
include "connection.php";

header("Access-Control-Allow-Origin");

if (
    !isset($_POST['username']) || empty($_POST['username']) ||
    !isset($_POST['password']) || empty($_POST['password'])
) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

$username = $_POST['username'];
$password = $_POST['password']; 

$sql = "SELECT user_id, password FROM users WHERE username = ?";
$stmt = $connection->prepare($sql);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Error in SQL statement: Either syntax error or database connection issue"]);
    exit();
}

$stmt->bind_param("s", $username);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc(); 

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Login successful.",
            "user_id" => $user['user_id']
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid password."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
}

$stmt->close();
$connection->close();
?>
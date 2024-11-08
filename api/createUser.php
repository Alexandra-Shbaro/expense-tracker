<?php 

include "connection.php";

//checking if fields are set
if (!isset($_POST['username']) || empty($_POST['username']) ||
    !isset($_POST['password']) || empty($_POST['password']) ||
    !isset($_POST['email']) || empty($_POST['email'])) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$email = $_POST['email'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format."]);
    exit();
}

$sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

$stmt = $connection->prepare($sql);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Failed"]);
    exit();
}

$stmt->bind_param("sss", $username, $password, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error creating user: " . $stmt->error]);
}

$stmt->close();
$connection->close();

?>

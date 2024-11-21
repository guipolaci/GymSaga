<?php
$servername = "localhost";
$username = "root";
$dbname = "gym_saga_db";
$password = "";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo json_encode(["status" => "success", "message" => "Conectado"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Conexão falhou: " . $e->getMessage()]);
}
?>

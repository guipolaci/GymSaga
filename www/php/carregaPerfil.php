<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];

    try {
        $sql = "SELECT nome, pontos, nivel, foto, email, sexo, peso, altura, data_nasc FROM Usuario WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userData) {
            echo json_encode(['status' => 'success', 'data' => $userData]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Usuário não encontrado.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro no servidor: ' . $e->getMessage()]);
    }
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    try {
        $sql = "SELECT login_id, senha FROM Login WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $login = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$login) {
            echo json_encode(['status' => 'error', 'message' => 'E-mail não encontrado.']);
            exit;
        }

        if (!password_verify($senha, $login['senha'])) {
            echo json_encode(['status' => 'error', 'message' => 'Senha incorreta.']);
            exit;
        }

        $sqlUsuario = "SELECT user_id FROM Usuario WHERE login_id = :login_id";
        $stmtUsuario = $conn->prepare($sqlUsuario);
        $stmtUsuario->bindParam(':login_id', $login['login_id']);
        $stmtUsuario->execute();
        $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            echo json_encode(['status' => 'error', 'message' => 'Usuário não encontrado.']);
            exit;
        }

        header("Content-Type: application/json; charset=UTF-8");

        echo json_encode(['status' => 'success', 'message' => 'Login realizado com sucesso!', 'user_id' => $usuario['user_id']]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro no servidor: ' . $e->getMessage()]);
    }
}
?>

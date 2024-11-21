<?php
include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    if (empty($nome) || empty($email) || empty($senha)) {
        echo json_encode(['status' => 'error', 'message' => 'Preencha todos os campos.']);
        exit;
    }

    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    try {
        $conn->beginTransaction();

        $sqlLogin = "INSERT INTO Login (email, senha) VALUES (:email, :senha)";
        $stmtLogin = $conn->prepare($sqlLogin);
        $stmtLogin->bindParam(':email', $email);
        $stmtLogin->bindParam(':senha', $senha_hash);
        $stmtLogin->execute();

        $login_id = $conn->lastInsertId();

        $sqlUsuario = "INSERT INTO Usuario (nome, email, login_id) VALUES (:nome, :email, :login_id)";
        $stmtUsuario = $conn->prepare($sqlUsuario);
        $stmtUsuario->bindParam(':nome', $nome);
        $stmtUsuario->bindParam(':email', $email);
        $stmtUsuario->bindParam(':login_id', $login_id);
        $stmtUsuario->execute();

        $user_id = $conn->lastInsertId();

        $conn->commit();

        echo json_encode(['status' => 'success', 'message' => 'Cadastro realizado com sucesso!', 'user_id' => $user_id]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar: ' . $e->getMessage()]);
    }
}

?>
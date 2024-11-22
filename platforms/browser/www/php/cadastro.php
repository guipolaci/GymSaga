<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    try {
        $conn->beginTransaction();

        $sqlChecaEmail = "SELECT COUNT(*) FROM Login WHERE email = :email";
        $stmtChecaEmail = $conn->prepare($sqlChecaEmail);
        $stmtChecaEmail->bindParam(':email', $email);
        $stmtChecaEmail->execute();
        $emails = $stmtChecaEmail->fetchColumn();

        if ($emails > 0) {
            echo json_encode(['status' => 'error', 'message' => 'O email já está sendo usado.']);
            exit;
        }

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

        header("Content-Type: application/json; charset=UTF-8");

        echo json_encode(['status' => 'success', 'message' => 'Cadastro realizado com sucesso!', 'user_id' => $user_id]);

    } catch (PDOException $e) {
        if ($e->errorInfo[1] == 1062) {
            echo json_encode(['status' => 'error', 'message' => 'Email já cadastrado.']);
        }

        echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar: ' . $e->getMessage()]);
    }
}
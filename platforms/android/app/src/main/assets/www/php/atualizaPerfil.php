<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $nome = $_POST['nome'];
    $sexo = $_POST['sexo'];
    $peso = $_POST['peso'];
    $altura = $_POST['altura'];
    $data_nasc = $_POST['data_nasc'];

    if (!$user_id || !$nome || !$sexo || !$peso || !$altura || !$data_nasc) {
        echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
        exit;
    }

    $fotoPath = null;
    if (!empty($_FILES['foto']['name'])) {
        $fotoPath = 'uploads/' . uniqid() . '_' . $_FILES['foto']['name'];
        move_uploaded_file($_FILES['foto']['tmp_name'], $fotoPath);
    }

    try {
        $sql = "UPDATE Usuario SET nome = :nome, sexo = :sexo, peso = :peso, altura = :altura, data_nasc = :data_nasc";
        if ($fotoPath) {
            $sql .= ", foto = :foto";
        }
        $sql .= " WHERE user_id = :user_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':sexo', $sexo);
        $stmt->bindParam(':peso', $peso);
        $stmt->bindParam(':altura', $altura);
        $stmt->bindParam(':data_nasc', $data_nasc);
        if ($fotoPath) {
            $stmt->bindParam(':foto', $fotoPath);
        }
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Perfil atualizado com sucesso!']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro no servidor: ' . $e->getMessage()]);
    }
}
?>

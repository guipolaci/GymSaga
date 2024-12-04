<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $raridade = $_POST['raridade'] ?? 'Todas';

    if (!$user_id) {
        echo json_encode(['status' => 'error', 'message' => 'User ID não informado.']);
        exit;
    }

    try {
        $sql = "SELECT i.item_id, i.data_aquisicao, u.user_id, u.nome AS usuario_nome, it.nome AS item_nome, it.raridade, it.imagem 
                FROM Inventario i
                JOIN Usuario u ON i.user_id = u.user_id
                JOIN Item it ON i.item_id = it.item_id
                WHERE i.user_id = :user_id";
        
        if ($raridade !== 'Todas') {
            $sql .= " AND it.raridade = :raridade";
        }

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        if ($raridade !== 'Todas') {
            $stmt->bindParam(':raridade', $raridade, PDO::PARAM_STR);
        }
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) > 0) {
            echo json_encode(['status' => 'success', 'itens' => $result]);
        } else {
            echo json_encode(['status' => 'vazio', 'message' => 'Nenhum item encontrado.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao consultar inventário: ' . $e->getMessage()]);
    }
}
?>

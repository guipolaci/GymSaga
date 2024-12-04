<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

try {
    $sql = "SELECT nome, pontos FROM Usuario ORDER BY pontos DESC LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $ranking]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao obter ranking: ' . $e->getMessage()]);
}
?>

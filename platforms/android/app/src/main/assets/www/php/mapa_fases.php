<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];

    try {
        $sql = "
            SELECT 
                f.fase_id, 
                f.nome AS fase_nome, 
                f.dificuldade, 
                p.status_conclusao,
                CASE 
                    WHEN p.status_conclusao = 'concluído' THEN 'completed'
                    WHEN (
                        SELECT COUNT(*) 
                        FROM Progresso p2 
                        WHERE p2.user_id = :user_id 
                        AND p2.fase_id < f.fase_id 
                        AND p2.status_conclusao != 'concluído'
                    ) = 0 THEN 'active'
                    ELSE 'locked'
                END AS fase_status
            FROM Progresso p
            JOIN Fase f ON p.fase_id = f.fase_id
            WHERE p.user_id = :user_id
            ORDER BY 
                CASE f.dificuldade
                    WHEN 'Fácil' THEN 1
                    WHEN 'Médio' THEN 2
                    WHEN 'Difícil' THEN 3
                END ASC, 
                f.fase_id ASC
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $fases = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($fases) > 0) {
            echo json_encode(['status' => 'success', 'fases' => $fases]);
        } else {
            echo json_encode(['status' => 'vazio', 'message' => 'Nenhuma fase encontrada.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao consultar fases: ' . $e->getMessage()]);
    }
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $user_id = $_POST['user_id'];
    $local = $_POST['local'];
    $objetivo = $_POST['objetivo'];
    $experiencia = $_POST['experiencia'];
    $sexo = $_POST['sexo'];
    $data_nasc = $_POST['data_nasc'];
    $peso = $_POST['peso'];
    $altura = $_POST['altura'];

    try {
        $conn->beginTransaction();
        // insere dados na tabela do formulario
        $sqlFormulario = "INSERT INTO Dados_Formulario (user_id, local, objetivo, experiencia) VALUES (:user_id, :local, :objetivo, :experiencia)";
        $stmtFormulario = $conn->prepare($sqlFormulario);
        $stmtFormulario->bindParam(':user_id', $user_id);
        $stmtFormulario->bindParam(':local', $local);
        $stmtFormulario->bindParam(':objetivo', $objetivo);
        $stmtFormulario->bindParam(':experiencia', $experiencia);
        $stmtFormulario->execute();

        // insere dados na tabela usuario
        $sqlUsuario = "UPDATE Usuario SET sexo = :sexo, data_nasc = :data_nasc, peso = :peso, altura = :altura WHERE user_id = :user_id";
        $stmtUsuario = $conn->prepare($sqlUsuario);
        $stmtUsuario->bindParam(':sexo', $sexo);
        $stmtUsuario->bindParam(':data_nasc', $data_nasc);
        $stmtUsuario->bindParam(':peso', $peso);
        $stmtUsuario->bindParam(':altura', $altura);
        $stmtUsuario->bindParam(':user_id', $user_id);
        $stmtUsuario->execute();

        // filtra as fases 
        $sqlFases = "SELECT fase_id, pontos_dado FROM Fase WHERE local = :local AND objetivo = :objetivo";
        $stmtFases = $conn->prepare($sqlFases);
        $stmtFases->bindParam(':local', $local);
        $stmtFases->bindParam(':objetivo', $objetivo);
        $stmtFases->execute();
        $fases = $stmtFases->fetchAll(PDO::FETCH_ASSOC);

        // Insere as fases filtradas na tabela progresso
        foreach ($fases as $fase) {
            $sqlProgresso = "INSERT INTO Progresso (user_id, fase_id, pontuacao_obtida, status_conclusao, data_conclusao, data_inicio) VALUES (:user_id, :fase_id, :pontuacao_obtida, 'não iniciado', NULL, :data_inicio)";
            $stmtProgresso = $conn->prepare($sqlProgresso);
            $stmtProgresso->bindParam(':user_id', $user_id);
            $stmtProgresso->bindParam(':fase_id', $fase['fase_id']);
            $stmtProgresso->bindParam(':pontuacao_obtida', $fase['pontos_dado']);
            $stmtProgresso->bindValue(':data_inicio', date('Y-m-d'));
            $stmtProgresso->execute();
        }

        $conn->commit();

        header("Content-Type: application/json; charset=UTF-8");

        echo json_encode(['status' => 'success', 'message' => 'Formulário enviado com sucesso!']);

    } catch (PDOException $e) {
        $conn->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'Erro ao enviar formulário: ' . $e->getMessage()]);
    }
}
?>



<?php
include 'db.php';

// Receber o estado a partir da requisição
$isOpen = isset($_POST['is_open']) ? (int)$_POST['is_open'] : 0;

// Atualizar o status da loja
$sql = "UPDATE store_status SET is_open = $isOpen WHERE id = 1";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
?>

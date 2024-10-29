<?php
include 'db.php';

// Consultar o status da loja
$sql = "SELECT is_open FROM store_status WHERE id = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["is_open" => (bool)$row['is_open']]);
} else {
    echo json_encode(["is_open" => false]);
}

$conn->close();
?>

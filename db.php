<?php
// Credenciais do banco de dados
$servername = "localhost:8888";
$username = "root";
$password = "root";
$dbname = "u255572643_loja";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

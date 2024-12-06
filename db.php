<?php
// Credenciais do banco de dados
$servername = "localhost";
$username = "u255572643_bigpizza";
$password = "Bigpizza_123";
$dbname = "u255572643_loja";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

<?php
include 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_address, service_type, payment_method, observation, addons_observation, delivery_day, delivery_time, delivery_location, pickup_day, pickup_time, items, add_ons, cart_subtotal, addons_total, delivery_fee, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$items = json_encode($data['cart'] ?? []);
$addons = json_encode($data['addOns'] ?? []);

$stmt->bind_param(
    'sssssssssssssdddd',
    $data['name'],
    $data['address'],
    $data['serviceType'],
    $data['paymentMethod'],
    $data['observation'],
    $data['addonsObservation'],
    $data['deliveryDay'],
    $data['deliveryTime'],
    $data['deliveryLocation'],
    $data['pickupDay'],
    $data['pickupTime'],
    $items,
    $addons,
    $data['cartSubtotal'],
    $data['addOnsTotal'],
    $data['deliveryFee'],
    $data['total']
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

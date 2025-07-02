<?php
session_start();
if (!isset($_SESSION['authenticated']) || !$_SESSION['authenticated']) {
    header('Location: login.php');
    exit;
}

include '../db.php';

$filterName = $_GET['name'] ?? '';
$startDate = $_GET['start_date'] ?? '';
$endDate = $_GET['end_date'] ?? '';

$query = "SELECT * FROM orders WHERE 1=1";
$params = [];
$types = '';

if ($filterName !== '') {
    $query .= " AND customer_name LIKE ?";
    $params[] = '%' . $filterName . '%';
    $types .= 's';
}
if ($startDate !== '') {
    $query .= " AND order_date >= ?";
    $params[] = $startDate . ' 00:00:00';
    $types .= 's';
}
if ($endDate !== '') {
    $query .= " AND order_date <= ?";
    $params[] = $endDate . ' 23:59:59';
    $types .= 's';
}
$query .= " ORDER BY order_date DESC";

$stmt = $conn->prepare($query);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();
$orders = $result->fetch_all(MYSQLI_ASSOC);

$totalSales = 0;
$pizzaCounts = [];
$addonCounts = [];

foreach ($orders as $order) {
    $totalSales += (float)$order['total'];
    $items = json_decode($order['items'], true) ?: [];
    foreach ($items as $item) {
        $pizzaCounts[$item['name']] = ($pizzaCounts[$item['name']] ?? 0) + $item['quantity'];
    }
    $addons = json_decode($order['add_ons'], true) ?: [];
    foreach (['drinks','extras'] as $type) {
        if (isset($addons[$type])) {
            foreach ($addons[$type] as $name => $qty) {
                $addonCounts[$name] = ($addonCounts[$name] ?? 0) + $qty;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
        .switch { position: relative; display: inline-block; width: 60px; height: 34px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ff4d4d; transition: 0.4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; transition: 0.4s; border-radius: 50%; }
        input:checked + .slider { background-color: #4CAF50; }
        input:checked + .slider:before { transform: translateX(26px); }
    </style>
</head>
<body>
    <a href="logout.php">Logout</a>
    <h1>Dashboard</h1>
    <p>Total Sales: £<?php echo number_format($totalSales, 2); ?></p>
    <form method="get">
        <input type="text" name="name" placeholder="Customer" value="<?php echo htmlspecialchars($filterName); ?>">
        <input type="date" name="start_date" value="<?php echo htmlspecialchars($startDate); ?>">
        <input type="date" name="end_date" value="<?php echo htmlspecialchars($endDate); ?>">
        <button type="submit">Search</button>
    </form>
    <table>
        <tr><th>Date</th><th>Customer</th><th>Total</th><th>Service</th><th>Details</th></tr>
        <?php foreach ($orders as $o): ?>
        <tr>
            <td><?php echo htmlspecialchars($o['order_date']); ?></td>
            <td><?php echo htmlspecialchars($o['customer_name']); ?></td>
            <td>£<?php echo number_format($o['total'], 2); ?></td>
            <td><?php echo htmlspecialchars($o['service_type']); ?></td>
            <td><details><summary>View</summary><pre><?php echo htmlspecialchars($o['items']); ?>\nAdd-ons: <?php echo htmlspecialchars($o['add_ons']); ?></pre></details></td>
        </tr>
        <?php endforeach; ?>
    </table>

    <h2>Pizzas Sold</h2>
    <canvas id="pizzaChart" height="100"></canvas>
    <h2>Add-ons Sold</h2>
    <canvas id="addonChart" height="100"></canvas>

    <h2>Store Status</h2>
    <div class="switch-container">
        <label class="switch">
            <input type="checkbox" id="status-switch">
            <span class="slider"></span>
        </label>
        <span id="status-label">Closed</span>
    </div>

<script>
const pizzaData = <?php echo json_encode($pizzaCounts); ?>;
const addonData = <?php echo json_encode($addonCounts); ?>;

new Chart(document.getElementById('pizzaChart'), {
    type: 'bar',
    data: { labels: Object.keys(pizzaData), datasets: [{ label: 'Pizzas', data: Object.values(pizzaData) }] }
});
new Chart(document.getElementById('addonChart'), {
    type: 'bar',
    data: { labels: Object.keys(addonData), datasets: [{ label: 'Add-ons', data: Object.values(addonData) }] }
});

const statusSwitch = document.getElementById('status-switch');
const statusLabel = document.getElementById('status-label');
function fetchStoreStatus() {
    fetch('../get_status.php')
        .then(r => r.json())
        .then(d => { statusSwitch.checked = d.is_open; statusLabel.textContent = d.is_open ? 'Open' : 'Closed'; });
}
function updateStoreStatus(open) {
    fetch('../update_status.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'is_open=' + (open ? 1 : 0) });
}
fetchStoreStatus();
statusSwitch.addEventListener('change', () => { const open = statusSwitch.checked; statusLabel.textContent = open ? 'Open' : 'Closed'; updateStoreStatus(open); });
</script>
</body>
</html>

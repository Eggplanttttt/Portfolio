<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$storageDir = __DIR__ . DIRECTORY_SEPARATOR . 'storage';
$counterFile = $storageDir . DIRECTORY_SEPARATOR . 'visitor-count.txt';

if (!is_dir($storageDir) && !mkdir($storageDir, 0755, true) && !is_dir($storageDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Storage directory unavailable']);
    exit;
}

if (!file_exists($counterFile) && file_put_contents($counterFile, '0', LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Counter file unavailable']);
    exit;
}

$handle = fopen($counterFile, 'c+');

if ($handle === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to open counter file']);
    exit;
}

try {
    if (!flock($handle, LOCK_EX)) {
        throw new RuntimeException('Unable to lock counter file');
    }

    rewind($handle);
    $currentValue = trim(stream_get_contents($handle) ?: '0');
    $count = max(0, (int) $currentValue) + 1;

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, (string) $count);
    fflush($handle);
    flock($handle, LOCK_UN);

    echo json_encode(['count' => $count]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode(['error' => 'Counter update failed']);
} finally {
    fclose($handle);
}

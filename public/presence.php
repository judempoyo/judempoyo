<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$ua = strtolower((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''));
$bot = $ua === '' || (bool) preg_match('/bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless|wget|curl|python-requests|gpt|claude|anthropic|perplexity|bytespider/i', $ua);

$candidates = [
    sys_get_temp_dir() . '/jude-mpoyo-presence.json',
    __DIR__ . '/.presence.json',
];
$file = $candidates[0];
foreach ($candidates as $candidate) {
    $dir = dirname($candidate);
    if (is_dir($dir) && is_writable($dir)) {
        $file = $candidate;
        break;
    }
}

$now = time();
$onlineWindow = 90;
$state = ['visits' => 0, 'sessions' => []];

$handle = fopen($file, 'c+');
if ($handle === false) {
    echo json_encode(['visits' => 0, 'online' => $bot ? 0 : 1], JSON_UNESCAPED_SLASHES);
    exit;
}

flock($handle, LOCK_EX);
$raw = stream_get_contents($handle);
if (is_string($raw) && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $state['visits'] = max(0, (int) ($decoded['visits'] ?? 0));
        $state['sessions'] = is_array($decoded['sessions'] ?? null) ? $decoded['sessions'] : [];
    }
}

$sid = $_COOKIE['jm_sid'] ?? '';
if (!is_string($sid) || !preg_match('/^[a-f0-9]{32}$/', $sid)) {
    $sid = bin2hex(random_bytes(16));
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ((int) ($_SERVER['SERVER_PORT'] ?? 0) === 443);
    setcookie('jm_sid', $sid, [
        'expires' => $now + 86400 * 400,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

$fresh = !isset($state['sessions'][$sid]);
if (!$bot) {
    if ($fresh) {
        $state['visits']++;
    }
    $state['sessions'][$sid] = $now;
}

foreach ($state['sessions'] as $id => $seen) {
    if (!is_int($seen) || ($now - $seen) > $onlineWindow) {
        unset($state['sessions'][$id]);
    }
}

$payload = json_encode([
    'visits' => $state['visits'],
    'sessions' => $state['sessions'],
], JSON_UNESCAPED_SLASHES);
rewind($handle);
ftruncate($handle, 0);
fwrite($handle, $payload === false ? '{}' : $payload);
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

$online = count($state['sessions']);
if (!$bot && $online < 1) {
    $online = 1;
}

echo json_encode([
    'visits' => $state['visits'],
    'online' => $online,
], JSON_UNESCAPED_SLASHES);

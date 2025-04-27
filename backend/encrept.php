<?php
// Encryption key and IV (same as Node.js config)
$secret_key = "4fa3c5b6f6a8318be1e0f1e342a1c2a9569f85f74f4dbf37e70ac925ca78e147";
$iv_string = "15a8f725eab7c3d34cc4e1a6e8aa1f9a";

$key = hash('sha256', $secret_key, true); // 32 bytes key
$iv = substr($iv_string, 0, 16);           // 16 bytes IV

function encrypt($plaintext, $key, $iv) {
    $encrypted = openssl_encrypt($plaintext, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    return bin2hex($encrypted); // Convert to hex for transmission
}

function decrypt($encryptedHex, $key, $iv) {
    $encrypted = hex2bin($encryptedHex); // Convert hex back to binary
    return openssl_decrypt($encrypted, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
}

$encryptedText = '';
$decryptedText = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Encrypt the plaintext data
    if (!empty($_POST['plain_text'])) {
        $data = trim($_POST['plain_text']);
        // Ensure it's valid JSON before encrypting
        if (is_json($data)) {
            $encryptedText = encrypt($data, $key, $iv);
        } else {
            $encryptedText = 'Invalid JSON format';
        }
    }

    // Decrypt the encrypted data
    if (!empty($_POST['encrypted_text'])) {
        $encrypted = trim($_POST['encrypted_text']);
        if (ctype_xdigit($encrypted)) { // Check if it's valid hex
            $decryptedText = decrypt($encrypted, $key, $iv);
        } else {
            $decryptedText = 'Invalid hex format';
        }
    }
}

// Function to check if a string is valid JSON
function is_json($string) {
    json_decode($string);
    return (json_last_error() == JSON_ERROR_NONE);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypt / Decrypt for API Testing</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: auto;
        }
        textarea, input, button {
            width: 100%;
            padding: 10px;
            margin-top: 10px;
        }
        .section {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <h1>Encrypt / Decrypt Request-Response (PHP ↔ Node.js)</h1>
    <form method="POST">
        <div class="section">
            <h2>Encrypt Request</h2>
            <textarea name="plain_text" rows="5" placeholder='Enter JSON/plain text to encrypt'><?php echo isset($_POST['plain_text']) ? htmlspecialchars($_POST['plain_text']) : ''; ?></textarea>
            <button type="submit">Encrypt</button>
            <textarea rows="5" readonly placeholder="Encrypted output (hex)"><?php echo $encryptedText; ?></textarea>
        </div>

        <div class="section">
            <h2>Decrypt Response</h2>
            <textarea name="encrypted_text" rows="5" placeholder="Paste encrypted hex string"><?php echo isset($_POST['encrypted_text']) ? htmlspecialchars($_POST['encrypted_text']) : ''; ?></textarea>
            <button type="submit">Decrypt</button>
            <textarea rows="5" readonly placeholder="Decrypted output"><?php echo $decryptedText; ?></textarea>
        </div>
    </form>
</body>
</html>

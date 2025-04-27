const crypto = require("crypto");
const algorithm = 'AES-256-CBC';
const key = Buffer.from("4fa3c5b6f6a8318be1e0f1e342a1c2a9569f85f74f4dbf37e70ac925ca78e147", 'hex');
const iv = Buffer.from("15a8f725eab7c3d34cc4e1a6e8aa1f9a", 'hex');

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const encrypted = encrypt(`{
    "title": "This is Edited Blog modified",
    "content": "This is edited content"
}`);
const decrypted = decrypt(`d25602f05880682a2c35f85947d9c5a68eb64f7ea4d8dce54eef975639f8981c2d3e6881e1c9f8002363bb41ec9678fca434b25e3ac953dc8f7770e9badf885df6f818de893240a25d60f4480efb0bd77af1ea7e0a2245c122cb488548fbadf7`);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
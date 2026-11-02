const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

const dbPath = path.join(__dirname, 'server', 'data', 'database.json');
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  let updated = 0;
  if (db.users && Array.isArray(db.users)) {
    db.users.forEach(u => {
      if (!u.password.startsWith('scrypt$')) {
        console.log(`Criptografando senha do usuário: ${u.email} (${u.role})`);
        u.password = hashPassword(u.password);
        updated++;
      }
    });
  }
  if (updated > 0) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`✅ ${updated} senhas criptografadas com scrypt com sucesso no database.json!`);
  } else {
    console.log('ℹ️ Todas as senhas já estão devidamente criptografadas no database.json.');
  }
} else {
  console.log('Arquivo database.json não encontrado para migração.');
}

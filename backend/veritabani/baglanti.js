const { Pool } = require('pg');
require('dotenv').config();

// veritabanı bağlantı havuzunu oluştur
const havuz = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// bağlantıyı test et
havuz.connect((hata, istemci, serbestBirak) => {
  if (hata) {
    console.error('veritabanı bağlantı hatası:', hata.stack);
  } else {
    console.log('postgres veritabanına başarıyla bağlanıldı.');
  }
  if (istemci) serbestBirak();
});

module.exports = havuz;

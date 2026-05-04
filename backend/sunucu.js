const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const kullaniciRotalari = require('./rotalar/kullanici');
const talepRotalari = require('./rotalar/talep');
const istatistikRotalari = require('./rotalar/istatistikler');
const kaynakRotalari = require('./rotalar/kaynak');
const acilDurumRotalari = require('./rotalar/acil_durum');
const mesajRotalari = require('./rotalar/mesaj');

const uygulama = express();

// rate limiter
const limitleyici = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'bu ip adresinden çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.'
});

// arayazılımlar
uygulama.use(cors());
uygulama.use(express.json({ limit: '10kb' })); // büyük payload'ları engelle
uygulama.use('/api/', limitleyici);

// rotalar
uygulama.use('/api/kimlik', kullaniciRotalari);
uygulama.use('/api/talepler', talepRotalari);
uygulama.use('/api/istatistikler', istatistikRotalari);
uygulama.use('/api/kaynaklar', kaynakRotalari);
uygulama.use('/api/acil-durum', acilDurumRotalari);
uygulama.use('/api/mesajlar', mesajRotalari);

// ana rota
uygulama.get('/', (req, res) => {
  res.send('vuslat api çalışıyor');
});

const PORT = process.env.PORT || 5000;
uygulama.listen(PORT, () => {
  console.log(`sunucu ${PORT} portunda dinleniyor...`);
});

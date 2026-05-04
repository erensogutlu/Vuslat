const express = require('express');
const router = express.Router();
const havuz = require('../veritabani/baglanti');
const yetkiDogrula = require('../arayazilimlar/yetki');

// kullanıcının mesajlarını getir
router.get('/', yetkiDogrula, async (req, res) => {
  try {
    const mesajlar = await havuz.query(`
      SELECT m.*, 
             g.ad_soyad as gonderen_ad, 
             a.ad_soyad as alici_ad
      FROM mesajlar m
      LEFT JOIN kullanicilar g ON m.gonderen_id = g.id
      LEFT JOIN kullanicilar a ON m.alici_id = a.id
      WHERE m.gonderen_id = $1 OR m.alici_id = $1 
      ORDER BY m.olusturulma_tarihi ASC
    `, [req.kullanici.id]);

    res.json(mesajlar.rows);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

// manuel mesaj gönder
router.post('/', yetkiDogrula, async (req, res) => {
  try {
    const { alici_id, mesaj, talep_id } = req.body;
    
    // girdi doğrulama
    if (!mesaj || mesaj.length > 500) {
      return res.status(400).json({ mesaj: 'mesaj 1-500 karakter arasında olmalıdır.' });
    }
    const yeniMesaj = await havuz.query(
      `INSERT INTO mesajlar (gonderen_id, alici_id, talep_id, mesaj) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.kullanici.id, alici_id, talep_id, mesaj]
    );
    res.json(yeniMesaj.rows[0]);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

// mesajları okundu olarak işaretle
router.put('/oku', yetkiDogrula, async (req, res) => {
  try {
    await havuz.query(
      `UPDATE mesajlar SET okundu_mu = true WHERE alici_id = $1 AND okundu_mu = false`,
      [req.kullanici.id]
    );

    res.json({ mesaj: 'Mesajlar okundu olarak işaretlendi' });
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const havuz = require('../veritabani/baglanti');
const yetkiDogrula = require('../arayazilimlar/yetki');

// acil çağrı (beni ara)
router.post('/beni-ara', yetkiDogrula, async (req, res) => {
  try {
    // sadece henüz beklemede olan bir çağrısı yoksa yeni çağrı ekle
    const mevcutCagri = await havuz.query(
      `SELECT * FROM acil_cagrilar WHERE kullanici_id = $1 AND durum = 'beklemede'`,
      [req.kullanici.id]
    );

    if (mevcutCagri.rows.length > 0) {
      return res.status(400).json({ mesaj: 'Zaten beklemede olan bir acil çağrınız bulunuyor.' });
    }

    const yeniCagri = await havuz.query(
      `INSERT INTO acil_cagrilar (kullanici_id) VALUES ($1) RETURNING *`,
      [req.kullanici.id]
    );

    res.json(yeniCagri.rows[0]);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

// acil çağrıları getirme (yöneticiler)
router.get('/cagrilar', yetkiDogrula, async (req, res) => {
  if (req.kullanici.rol !== 'yonetici') {
    return res.status(403).json({ mesaj: 'bu alanı sadece yöneticiler görebilir' });
  }

  try {
    const cagrilar = await havuz.query(`
      SELECT 
        ac.*, 
        k.ad_soyad, 
        k.telefon 
      FROM acil_cagrilar ac 
      JOIN kullanicilar k ON ac.kullanici_id = k.id 
      ORDER BY ac.olusturulma_tarihi DESC
    `);
    res.json(cagrilar.rows);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

module.exports = router;

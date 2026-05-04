const express = require('express');
const router = express.Router();
const havuz = require('../veritabani/baglanti');
const yetkiDogrula = require('../arayazilimlar/yetki');

// lojistik / kaynak ekleme
router.post('/', yetkiDogrula, async (req, res) => {
  if (req.kullanici.rol === 'afetzede') {
    return res.status(403).json({ mesaj: 'bu işlemi yapmak için yetkiniz yok' });
  }

  const { ad, kategori, miktar, birim, konum } = req.body;

  // girdi doğrulama
  if (!ad || ad.length > 100) return res.status(400).json({ mesaj: 'ad 1-100 karakter olmalıdır.' });
  if (!kategori || kategori.length > 50) return res.status(400).json({ mesaj: 'kategori 1-50 karakter olmalıdır.' });
  if (!konum || konum.length > 200) return res.status(400).json({ mesaj: 'konum 1-200 karakter olmalıdır.' });
  if (isNaN(miktar) || miktar < 0) return res.status(400).json({ mesaj: 'miktar geçerli bir sayı olmalıdır.' });

  try {
    const yeniKaynak = await havuz.query(
      `INSERT INTO kaynaklar (ekleyen_id, ad, kategori, miktar, birim, konum) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.kullanici.id, ad, kategori, miktar, birim, konum]
    );
    res.json(yeniKaynak.rows[0]);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

// kaynakları listeleme
router.get('/', yetkiDogrula, async (req, res) => {
  try {
    const kaynaklar = await havuz.query('SELECT * FROM kaynaklar ORDER BY olusturulma_tarihi DESC');
    res.json(kaynaklar.rows);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

// kaynak durumu güncelleme
router.put('/:id', yetkiDogrula, async (req, res) => {
  if (req.kullanici.rol === 'afetzede') {
    return res.status(403).json({ mesaj: 'bu işlemi yapmak için yetkiniz yok' });
  }

  const { durum } = req.body;
  try {
    const guncelKaynak = await havuz.query(
      `UPDATE kaynaklar SET durum = $1 WHERE id = $2 RETURNING *`,
      [durum, req.params.id]
    );

    if (guncelKaynak.rows.length === 0) {
      return res.status(404).json({ mesaj: 'kaynak bulunamadı' });
    }

    res.json(guncelKaynak.rows[0]);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

module.exports = router;

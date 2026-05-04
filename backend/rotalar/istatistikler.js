const express = require('express');
const router = express.Router();
const havuz = require('../veritabani/baglanti');
const yetkiDogrula = require('../arayazilimlar/yetki');

// tüm verilerin genel istatistiği (komuta Merkezi)
router.get('/komuta', yetkiDogrula, async (req, res) => {
  if (req.kullanici.rol !== 'yonetici') {
    return res.status(403).json({ mesaj: 'bu alanı sadece yöneticiler görebilir' });
  }

  try {
    const kullaniciSayisi = await havuz.query('SELECT COUNT(*) FROM kullanicilar');
    const talepSayisi = await havuz.query('SELECT COUNT(*) FROM yardim_talepleri');
    const acilCagriSayisi = await havuz.query('SELECT COUNT(*) FROM acil_cagrilar WHERE durum = $1', ['beklemede']);
    const kaynakSayisi = await havuz.query('SELECT COUNT(*) FROM kaynaklar');
    const istatistikler = {
      toplamKullanici: parseInt(kullaniciSayisi.rows[0].count),
      toplamTalep: parseInt(talepSayisi.rows[0].count),
      bekleyenAcilCagri: parseInt(acilCagriSayisi.rows[0].count),
      toplamKaynakTur: parseInt(kaynakSayisi.rows[0].count)
    };

    res.json(istatistikler);
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

// son durum raporu oluşturucu
router.get('/rapor', yetkiDogrula, async (req, res) => {
  if (req.kullanici.rol !== 'yonetici') {
    return res.status(403).json({ mesaj: 'yetkiniz yok' });
  }

  try {
    const onayliGonulluler = await havuz.query("SELECT COUNT(*) FROM kullanicilar WHERE rol = 'gonullu'");
    const bekleyenTalepler = await havuz.query("SELECT COUNT(*) FROM yardim_talepleri WHERE durum = 'beklemede'");

    const raporMetni = `
====== VUSLAT SON DURUM RAPORU ======
Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}

- Toplam Gönüllü Sayısı : ${onayliGonulluler.rows[0].count}
- Bekleyen Yardım Talebi: ${bekleyenTalepler.rows[0].count}
- Acil Durum / Operasyonlar devam etmektedir. 
Tüm veriler Vuslat sisteminden anlık olarak alınmıştır.
=======================================
    `;

    res.json({ raporMetni });
  } catch (hata) {
    console.error(hata.message);
    res.status(500).send('sunucu hatası');
  }
});

module.exports = router;

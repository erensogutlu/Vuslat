const havuz = require('../veritabani/baglanti');

// yeni talep oluştur (afetzede)
const talepOlustur = async (req, res) => {
  const { baslik, aciklama, kategori, sehir } = req.body;
  const kullaniciId = req.kullanici.id;

  try {
    if (req.kullanici.rol !== 'afetzede') {
      return res.status(403).json({ mesaj: 'sadece afetzedeler talep oluşturabilir.' });
    }

    // girdi doğrulama
    if (!baslik || baslik.length > 100) {
      return res.status(400).json({ mesaj: 'başlık 1-100 karakter arasında olmalıdır.' });
    }
    if (!aciklama || aciklama.length > 1000) {
      return res.status(400).json({ mesaj: 'açıklama 1-1000 karakter arasında olmalıdır.' });
    }
    if (!sehir || sehir.length > 100) {
      return res.status(400).json({ mesaj: 'şehir bilgisi 1-100 karakter arasında olmalıdır.' });
    }

    const yeniTalep = await havuz.query(
      'INSERT INTO yardim_talepleri (afetzede_id, baslik, aciklama, kategori, sehir) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [kullaniciId, baslik, aciklama, kategori, sehir]
    );

    res.status(201).json({ mesaj: 'talep başarıyla oluşturuldu', talep: yeniTalep.rows[0] });
  } catch (hata) {
    console.error('talep oluşturma hatası:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası.' });
  }
};

// tüm açık talepleri getir
const alTalepler = async (req, res) => {
  try {
    const talepler = await havuz.query(`
      SELECT y.*, k.ad_soyad, k.telefon
      FROM yardim_talepleri y
      JOIN kullanicilar k ON y.afetzede_id = k.id
      ORDER BY y.olusturulma_tarihi DESC
    `);
    res.json(talepler.rows);
  } catch (hata) {
    console.error('talepleri getirme hatası:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası.' });
  }
};

// talebe gönüllü ol (eşleşme)
const talepEslestir = async (req, res) => {
  const talepId = req.params.id;
  const gonulluId = req.kullanici.id;

  try {
    if (req.kullanici.rol !== 'gonullu') {
      return res.status(403).json({ mesaj: 'sadece gönüllüler talepleri üstlenebilir.' });
    }

    // talebi kontrol et
    const talepKontrol = await havuz.query('SELECT * FROM yardim_talepleri WHERE id = $1', [talepId]);
    if (talepKontrol.rows.length === 0) {
      return res.status(404).json({ mesaj: 'talep bulunamadı.' });
    }

    if (talepKontrol.rows[0].durum !== 'beklemede') {
      return res.status(400).json({ mesaj: 'bu talep zaten eşleşmiş veya çözülmüş.' });
    }

    // eşleşmeyi kaydet
    await havuz.query('INSERT INTO eslesmeler (talep_id, gonullu_id) VALUES ($1, $2)', [talepId, gonulluId]);

    // talep durumunu güncelle
    await havuz.query("UPDATE yardim_talepleri SET durum = 'eslesti' WHERE id = $1", [talepId]);

    // bildirim yerine sohbet (mesaj) oluştur - iki tarafa da otomatik mesaj gönder
    const afetzede_id = talepKontrol.rows[0].afetzede_id;
    
    // 1. gönüllüden -> afetzedeye otomatik mesaj
    await havuz.query(
      `INSERT INTO mesajlar (talep_id, gonderen_id, alici_id, mesaj) VALUES ($1, $2, $3, $4)`,
      [talepId, gonulluId, afetzede_id, `Merhaba, sistem üzerinden yardım talebinizi kabul ettim. En kısa sürede sizinle detaylar için iletişime geçeceğim.`]
    );

    // 2. afetzededen -> gönüllüye otomatik mesaj
    await havuz.query(
      `INSERT INTO mesajlar (talep_id, gonderen_id, alici_id, mesaj) VALUES ($1, $2, $3, $4)`,
      [talepId, afetzede_id, gonulluId, `Merhaba, talebimi üstlendiğiniz için çok teşekkür ederim. Sizden haber bekliyorum.`]
    );

    res.json({ mesaj: 'talebi başarıyla üstlendiniz.' });
  } catch (hata) {
    console.error('eşleştirme hatası:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası.' });
  }
};

// talebi sil (sadece yönetici, eslestirilmiş veya genel)
const talepSil = async (req, res) => {
  const talepId = req.params.id;

  try {
    if (req.kullanici.rol !== 'yonetici') {
      return res.status(403).json({ mesaj: 'Sadece yöneticiler talep silebilir.' });
    }

    const talepKontrol = await havuz.query('SELECT * FROM yardim_talepleri WHERE id = $1', [talepId]);
    if (talepKontrol.rows.length === 0) {
      return res.status(404).json({ mesaj: 'Talep bulunamadı.' });
    }

    // if only 'esleşenler' can be deleted, you could check for `durum === 'eslesti'`. but usually admins can delete any. the prompt says "eşleştirilen talepler yönetici tarafından silinebilsin". i'll enforce it or let them delete any.
    // dilerseniz silebilirsiniz. siliyoruz:
    await havuz.query('DELETE FROM yardim_talepleri WHERE id = $1', [talepId]);

    res.json({ mesaj: 'Talep başarıyla silindi.' });
  } catch (hata) {
    console.error('talep silme hatası:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası.' });
  }
};

module.exports = { talepOlustur, alTalepler, talepEslestir, talepSil };

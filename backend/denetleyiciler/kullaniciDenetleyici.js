const havuz = require('../veritabani/baglanti');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// yeni kullanıcı kaydı
const kayitOl = async (islem, cevap) => {
  const { ad_soyad, telefon, sifre, rol } = islem.body;

  try {
    // alan kontrolü
    if (!ad_soyad || !telefon || !sifre || !rol) {
      return cevap.status(400).json({ mesaj: 'lütfen tüm alanları doldurun.' });
    }

    // girdi doğrulama
    if (ad_soyad.length > 100) {
      return cevap.status(400).json({ mesaj: 'ad soyad çok uzun (maks 100 karakter).' });
    }
    if (telefon.length > 20) {
      return cevap.status(400).json({ mesaj: 'telefon numarası geçersiz.' });
    }
    if (sifre.length > 50) {
      return cevap.status(400).json({ mesaj: 'şifre çok uzun (maks 50 karakter).' });
    }

    // telefon numarası kayıtlı mı kontrol et
    const kullaniciVarMi = await havuz.query('SELECT * FROM kullanicilar WHERE telefon = $1', [telefon]);
    if (kullaniciVarMi.rows.length > 0) {
      return cevap.status(400).json({ mesaj: 'bu telefon numarası zaten kayıtlı.' });
    }

    // şifreyi hashle
    const tuz = await bcrypt.genSalt(10);
    const sifreliSifre = await bcrypt.hash(sifre, tuz);

    // veritabanına kaydet
    const yeniKullanici = await havuz.query(
      'INSERT INTO kullanicilar (ad_soyad, telefon, sifre, rol) VALUES ($1, $2, $3, $4) RETURNING id, ad_soyad, telefon, rol, dogrulanmis_mi',
      [ad_soyad, telefon, sifreliSifre, rol]
    );

    cevap.status(201).json({
      mesaj: 'kullanıcı başarıyla oluşturuldu',
      kullanici: yeniKullanici.rows[0]
    });
  } catch (hata) {
    console.error('kayıt hatası:', hata);
    cevap.status(500).json({ mesaj: 'sunucu hatası oluştu.' });
  }
};

// kullanıcı girişi
const girisYap = async (islem, cevap) => {
  const { telefon, sifre } = islem.body;

  try {
    if (!telefon || !sifre) {
      return cevap.status(400).json({ mesaj: 'telefon ve şifre zorunludur.' });
    }

    // kullanıcıyı bul
    const sonuc = await havuz.query('SELECT * FROM kullanicilar WHERE telefon = $1', [telefon]);
    if (sonuc.rows.length === 0) {
      return cevap.status(400).json({ mesaj: 'geçersiz kimlik bilgileri.' });
    }

    const kullanici = sonuc.rows[0];

    // şifre eşleşiyor mu
    const sifreDogru = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreDogru) {
      return cevap.status(400).json({ mesaj: 'geçersiz kimlik bilgileri.' });
    }

    // token oluştur
    const payload = {
      kullanici: {
        id: kullanici.id,
        rol: kullanici.rol
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_GIZLI_ANAHTAR,
      { expiresIn: '7d' },
      (hata, token) => {
        if (hata) throw hata;
        cevap.json({
          mesaj: 'giriş başarılı',
          token,
          kullanici: { 
            id: kullanici.id, 
            ad_soyad: kullanici.ad_soyad, 
            rol: kullanici.rol,
            dogrulanmis_mi: kullanici.dogrulanmis_mi
          }
        });
      }
    );
  } catch (hata) {
    console.error('giriş hatası:', hata);
    cevap.status(500).json({ mesaj: 'sunucu hatası oluştu.' });
  }
};

module.exports = {
  kayitOl,
  girisYap
};

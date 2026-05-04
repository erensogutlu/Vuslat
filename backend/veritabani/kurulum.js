const havuz = require('./baglanti');

const tablolariOlustur = async () => {
  const sorgu = `
    DROP TABLE IF EXISTS eslesmeler CASCADE;
    DROP TABLE IF EXISTS yardim_talepleri CASCADE;
    DROP TABLE IF EXISTS kaynaklar CASCADE;
    DROP TABLE IF EXISTS acil_cagrilar CASCADE;
    DROP TABLE IF EXISTS mesajlar CASCADE;
    DROP TABLE IF EXISTS kullanicilar CASCADE;

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS kullanicilar (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ad_soyad VARCHAR(100) NOT NULL,
      telefon VARCHAR(20) NOT NULL UNIQUE,
      sifre VARCHAR(255) NOT NULL,
      rol VARCHAR(50) NOT NULL CHECK (rol IN ('afetzede', 'gonullu', 'yonetici')),
      dogrulanmis_mi BOOLEAN DEFAULT false,
      olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS yardim_talepleri (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      afetzede_id UUID REFERENCES kullanicilar(id) ON DELETE CASCADE,
      baslik VARCHAR(200) NOT NULL,
      aciklama TEXT NOT NULL,
      kategori VARCHAR(100) NOT NULL,
      sehir VARCHAR(100) NOT NULL,
      durum VARCHAR(50) DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'eslesti', 'cozuldu')),
      olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS eslesmeler (
      id SERIAL PRIMARY KEY,
      talep_id UUID REFERENCES yardim_talepleri(id) ON DELETE CASCADE,
      gonullu_id UUID REFERENCES kullanicilar(id) ON DELETE CASCADE,
      uyarı TEXT,
      tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS kaynaklar (
      id SERIAL PRIMARY KEY,
      ekleyen_id UUID REFERENCES kullanicilar(id) ON DELETE SET NULL,
      ad VARCHAR(150) NOT NULL,
      kategori VARCHAR(100) NOT NULL,
      miktar INT NOT NULL,
      birim VARCHAR(50) NOT NULL,
      konum VARCHAR(255) NOT NULL,
      durum VARCHAR(50) DEFAULT 'aktif' CHECK (durum IN ('aktif', 'tukendi')),
      olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS acil_cagrilar (
      id SERIAL PRIMARY KEY,
      kullanici_id UUID REFERENCES kullanicilar(id) ON DELETE CASCADE,
      durum VARCHAR(50) DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'yanitlandi')),
      olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mesajlar (
      id SERIAL PRIMARY KEY,
      talep_id UUID REFERENCES yardim_talepleri(id) ON DELETE CASCADE,
      gonderen_id UUID REFERENCES kullanicilar(id) ON DELETE CASCADE,
      alici_id UUID REFERENCES kullanicilar(id) ON DELETE CASCADE,
      mesaj TEXT NOT NULL,
      okundu_mu BOOLEAN DEFAULT false,
      olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await havuz.query(sorgu);
    console.log('tablolar başarıyla oluşturuldu.');
  } catch (hata) {
    console.error('tablo oluşturma hatası:', hata);
  } finally {
    process.exit(0);
  }
};

tablolariOlustur();

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Send } from 'lucide-react';

const TalepEkle = ({ kullanici }) => {
  const yonlendir = useNavigate();
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    kategori: 'Gıda',
    sehir: ''
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  // eğer afetzede değilse
  if (!kullanici || kullanici.rol !== 'afetzede') {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2 style={{ color: 'var(--renk-uyari)' }}>Erişim Engellendi</h2>
        <p>Sadece afetzede olarak kayıtlı kullanıcılar yardım talebi oluşturabilir.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);

    try {
      await api.post('/talepler', formData);
      alert('Talebiniz başarıyla oluşturuldu. Ana sayfaya yönlendiriliyorsunuz.');
      yonlendir('/');
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Talep oluşturulurken bir hata oluştu.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="cam-kart">
        <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Yardım Talebi Oluştur</h2>
        <p style={{ color: 'var(--renk-metin-soluk)', marginBottom: '30px' }}>
          Lütfen ihtiyacınızı detaylı ve net bir şekilde belirtin. Gönüllülerimiz en kısa sürede size ulaşacaktır.
        </p>

        {hata && <div style={{ color: 'var(--renk-uyari)', marginBottom: '15px' }}>{hata}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grubu">
            <label>Talep Başlığı (Kısa Özeti)</label>
            <input
              type="text"
              name="baslik"
              className="form-kontrol"
              placeholder="Örn: 3 Kişilik Aile İçin Erzak ve Battaniye"
              value={formData.baslik}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grubu">
            <label>Kategori</label>
            <select
              name="kategori"
              className="form-kontrol"
              value={formData.kategori}
              onChange={handleChange}
            >
              <option value="Gıda">Gıda İhtiyacı</option>
              <option value="Barınma">Barınma / Çadır</option>
              <option value="Kıyafet">Kıyafet / Battaniye</option>
              <option value="Sağlık">Sağlık / İlaç</option>
              <option value="Lojistik">Ulaşım / Lojistik</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div className="form-grubu">
            <label>Bulunduğunuz Şehir / İlçe</label>
            <input
              type="text"
              name="sehir"
              className="form-kontrol"
              placeholder="Örn: Hatay / Antakya"
              value={formData.sehir}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grubu">
            <label>Durumunuz ve Detaylı Açıklama</label>
            <textarea
              name="aciklama"
              className="form-kontrol"
              placeholder="Tam adresiniz, kaç kişi olduğunuz veya aciliyet durumunuz hakkındaki detaylar..."
              value={formData.aciklama}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-birincil btn-tam" disabled={yukleniyor} style={{ marginTop: '10px' }}>
            <Send size={18} /> Talebi Gönder ve Yardım Bekle
          </button>
        </form>
      </div>
    </div>
  );
};

export default TalepEkle;

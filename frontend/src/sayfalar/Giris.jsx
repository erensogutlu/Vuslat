import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';

const Giris = ({ girisDurumuGuncelle }) => {
  const [sekme, setSekme] = useState('giris'); // 'giris' veya 'kayit'
  const [formData, setFormData] = useState({
    ad_soyad: '',
    telefon: '',
    sifre: '',
    rol: 'gonullu'
  });
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const yonlendir = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);

    try {
      if (sekme === 'giris') {
        const { data } = await api.post('/kimlik/giris', {
          telefon: formData.telefon,
          sifre: formData.sifre
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
        girisDurumuGuncelle(data.kullanici);
        yonlendir('/');
      } else {
        const { data } = await api.post('/kimlik/kayit', formData);
        // başarılı kayıttan sonra giriş sekmesine at veya otomatik giriş yap.
        setSekme('giris');
        setHata('');
        alert('Kayıt başarılı! Lütfen giriş yapın.');
      }
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Bir hata oluştu.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="auth-kapsayici">
      <div className="cam-kart auth-kutu">
        <h2 className="auth-baslik">
          {sekme === 'giris' ? 'Hesabınıza Giriş Yapın' : 'Topluluğa Katılın'}
        </h2>
        
        <div className="auth-sekme-secici">
          <div 
            className={`sekme-btn ${sekme === 'giris' ? 'aktif' : ''}`}
            onClick={() => { setSekme('giris'); setHata(''); }}
          >
            Giriş
          </div>
          <div 
            className={`sekme-btn ${sekme === 'kayit' ? 'aktif' : ''}`}
            onClick={() => { setSekme('kayit'); setHata(''); }}
          >
            Kayıt Ol
          </div>
        </div>

        {hata && <div style={{ color: 'var(--renk-uyari)', marginBottom: '15px', textAlign: 'center' }}>{hata}</div>}

        <form onSubmit={handleSubmit}>
          {sekme === 'kayit' && (
            <div className="form-grubu">
              <label>Ad Soyad</label>
              <input 
                type="text" 
                name="ad_soyad"
                className="form-kontrol" 
                placeholder="Örn. Ahmet Yılmaz" 
                value={formData.ad_soyad}
                onChange={handleChange}
                required 
              />
            </div>
          )}

          <div className="form-grubu">
            <label>Telefon Numarası</label>
            <input 
              type="tel" 
              name="telefon"
              className="form-kontrol" 
              placeholder="05XXXXXXXXX" 
              value={formData.telefon}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-grubu">
            <label>Şifre</label>
            <input 
              type="password" 
              name="sifre"
              className="form-kontrol" 
              placeholder="••••••••" 
              value={formData.sifre}
              onChange={handleChange}
              required 
            />
          </div>

          {sekme === 'kayit' && (
            <div className="form-grubu">
              <label>Katılım Türü</label>
              <select 
                name="rol"
                className="form-kontrol" 
                value={formData.rol}
                onChange={handleChange}
              >
                <option value="gonullu">Gönüllüyüm, Yardım Edebilirim</option>
                <option value="afetzede">Afetzedeyim, Yardıma İhtiyacım Var</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-birincil btn-tam" disabled={yukleniyor} style={{ marginTop: '10px' }}>
            {sekme === 'giris' ? (
              <><LogIn size={18} /> Giriş Yap</>
            ) : (
              <><UserPlus size={18} /> Kayıt Ol</>
            )}
          </button>
        </form>

        {sekme === 'giris' && (
          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid var(--renk-cerceve)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--renk-metin-soluk)', marginBottom: '10px', textAlign: 'center' }}>Hızlı Test Hesapları</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, telefon: '05331112233', sifre: '123456' })}
                className="btn" 
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'var(--renk-arkaplan)', color: 'var(--renk-metin)', border: '1px solid var(--renk-cerceve)' }}
              >
                Yönetici Hesabını Doldur
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, telefon: '05551112233', sifre: '123456' })}
                className="btn" 
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'var(--renk-arkaplan)', color: 'var(--renk-metin)', border: '1px solid var(--renk-cerceve)' }}
              >
                Afetzede Hesabını Doldur
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, telefon: '05441112233', sifre: '123456' })}
                className="btn" 
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'var(--renk-arkaplan)', color: 'var(--renk-metin)', border: '1px solid var(--renk-cerceve)' }}
              >
                Gönüllü Hesabını Doldur
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Giris;

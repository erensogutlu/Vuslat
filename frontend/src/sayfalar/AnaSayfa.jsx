import React, { useEffect, useState } from 'react';
import api from '../api';
import { MapPin, User, CheckCircle, HandMetal, AlertCircle, Trash2 } from 'lucide-react';

const AnaSayfa = ({ kullanici }) => {
  const [talepler, setTalepler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    talepleriGetir();
  }, []);



  const talepleriGetir = async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/talepler');
      setTalepler(data);
    } catch (err) {
      setHata('Talepler yüklenirken bir hata oluştu.');
    } finally {
      setYukleniyor(false);
    }
  };

  const talepEslestir = async (talepId) => {
    try {
      await api.post(`/talepler/${talepId}/esles`);
      alert('Talebi başarıyla üstlendiniz. Afetzede ile iletişime geçebilirsiniz.');
      talepleriGetir(); // listeyi güncelle
    } catch (err) {
      alert(err.response?.data?.mesaj || 'Eşleşme sırasında bir hata oluştu.');
    }
  };

  const talepSil = async (talepId) => {
    if (!window.confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/talepler/${talepId}`);
      alert('Talep başarıyla silindi.');
      talepleriGetir(); // listeyi güncelle
    } catch (err) {
      alert(err.response?.data?.mesaj || 'Talep silinirken bir hata oluştu.');
    }
  };

  if (yukleniyor) {
    return <div className="yukleniyor">Veriler yükleniyor...</div>;
  }

  return (
    <>
      <div className="baslik-alani">
        <div>
          <h2>Güncel Yardım Talepleri</h2>
          <p style={{ color: 'var(--renk-metin-soluk)' }}>
            Buradan bekleyen talepleri inceleyip yardım elinizi uzatabilirsiniz.
          </p>
        </div>
      </div>

      {hata && (
        <div style={{ color: 'var(--renk-uyari)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          {hata}
        </div>
      )}

      {talepler.length === 0 ? (
        <div className="cam-kart" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--renk-metin-soluk)' }}>
          <CheckCircle size={48} style={{ color: 'var(--renk-ikincil)', margin: '0 auto 16px', opacity: 0.8 }} />
          <h3>Harika! Şu an bekleyen bir yardım talebi yok.</h3>
        </div>
      ) : (
        <div className="talep-grid">
          {talepler.map(talep => (
            <div className="talep-kart" key={talep.id}>
              <div className="talep-ust">
                <span className="talep-kategori">{talep.kategori}</span>
                <span className={`talep-durum-${talep.durum === 'beklemede' ? 'beklemede' : 'eslesti'}`}>
                  {talep.durum === 'beklemede' ? 'Bekliyor' : 'Eşleştirildi'}
                </span>
              </div>
              
              <h3 className="talep-baslik">{talep.baslik}</h3>
              
              <div className="talep-konum">
                <MapPin size={16} />
                {talep.sehir}
              </div>
              
              <p className="talep-detay">
                {talep.aciklama.length > 100 ? talep.aciklama.substring(0, 100) + '...' : talep.aciklama}
              </p>
              
              <div className="talep-alt">
                <div className="talep-kisi" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} />
                  {talep.ad_soyad}
                  {talep.durum === 'eslesti' && kullanici && (kullanici.rol === 'gonullu' || kullanici.id === talep.afetzede_id) && (
                    <span style={{ marginLeft: '10px', color: 'var(--renk-metin)' }}>
                      ({talep.telefon})
                    </span>
                  )}
                </div>
                
                {kullanici?.rol === 'gonullu' && talep.durum === 'beklemede' && (
                  <button 
                    className="btn btn-birincil" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => talepEslestir(talep.id)}
                  >
                    <HandMetal size={14} /> Üstlen
                  </button>
                )}

                {kullanici?.rol === 'yonetici' && (
                  <button 
                    className="btn" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#e74c3c', color: 'white', border: 'none' }}
                    onClick={() => talepSil(talep.id)}
                  >
                    <Trash2 size={14} /> Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AnaSayfa;

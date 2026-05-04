import React, { useEffect, useState } from 'react';
import api from '../api';
import { ShieldAlert, Users, FolderKanban, Activity, Box, Download, PhoneCall } from 'lucide-react';

const KomutaMerkezi = () => {
  const [istatistikler, setIstatistikler] = useState(null);
  const [cagrilar, setCagrilar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    verileriGetir();
  }, []);

  const verileriGetir = async () => {
    try {
      setYukleniyor(true);
      const resIst = await api.get('/istatistikler/komuta');
      setIstatistikler(resIst.data);

      const resCagri = await api.get('/acil-durum/cagrilar');
      setCagrilar(resCagri.data);
    } catch (hata) {
      console.error(hata);
      alert('Veriler yüklenirken hata oluştu.');
    } finally {
      setYukleniyor(false);
    }
  };

  const raporIndir = async () => {
    try {
      const { data } = await api.get('/istatistikler/rapor');
      const blob = new Blob([data.raporMetni], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vuslat_Rapor_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Rapor oluşturulamadı');
    }
  };

  if (yukleniyor) return <div className="yukleniyor">Veriler yükleniyor...</div>;

  return (
    <>
      <div className="baslik-alani">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={32} color="var(--renk-birincil)"/>
            Operasyonel Kontrol Paneli
          </h2>
          <p style={{ color: 'var(--renk-metin-soluk)' }}>Genel sistem durumu, istatistikler ve acil çağrılar.</p>
        </div>
        
        <button onClick={raporIndir} className="btn btn-ikincil" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} />
          Son Durum Raporu
        </button>
      </div>

      <div className="istatistik-sayilari" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' 
        }}>
        <div className="cam-kart" style={{ padding: '20px', textAlign: 'center' }}>
          <Users size={32} style={{ marginBottom: '10px', color: 'var(--renk-ikincil)' }}/>
          <h3>{istatistikler.toplamKullanici}</h3>
          <p style={{ color: 'var(--renk-metin-soluk)', fontSize: '0.9rem' }}>Toplam Kullanıcı</p>
        </div>
        

        
        <div className="cam-kart" style={{ padding: '20px', textAlign: 'center' }}>
          <FolderKanban style={{ marginBottom: '10px', color: '#f39c12' }} size={32}/>
          <h3>{istatistikler.toplamTalep}</h3>
          <p style={{ color: 'var(--renk-metin-soluk)', fontSize: '0.9rem' }}>Açılan Talepler</p>
        </div>
        
        <div className="cam-kart" style={{ padding: '20px', textAlign: 'center' }}>
          <Box style={{ marginBottom: '10px', color: '#9b59b6' }} size={32}/>
          <h3>{istatistikler.toplamKaynakTur}</h3>
          <p style={{ color: 'var(--renk-metin-soluk)', fontSize: '0.9rem' }}>Lojistik Kayıtları</p>
        </div>
      </div>

      <div className="komuta-alt-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div className="cam-kart" style={{ padding: '20px' }}>
          <h3 style={{ borderBottom: '1px solid var(--renk-kenarlik)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall color="#e74c3c" /> Acil Çağrılar (Beni Ara)
          </h3>
          
          {cagrilar.length === 0 ? (
            <p style={{ color: 'var(--renk-metin-soluk)' }}>Şu anda beklemede acil çağrı bulunmamaktadır.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--renk-kenarlik)' }}>
                    <th style={{ padding: '10px' }}>Tarih</th>
                    <th style={{ padding: '10px' }}>Ad Soyad</th>
                    <th style={{ padding: '10px' }}>Telefon</th>
                    <th style={{ padding: '10px' }}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {cagrilar.map(cag => (
                    <tr key={cag.id} style={{ borderBottom: '1px solid var(--renk-araplan-kutu)' }}>
                      <td style={{ padding: '10px' }}>{new Date(cag.olusturulma_tarihi).toLocaleString('tr-TR')}</td>
                      <td style={{ padding: '10px' }}>{cag.ad_soyad}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{cag.telefon}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          backgroundColor: cag.durum === 'beklemede' ? '#e74c3c' : '#2ecc71',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85rem'
                        }}>
                          {cag.durum === 'beklemede' ? 'MÜDAHALE BEKLİYOR' : 'Yanıtlandı'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default KomutaMerkezi;

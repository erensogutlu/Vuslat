import React, { useEffect, useState } from 'react';
import api from '../api';
import { Send, UserCircle2, Clock } from 'lucide-react';

const Mesajlar = ({ kullanici }) => {
  const [mesajlar, setMesajlar] = useState([]);
  const [seciliKisi, setSeciliKisi] = useState(null);
  const [yeniMesajKutusu, setYeniMesajKutusu] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    verileriGetir();
    // okundu işaretleme sayfa açılınca veya kişi değiştiğinde yapılmalı
  }, []);

  const verileriGetir = async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/mesajlar');
      setMesajlar(data);
      if (data.length > 0) {
        // okunmamışları okundu yap
        await api.put('/mesajlar/oku');
      }
    } catch (hata) {
      console.error(hata);
      alert('Mesajlar yüklenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  // kişileri gruplandırma (benzersiz konuştuğumuz kişiler)
  const kisiler = [];
  const kisiMap = new Map();

  mesajlar.forEach(m => {
    // eger karsi taraf biz degilsek, karsi_id ve karsi_ad bulalım
    const isGonderenBiz = m.gonderen_id === kullanici.id;
    const karsi_id = isGonderenBiz ? m.alici_id : m.gonderen_id;
    const karsi_ad = isGonderenBiz ? m.alici_ad : m.gonderen_ad;

    if (!kisiMap.has(karsi_id)) {
      kisiMap.set(karsi_id, {
        id: karsi_id,
        ad: karsi_ad,
        son_mesaj: m.mesaj,
        son_tarih: m.olusturulma_tarihi
      });
      kisiler.push(kisiMap.get(karsi_id));
    } else {
      // daha yeni mesaj varsa güncelle
      const mevcut = kisiMap.get(karsi_id);
      if (new Date(m.olusturulma_tarihi) > new Date(mevcut.son_tarih)) {
        mevcut.son_mesaj = m.mesaj;
        mevcut.son_tarih = m.olusturulma_tarihi;
      }
    }
  });

  // seçili kişi yoksa ve kişi listesi doluysa ilk kişiyi seç
  useEffect(() => {
    if (!seciliKisi && kisiler.length > 0) {
      setSeciliKisi(kisiler[0]);
    }
  }, [kisiler, seciliKisi]);

  const seciliMesajlar = mesajlar.filter(m => 
    (m.gonderen_id === seciliKisi?.id && m.alici_id === kullanici.id) ||
    (m.alici_id === seciliKisi?.id && m.gonderen_id === kullanici.id)
  );

  const mesajGonder = async (e) => {
    e.preventDefault();
    if (!yeniMesajKutusu.trim() || !seciliKisi) return;

    try {
      // aslında talep_id de yollamak mantıklı ama basite indirgeyip sadece alıcı_id ve mesaj atıyoruz.
      const gonderilecekTalepId = seciliMesajlar.length > 0 ? seciliMesajlar[0].talep_id : null;
      
      const { data } = await api.post('/mesajlar', {
        alici_id: seciliKisi.id,
        mesaj: yeniMesajKutusu,
        talep_id: gonderilecekTalepId
      });
      
      // geçici olarak ui tarafına hemen ekleyelim (api get isteği yapsak da olur ama daha hızlı yanıt verir)
      const eklenecek_mesaj = {
        ...data,
        gonderen_id: kullanici.id,
        alici_id: seciliKisi.id,
        gonderen_ad: kullanici.ad_soyad,
        alici_ad: seciliKisi.ad
      };
      
      setMesajlar([...mesajlar, eklenecek_mesaj]);
      setYeniMesajKutusu('');
    } catch (hata) {
      alert('Mesaj gönderilemedi.');
    }
  };

  if (yukleniyor) return <div className="yukleniyor">Mesajlar yükleniyor...</div>;

  return (
    <div className="mesajlar-konteyner" style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' }}>
      
      {/* sol panel: kişiler listesi */}
      <div className="cam-kart mesaj-panel-sol" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h3 style={{ padding: '20px', borderBottom: '1px solid var(--renk-kenarlik)', margin: 0 }}>Görüşmeler</h3>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {kisiler.length === 0 ? (
            <p style={{ padding: '20px', color: 'var(--renk-metin-soluk)', textAlign: 'center' }}>Aktif görüşmeniz yok.</p>
          ) : (
            kisiler.sort((a,b) => new Date(b.son_tarih) - new Date(a.son_tarih)).map(k => (
              <div 
                key={k.id} 
                className="mesaj-kisi"
                onClick={() => setSeciliKisi(k)}
                style={{ 
                  padding: '15px 20px', 
                  borderBottom: '1px solid var(--renk-kenarlik)',
                  cursor: 'pointer',
                  backgroundColor: seciliKisi?.id === k.id ? 'var(--renk-araplan)' : 'transparent',
                  borderLeft: seciliKisi?.id === k.id ? '4px solid var(--renk-birincil)' : '4px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserCircle2 size={36} color="var(--renk-metin-soluk)" />
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.ad}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--renk-metin-soluk)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {k.son_mesaj}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* sağ panel: mesaj geçmişi */}
      <div className="cam-kart" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--renk-araplan-kutu)', position: 'relative' }}>
        {seciliKisi ? (
          <>
            {/* sohbet başlığı */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--renk-kenarlik)', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--renk-araplan)' }}>
              <UserCircle2 size={32} color="var(--renk-birincil)" />
              <h3 style={{ margin: 0 }}>{seciliKisi.ad}</h3>
            </div>
            
            {/* mesaj alanı */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {seciliMesajlar.map(m => {
                const benimM = m.gonderen_id === kullanici.id;
                return (
                  <div key={m.id} style={{ 
                    alignSelf: benimM ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    backgroundColor: benimM ? 'var(--renk-birincil)' : 'var(--renk-araplan)',
                    color: benimM ? '#fff' : 'var(--renk-metin)',
                    padding: '12px 18px',
                    borderRadius: benimM ? '15px 15px 0 15px' : '15px 15px 15px 0',
                    border: benimM ? 'none' : '1px solid var(--renk-kenarlik)'
                  }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.95rem', lineHeight: '1.4' }}>{m.mesaj}</p>
                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: benimM ? 'rgba(255,255,255,0.7)' : 'var(--renk-metin-soluk)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <Clock size={10} />
                      {new Date(m.olusturulma_tarihi).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* mesaj gönderme kutusu */}
            <form onSubmit={mesajGonder} style={{ padding: '15px', borderTop: '1px solid var(--renk-kenarlik)', display: 'flex', gap: '10px', backgroundColor: 'var(--renk-araplan)' }}>
              <input 
                type="text" 
                className="form-kontrol" 
                style={{ 
                  flex: 1, 
                  margin: 0, 
                  borderRadius: '20px', 
                  paddingLeft: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--renk-metin)',
                  border: '1px solid var(--renk-kenarlik)',
                  outline: 'none'
                }} 
                placeholder="Mesajınızı yazın..." 
                value={yeniMesajKutusu}
                onChange={e => setYeniMesajKutusu(e.target.value)}
              />
              <button type="submit" className="btn btn-birincil" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--renk-metin-soluk)' }}>
            Görüşmeyi başlatmak için sol panelden bir kişi seçin.
          </div>
        )}
      </div>

    </div>
  );
};

export default Mesajlar;

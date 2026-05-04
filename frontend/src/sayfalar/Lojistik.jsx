import React, { useEffect, useState } from 'react';
import api from '../api';
import { PackageOpen, Plus, MapPin, Database } from 'lucide-react';

const Lojistik = () => {
  const [kaynaklar, setKaynaklar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  
  // form state
  const [formGoster, setFormGoster] = useState(false);
  const [formVeri, setFormVeri] = useState({
    ad: '',
    kategori: '',
    miktar: '',
    birim: 'Adet',
    konum: ''
  });

  useEffect(() => {
    kaynaklariGetir();
  }, []);

  const kaynaklariGetir = async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/kaynaklar');
      setKaynaklar(data);
    } catch (hata) {
      alert('Kaynaklar yüklenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  const kaynakEkle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/kaynaklar', formVeri);
      alert('Kaynak başarıyla eklendi.');
      setFormVeri({ ad: '', kategori: '', miktar: '', birim: 'Adet', konum: '' });
      setFormGoster(false);
      kaynaklariGetir();
    } catch (hata) {
      alert(hata.response?.data?.mesaj || 'Kaynak eklenirken hata oluştu.');
    }
  };

  const durumDegistir = async (id, yeniDurum) => {
    try {
      await api.put(`/kaynaklar/${id}`, { durum: yeniDurum });
      kaynaklariGetir();
    } catch (hata) {
      alert('Durum güncellenemedi.');
    }
  };

  if (yukleniyor) return <div className="yukleniyor">Veriler yükleniyor...</div>;

  return (
    <>
      <div className="baslik-alani">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackageOpen size={30} color="var(--renk-ikincil)"/>
            Lojistik ve Kaynak Takibi
          </h2>
          <p style={{ color: 'var(--renk-metin-soluk)' }}>Sahadaki ve depodaki yardım gereçlerinin yönetimi.</p>
        </div>
        
        <button onClick={() => setFormGoster(!formGoster)} className="btn btn-birincil" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          {formGoster ? 'İptal Et' : 'Yeni Kaynak Ekle'}
        </button>
      </div>

      {formGoster && (
        <form onSubmit={kaynakEkle} className="cam-kart" style={{ padding: '20px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Yeni Lojistik Kaydı</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-grubu">
              <label>Malzeme/Kaynak Adı</label>
              <input type="text" value={formVeri.ad} onChange={e => setFormVeri({...formVeri, ad: e.target.value})} required className="form-input" placeholder="Örn: Kışlık Çadır" />
            </div>
            <div className="form-grubu">
              <label>Kategori</label>
              <select value={formVeri.kategori} onChange={e => setFormVeri({...formVeri, kategori: e.target.value})} required className="form-input">
                <option value="">Seçiniz...</option>
                <option value="Barınma">Barınma</option>
                <option value="Gıda">Gıda</option>
                <option value="Sağlık / İlaç">Sağlık / İlaç</option>
                <option value="Yakıt">Yakıt</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            <div className="form-grubu">
              <label>Miktar</label>
              <input type="number" value={formVeri.miktar} onChange={e => setFormVeri({...formVeri, miktar: e.target.value})} required className="form-input" min="1" />
            </div>
            <div className="form-grubu">
              <label>Birim</label>
              <select value={formVeri.birim} onChange={e => setFormVeri({...formVeri, birim: e.target.value})} required className="form-input">
                <option value="Adet">Adet</option>
                <option value="Koli">Koli</option>
                <option value="Ton">Ton</option>
                <option value="Lt">Litre</option>
              </select>
            </div>
            <div className="form-grubu" style={{ gridColumn: '1 / -1' }}>
              <label>Depo / Konum</label>
              <input type="text" value={formVeri.konum} onChange={e => setFormVeri({...formVeri, konum: e.target.value})} required className="form-input" placeholder="Örn: Merkez Depo (Ankara)" />
            </div>
          </div>
          <button type="submit" className="btn btn-ikincil" style={{ marginTop: '15px' }}>Sisteme Kaydet</button>
        </form>
      )}

      <div className="talep-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {kaynaklar.map(kaynak => (
          <div key={kaynak.id} className="talep-kart" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="talep-kategori">{kaynak.kategori}</span>
              <span className={`talep-durum-${kaynak.durum === 'aktif' ? 'beklemede' : 'eslesti'}`}>
                {kaynak.durum === 'aktif' ? 'Mevcut' : 'Tükendi'}
              </span>
            </div>
            <h3 style={{ margin: '5px 0' }}>{kaynak.ad}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--renk-ikincil)', fontWeight: 'bold' }}>
              <Database size={16} /> Stok: {kaynak.miktar} {kaynak.birim}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--renk-metin-soluk)' }}>
              <MapPin size={16} /> {kaynak.konum}
            </div>
            
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--renk-kenarlik)' }}>
               {kaynak.durum === 'aktif' ? (
                 <button onClick={() => durumDegistir(kaynak.id, 'tukendi')} className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: 'var(--renk-araplan)', color: 'var(--renk-metin-soluk)', border: '1px solid var(--renk-kenarlik)' }}>
                   Tükendi Olarak İşaretle
                 </button>
               ) : (
                 <button onClick={() => durumDegistir(kaynak.id, 'aktif')} className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: 'var(--renk-araplan)', color: 'var(--renk-birincil)', border: '1px solid var(--renk-birincil)' }}>
                   Stok Yenilendi (Aktif)
                 </button>
               )}
            </div>
          </div>
        ))}
        {kaynaklar.length === 0 && !formGoster && (
          <p style={{ gridColumn: '1 / -1', color: 'var(--renk-metin-soluk)', textAlign: 'center', marginTop: '30px' }}>
            Henüz sisteme kaydedilen lojistik materyal bulunmamaktadır.
          </p>
        )}
      </div>

    </>
  );
};

export default Lojistik;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HeartHandshake, LogOut, Home, PlusCircle, AlertTriangle, ActivitySquare, PackagePlus, MessageSquare, Menu, X } from 'lucide-react';
import api from '../api';

const Navbar = ({ kullanici, cikisYap }) => {
  const yonlendir = useNavigate();
  const konum = useLocation();
  const [istekGidiyor, setIstekGidiyor] = useState(false);
  const [mesajlar, setMesajlar] = useState([]);
  const [menuAcik, setMenuAcik] = useState(false);

  React.useEffect(() => {
    if (kullanici) {
      mesajlariGetir();
      const interval = setInterval(mesajlariGetir, 30000); // 30 saniyede bir kontrol et
      return () => clearInterval(interval);
    }
  }, [kullanici]);

  const mesajlariGetir = async () => {
    try {
      const { data } = await api.get('/mesajlar');
      setMesajlar(data);
    } catch (hata) {
      console.error('Mesajlar alınamadı', hata);
    }
  };

  const cikisIslemi = () => {
    cikisYap();
    setMenuAcik(false);
    yonlendir('/giris');
  };

  const menuKapat = () => setMenuAcik(false);

  const beniAraIslemi = async () => {
    if (istekGidiyor) return;
    try {
      setIstekGidiyor(true);
      await api.post('/acil-durum/beni-ara');
      alert('Acil çağrınız alındı! Lütfen telefonunuzu açık tutun, yetkililer sizinle iletişime geçecek.');
    } catch (hata) {
      alert(hata.response?.data?.mesaj || 'Çağrı oluşturulurken bir hata oluştu');
    } finally {
      setIstekGidiyor(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="kapsayici navbar-ic">
        <Link to="/" className="logo">
          <HeartHandshake size={28} color="var(--renk-birincil)" />
          Vuslat
        </Link>

        <button className="mobil-menu-tetikleyici" onClick={() => setMenuAcik(!menuAcik)}>
          {menuAcik ? <X size={28} /> : <Menu size={28} />}
        </button>

        {kullanici ? (
          <div className={`nav-linkler ${menuAcik ? 'aktif' : ''}`}>
            <Link to="/" onClick={menuKapat} className={`nav-link ${konum.pathname === '/' ? 'nav-link-aktif' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Home size={20} />
              <span>Ana Sayfa</span>
            </Link>
            
            {kullanici.rol === 'afetzede' && (
              <Link to="/talep-ekle" onClick={menuKapat} className={`nav-link ${konum.pathname === '/talep-ekle' ? 'nav-link-aktif' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PlusCircle size={20} />
                <span>Talep Ekle</span>
              </Link>
            )}

            {kullanici.rol === 'afetzede' && (
              <button onClick={() => { beniAraIslemi(); menuKapat(); }} disabled={istekGidiyor} className="btn" style={{backgroundColor: '#e74c3c', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
                <AlertTriangle size={18} />
                <span>BENİ ARA (SOS)</span>
              </button>
            )}

            {kullanici.rol === 'yonetici' && (
              <>
                <Link to="/komuta-merkezi" onClick={menuKapat} className={`nav-link ${konum.pathname === '/komuta-merkezi' ? 'nav-link-aktif' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ActivitySquare size={20} />
                  <span>Komuta Merkezi</span>
                </Link>
                <Link to="/lojistik" onClick={menuKapat} className={`nav-link ${konum.pathname === '/lojistik' ? 'nav-link-aktif' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PackagePlus size={20} />
                  <span>Lojistik</span>
                </Link>
              </>
            )}

            <Link to="/mesajlar" onClick={menuKapat} className="nav-mesaj-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={24} color={konum.pathname === '/mesajlar' ? 'var(--renk-birincil)' : 'var(--renk-metin)'} />
              <span className="mobil-metin">Mesajlar</span>
              {mesajlar.filter(m => !m.okundu_mu && m.alici_id === kullanici.id).length > 0 && (
                <span className="mesaj-sayaci">
                  {mesajlar.filter(m => !m.okundu_mu && m.alici_id === kullanici.id).length}
                </span>
              )}
            </Link>

            <button onClick={cikisIslemi} className="btn btn-dikkat cikis-btn">
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        ) : (
          <div className={`nav-linkler ${menuAcik ? 'aktif' : ''}`}>
            <Link to="/giris" onClick={menuKapat} className="nav-link">Giriş Yap</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

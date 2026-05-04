import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './bilesenler/Navbar';
import Footer from './bilesenler/Footer';
import Giris from './sayfalar/Giris';
import AnaSayfa from './sayfalar/AnaSayfa';
import TalepEkle from './sayfalar/TalepEkle';
import KomutaMerkezi from './sayfalar/KomutaMerkezi';
import Lojistik from './sayfalar/Lojistik';
import Mesajlar from './sayfalar/Mesajlar';

function App() {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    // localstorage'dan kullanıcıyı al
    const saklananKullanici = localStorage.getItem('kullanici');
    if (saklananKullanici) {
      setKullanici(JSON.parse(saklananKullanici));
    }
    setYukleniyor(false);
  }, []);

  const girisDurumuGuncelle = (kullaniciVerisi) => {
    setKullanici(kullaniciVerisi);
  };

  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    setKullanici(null);
  };

  if (yukleniyor) return <div className="yukleniyor">Yükleniyor...</div>;

  return (
    <BrowserRouter>
      <Navbar kullanici={kullanici} cikisYap={cikisYap} />
      <main className="sayfa-icerigi kapsayici">
        <Routes>
          {/* özel rota kontrolü (sadece girişli kullanıcılar anasayfa'yı görebilir) */}
          <Route 
            path="/" 
            element={kullanici ? <AnaSayfa kullanici={kullanici} /> : <Navigate to="/giris" />} 
          />
          <Route 
            path="/giris" 
            element={!kullanici ? <Giris girisDurumuGuncelle={girisDurumuGuncelle} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/talep-ekle" 
            element={kullanici && kullanici.rol === 'afetzede' ? <TalepEkle kullanici={kullanici} /> : <Navigate to="/" />} 
          />
          
          {/* mesajlaşma rotası */}
          <Route 
            path="/mesajlar" 
            element={kullanici ? <Mesajlar kullanici={kullanici} /> : <Navigate to="/" />} 
          />
          
          {/* yönetici rotaları */}
          <Route 
            path="/komuta-merkezi" 
            element={kullanici && kullanici.rol === 'yonetici' ? <KomutaMerkezi kullanici={kullanici} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/lojistik" 
            element={kullanici && kullanici.rol === 'yonetici' ? <Lojistik kullanici={kullanici} /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

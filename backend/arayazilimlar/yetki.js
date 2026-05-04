const jwt = require('jsonwebtoken');

const yetkiDogrula = (req, res, next) => {
  // header'dan token al
  const token = req.header('x-auth-token');

  // token yoksa uyar
  if (!token) {
    return res.status(401).json({ mesaj: 'yetkiniz yok, token bulunamadı.' });
  }

  // token'ı doğrula
  try {
    const cozulmus = jwt.verify(token, process.env.JWT_GIZLI_ANAHTAR);
    req.kullanici = cozulmus.kullanici;
    next();
  } catch (hata) {
    res.status(401).json({ mesaj: 'token geçersiz.' });
  }
};

module.exports = yetkiDogrula;

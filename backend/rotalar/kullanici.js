const express = require('express');
const router = express.Router();
const { kayitOl, girisYap } = require('../denetleyiciler/kullaniciDenetleyici');

// @route    post api/kimlik/kayit
// @desc     kullanıcı kaydı yapar
// @access   public
router.post('/kayit', kayitOl);

// @route    post api/kimlik/giris
// @desc     kullanıcı girişi yapar ve token döndürür
// @access   public
router.post('/giris', girisYap);

module.exports = router;

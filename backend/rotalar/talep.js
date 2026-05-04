const express = require('express');
const router = express.Router();
const yetkiDogrula = require('../arayazilimlar/yetki');
const { talepOlustur, alTalepler, talepEslestir, talepSil } = require('../denetleyiciler/talepDenetleyici');

// @route    post api/talepler
// @desc     yeni yardım talebi oluştur (sadece afetzede)
// @access   private
router.post('/', yetkiDogrula, talepOlustur);

// @route    get api/talepler
// @desc     tüm talepleri getir
// @access   public
router.get('/', alTalepler);

// @route    post api/talepler/:id/esles
// @desc     talebe gönüllü ol (sadece gönüllü)
// @access   private
router.post('/:id/esles', yetkiDogrula, talepEslestir);

// @route    delete api/talepler/:id
// @desc     talebi sil (sadece yönetici)
// @access   private
router.delete('/:id', yetkiDogrula, talepSil);

module.exports = router;

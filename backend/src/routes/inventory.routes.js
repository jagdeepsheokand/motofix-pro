const express = require('express');
const router = express.Router();
const {
  addPart,
  getAllParts,
  getSinglePart,
  updatePart,
  deletePart,
  increaseStock,
  decreaseStock,
  getLowStockAlerts
} = require('../controllers/inventory.controller');

//  middleware 
const { protect } = require('../middlewares/auth.middleware'); 

// All routes protected (garage owner only)
router.use(protect);

router.route('/')
  .post(addPart)
  .get(getAllParts);

// Static routes before dynamic :id routes
router.get('/low-stock', getLowStockAlerts);

router.route('/:id')
  .get(getSinglePart)
  .put(updatePart)
  .delete(deletePart);

router.post('/:id/increase', increaseStock);
router.post('/:id/decrease', decreaseStock);

module.exports = router;
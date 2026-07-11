const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  getNextInvoiceNumber
} = require('../controllers/invoice.controller');

const { protect } = require('../middlewares/auth.middleware'); // assuming you have this

router.use(protect); // Protect all invoice routes

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

module.exports = router;
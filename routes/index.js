var express = require('express');
var moneyController = require('../controllers/moneyController');
var stockController = require('../controllers/stockController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'StockApp' });
});

router.post('/getMoney',moneyController.getMoney);
router.post('/addMoney',moneyController.addMoney);
router.post('/withdrawMoney',moneyController.withdrawMoney);
router.post('/getStock', stockController.getStock);
router.post('/buyStock', stockController.buyStock);
router.post('/sellStock', stockController.sellStock);
router.post('/getCurrentWorth',stockController.getCurrentWorth);
module.exports = router;

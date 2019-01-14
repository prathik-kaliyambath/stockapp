var stockController = function(){};
var utils = require("../utils/utilfile")
var request = require('request')
var moneyController = require("./moneyController")

stockController.stocks = {}
stockController.getCurrentWorth = function(req,res){
    var sendRes = function(stockSum){
        res.json({"error":0,"status":"success","data":stockSum+moneyController.bal})
    }
    if(req.body.userid){
        stockSum =0;
        stockCount = 0;
        stockArr = Object.keys(stockController.stocks);
        if(stockArr.length>0){
          stockArr.forEach(function(item,i){
              var stockSym =item.toUpperCase();
              apistr = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+stockSym+"&apikey=7NK0G4T2XNHMT6IM"
              try{

                request(apistr,function(err,resp,body){
                    stockCount = stockCount+1;
                    body = JSON.parse(body)
                    var price = parseFloat(body['Global Quote']["05. price"])
                    stockSum = stockSum + (price*parseFloat(stockController.stocks[stockSym]))
                    if(stockCount==stockArr.length){
                        sendRes(stockSum);
                    }
                });
              }
              catch(e){
                res.json({"error":1,"status":"something went wrong!!"});
              }

          });
        }
        else{
          sendRes(0)
        }
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}
stockController.getStock = function(req,res){
    if(req.body.userid){
	stockRes = [];
	for(var k in stockController.stocks){
	var tempStock = {
	"name":k,
	"qty":stockController.stocks[k]
	};
	stockRes.push(tempStock)
	}
        res.json({"error":0,"status":"success","data":moneyController.bal, "stocks":stockRes})
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}


stockController.buyStock = function(req,res){
    if(req.body.userid&&req.body.qty&&req.body.symbol){
        var stockSym =req.body.symbol.toUpperCase();
        var apistr = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+stockSym+"&apikey=7NK0G4T2XNHMT6IM"
        try{
          request(apistr,function(err,resp,body){
              body = JSON.parse(body)
              var price = parseFloat(body['Global Quote']["05. price"])
              var priceOfStock = parseFloat(req.body.qty)*price;
              if(priceOfStock<=moneyController.bal){
                  moneyController.bal = moneyController.bal -priceOfStock;
                  if(stockController.stocks && stockController.stocks[stockSym]){
                      stockController.stocks[stockSym] = stockController.stocks[stockSym]+ parseFloat(req.body.qty)
                  }
                  else{
                      stockController.stocks[stockSym] = parseFloat(req.body.qty)
                  }
                  res.json({"error":0,"status":"success","data":moneyController.bal,"stocks":stockController.stocks});
              }
              else
                  res.json({"error":2,"status":"failure, not enough balance","data":moneyController.bal,"stocks":stockController.stocks});
          });
        }
        catch(e){
          res.json({"error":1,"status":"something went wrong!!"});
        }
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}
stockController.sellStock = function(req,res){
    if(req.body.userid&&req.body.qty&&req.body.symbol){
        var stockSym =req.body.symbol.toUpperCase();
        apistr = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+stockSym+"&apikey=7NK0G4T2XNHMT6IM"
        try{
          request(apistr,function(err,resp,body){
              body = JSON.parse(body)
              var price = parseFloat(body['Global Quote']["05. price"])
              var priceOfStock = parseFloat(req.body.qty)*price;
              if(stockController.stocks && stockController.stocks[stockSym]&&parseFloat(req.body.qty)<=stockController.stocks[stockSym]){
                  stockController.stocks[stockSym] = stockController.stocks[stockSym]- parseFloat(req.body.qty)
          		if(stockController.stocks[stockSym] ==0){
          			delete stockController.stocks[stockSym]
          		}
                  moneyController.bal = moneyController.bal + priceOfStock;
                  res.json({"error":0,"status":"success","data":moneyController.bal,"stocks":stockController.stocks});
              }
              else{
                  res.json({"error":2,"status":"failure, not enough stock balance","data":moneyController.bal,"stocks":stockController.stocks})
              }


          });
        }
        catch(e){
          res.json({"error":1,"status":"something went wrong!!"});
        }
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}
module.exports = stockController

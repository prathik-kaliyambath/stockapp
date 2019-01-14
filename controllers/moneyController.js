var moneyController = function(){
};
var utils = require("../utils/utilfile")
var request = require('request')

moneyController.bal = 1000;//defaults to 1000USD
moneyController.getMoney = function(req,res){
    if(req.body.userid){
        var money = moneyController.bal;
        res.json({"error":0,"status":"success","data":moneyController.bal});
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}


moneyController.addMoney = function(req,res){
    if(req.body.userid&&req.body.money){
        var finmon = moneyController.bal+parseFloat(req.body.money);
        moneyController.bal= finmon;
        res.json({"error":0,"status":"success","data":finmon});
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}
moneyController.withdrawMoney = function(req,res){
    if(req.body.userid&&req.body.money){
        if(moneyController.bal>=parseFloat(req.body.money)){
            moneyController.bal =  moneyController.bal-parseFloat(req.body.money)
            res.json({"error":0,"status":"success","data":moneyController.bal});
            }
        else{
            res.json({"error":2,"status":"failure, not enough balance","data":moneyController.bal});
        }
    }
    else{
        res.json({"error":1,"status":"please pass a user id(default = 1)"});
    }
}
module.exports = moneyController

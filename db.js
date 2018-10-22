//Um require('.db') foi necessário no topo do arquivo app.js

var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

mongoClient.connect("mongodb://localhost:27017",
    function(err, conn) {
        if (err) return console.log(err);
        global.db = conn.db('dbStarWarsPlanets');
    });

module.exports = {
    adicionar: function (nome, clima, terreno, callbackx) {
        global.db.collection("planetas").insertOne({nome, clima, terreno}, function(err, result){
            if (err) return console.log(err);
            callbackx();
        })
    },

    listar: function (callback) {
        global.db.collection("planetas").find().toArray(function(err, planetas){
            if (err) return console.log(err);
            callback(planetas);
        })
    },

    buscarPorId: function (id, callback) {
        var idConv =  new mongoose.Types.ObjectId(id);

        global.db.collection("planetas").findOne({ _id: idConv},function(err, planeta) {
            if (err) return console.log(err);
            callback(planeta);
        });
    },

    buscarPorNome: function(nome, callback) {
        global.db.collection("planetas").find({nome: new RegExp(nome, 'i')}).toArray(function(err, planetas) {
            if (err) return console.log(err);
            callback(planetas);
        });
    },

    excluir: function(id, callback){
        var idConv =  new mongoose.Types.ObjectId(id);
        global.db.collection("planetas").deleteOne({_id: idConv}, function(err, planeta) {
            if (err) return console.log(err);
            callback(planeta);
        })
    }
}

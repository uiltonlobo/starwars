var express = require('express');
var router = express.Router();
var business = require('../business/planetaBusiness');

/* GET home page. */
router.get('/planetas', async function(req, res) {
  tratarRetorno = function(result) {
    res.json(result);
  };

  var nome = req.query.nome;

  if (nome != undefined || nome != null) {
    business.buscarPorNome(nome, tratarRetorno);
  }
  else {
    business.listar(tratarRetorno);
  }
});

router.get('/planetas/:id', function(req, res) {
  tratarRetorno = function(result) {
    res.json(result);
  };

  business.buscarPorId(req.params.id, tratarRetorno);
});

router.post('/planetas', function(req, res){
  var nome = req.body.nome;
  var clima = req.body.clima;
  var terreno = req.body.terreno;

  business.adicionar(nome, clima, terreno, function() { 
      res.write('Gravado');
      res.end(); 
    })
});

router.delete('/planetas/:id', function(req, res) {
  var id = req.params.id;

  business.excluir(id, function(result) {
    res.write(`Planeta ${result.nome} excluído com sucesso.`);
    res.end();
  })
});

module.exports = router;

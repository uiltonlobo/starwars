var repositorio = require('../db');

function obterIncidenciaFilmes(nomePlaneta, retornar) {
    var Request = require("request");

    var retorno = 0;

    var p = new Promise((resolve, reject) => {
        Request.get(`https://swapi.co/api/planets?search=${nomePlaneta}`, (err, res, body) => {
            
            console.log('Entrei na promisse');

            if (err) {
                return console.dir(err);
            }

            console.log('Processando o resultado da busca');

            var qtdFilmes = 0;
            var planetaEncontrado = JSON.parse(body).results[0];

            if (planetaEncontrado !== undefined || planetaEncontrado != null) {
                qtdFilmes = planetaEncontrado.films.length;
            }

            console.log('Chamando o resolve');

            resolve(qtdFilmes);
        });
    });

    p.then((result) => {
        console.log('Entrei no then');
        console.log('result: ', result);
        
        console.log('Executando o retorno');
        retorno = result;
        retornar(retorno);
    });

    return p;    

    // Request.get(`https://swapi.co/api/planets?search=${nomePlaneta}`, (err, res, body) => {
    //     if (err) {
    //         return console.dir(err);
    //     }

    //     var qtdFilmes = 0;
    //     var planetaEncontrado = JSON.parse(body).results[0];

    //     if (planetaEncontrado !== undefined || planetaEncontrado != null) {
    //         qtdFilmes = planetaEncontrado.films.length;
    //     }

    //     retornar(qtdFilmes);
    // });
}

module.exports = {
    adicionar: function (nome, clima, terreno, callback) {
        repositorio.adicionar(nome, clima, terreno, function () {
            callback();
        });
    },

    listar: function (callback) {
        repositorio.listar(function (planetas) {
            

            var main_p = new Promise((res, rej) => {
                var lista = [];
            
                for (var i = 0; i < planetas.length; i++) {
                    var item = {
                        _id: planetas[i]._id,
                        nome: planetas[i].nome,
                        clima: planetas[i].clima,
                        terreno: planetas[i].terreno,
                        incidenciaFilmes: 0
                    };
    
                    var p = new Promise((resolve, reject) => {
                        obterIncidenciaFilmes(planetas[i].nome, function (qtd) {
                            resolve(qtd);
                        });
                    });
    
                    p.then((val) => {
                        var quant = val;
                        item.incidenciaFilmes = quant;
                    });                
    
                    lista.push(item);
                }

                res(lista);
            });

            main_p.then((val) => {
                var lista = val;
                callback(lista);
            });

        })
    },

    buscarPorId: function (id, callback) {
        repositorio.buscarPorId(id, function (planeta) {
            if (planeta != undefined || planeta != null) {
                obterIncidenciaFilmes(planeta.nome, function (qtd) {
                    planeta.incidenciaFilmes = qtd;
                    callback(planeta);
                });
            }

        });
    },

    buscarPorNome: function (nome, callback) {
        repositorio.buscarPorNome(nome, function (planetas) {
            for (var i = 0; i < planetas.length; i++) {
                obterIncidenciaFilmes(planetas[i].nome, function (qtd) {
                    planetas[i].incidenciaFilmes = qtd;
                });
            }

            callback(planetas);
        });
    },

    excluir: function (id, callback) {
        var idConv = new mongoose.Types.ObjectId(id);
        repositorio.excluir(id, function (err, planeta) {
            if (err) return console.log(err);
            callback(planeta);
        })
    }
}
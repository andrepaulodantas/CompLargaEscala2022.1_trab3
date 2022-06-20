const serverless = require("serverless-http");
const express = require('express');
const soap = require('soap');
const router = express.Router();

const books = [ 
  {id:1, name: 'A culpa é das estrelas'},
  {id:2, name: 'O cemitério dos bichos'},
  {id:3, name: 'Sherlock Holmes'},
  {id:4, name: 'Moby Dick'}
]


/* GET home page. */
router.get('/consulta/:cep', function(req, res, next) {
  var arg = req.params.cep;
  var url = 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl'
  soap.createClient(url, function (err, client) {
    client.consultaCEP({cep: arg}, function(err, result) {
        if(err) return console.log(err);
        res.send(result)
    })
  })
});

router.get('/api/celsiusToFahrenheit/:celsius', function(req, res, next) {
  var celsius = req.params.celsius;
  var n = (celsius*1.8)+32;
  res.status(200).send('Fahrenheit = ' + n);
});


router.get('/api/books', function(req, res) {
  res.send(books);  
});

router.get('/api/book/:id', function(req, res) {
 const book = books.find((b) => b.id ===parseInt(req.params.id));
 if(!book) return res.status(404).send('Não há livro com esse id');
 res.send(book);  
});

router.post('/api/books', function(req, res) {
  if(!req.body.name) return res.status(404).send('O livro precisa ter um nome');
  const book = {
    id: books[books.length-1].id+1,
    name: req.body.name
  }
  books.push(book);
  res.send(book);  
});

router.put('/api/book/:id', function(req, res) {
  const book = books.find((b) => b.id ===parseInt(req.params.id));
  if(!book) return res.status(404).send('Não há livro com esse id');
  
  book.name = req.body.name;
  res.send(book);
});

router.delete('/api/book/:id', function(req, res) {
  const book = books.find((b) => b.id ===parseInt(req.params.id));
  if(!book) return res.status(404).send('Não há livro com esse id');
  const index = books.indexOf(book);
  books.splice(index, 1);

  res.send(book);
  
});


module.exports = router;

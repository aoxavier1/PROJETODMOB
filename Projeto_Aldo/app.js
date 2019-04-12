// CARREGANDO MODULOS
const express = require ('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express ()
const admin = require ("./routes/admin")
const path = require ("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Funcionario")
const Funcionario  = mongoose.model("funcionario")

// CONFIGURAÇÕES
  //SEÇÃO
    app.use(session({
      secret: "projeto aldo",
      resave: true,
      saveUninitialized: true
    }))
    app.use(flash())
  //MIDDLEWARE
    app.use((req, res, next )=> {
      res.locals.success_msg = req.flash("success_msg")
      res.locals.erros_msg = req.flash("error_mgs")
      next()
    })
  // BODY PARSES
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
  // HANDLEBARS
  app.engine('handlebars', handlebars({defaultLayout: 'main'}))
  app.set('view engine', 'handlebars');

  // MONGOOSE

  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/projeto').then(() =>{
    console.log("Conectando ao mongo")
  }).catch((err) => {
    console.log("Erro ao se conectar: " +err)
  })

  // PUBLIC
    app.use(express.static(path.join(__dirname,"public")))
// ROTAS

  app.get('/' ,(req , res) => {
    res.render("admin/funcionario")
  })
  
  app.use ('/admin', admin)

  app.get("/funcionario" , (req, res) =>{
    Funcionario.find().then((funcionario) =>{
      res.render("funcionario/index" , {funcionario: funcionario})
    }).catch((err) =>{
      req.flash("erros_msg", "Houve um erro interno ao listar os funcionarios" )
    })
  })

// OUTROS
const PORT = 8081
app.listen(PORT, () => {
  console.log("Servidor rodando!")
})

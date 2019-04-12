const express = require ("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Funcionario")
const Funcionario = mongoose.model("funcionario")

// ROTAS
router.get('/', (req, res) => {
  res.render("admin/index")
})

router.get('/posts', (req, res) =>{
  res.send("Página de posts")
})

router.get ("/funcionario", (req, res) => {
  Funcionario.find().sort({date: 'desc'}).then((funcionario) => {
    res.render("admin/funcionario", {funcionario: funcionario})
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.redirect("/admin")
  })

})

router.get('/funcionario/add', (req, res) => {
  res.render("admin/novofuncionario")

})
// CADASTRANDO NOVO FUNCIONARIO
router.post("/funcionario/novo", (req, res) =>{

  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
    erros.push({texto: "Nome invalido"})
}
  if(!req.body.cargo || typeof req.body.cargo == undefined || req.body.cargo == null ){
    erros.push({texto: "Cargo invalido"})
  }
  if(req.body.nome.lenght < 2){
    erros.push({texto: "Nome do funcionario muito pegueno"})
  }
  if(erros.lenght > 0){
    res.render("admin/novofuncionario", {erros: erros})
  }else{

  const novofuncionario = {
    nome: req.body.nome,
    cargo: req.body.cargo
  }
    new Funcionario(novofuncionario).save().then(() => {
      req.flash("success_msg", "Funcionado cadastrado com sucesso")
      res.redirect("/admin/funcionario")
    }).catch((err) => {
      req.flash("erros_msg", "Houve um erro ao cadastrar funcionario tente novamente")
      res.redirect("/admin/funcionario")
    })
}
})
// EDITANDO OS FUNCIONARIOS
router.get("/funcionario/edit/:id" , (req, res) => {
    Funcionario.findOne({_id: req.params.id}).then((funcionario) =>{
      res.render("admin/editfuncionario"  , {funcionario: funcionario})
    }).catch((err)=>{
      req.flash("error_msg","Este funcionario não existe")
      res.redirect("/admin/funcionario")
    })
})

router.post("/funcionario/edit",(req, res) =>{
    Funcionario.findOne({_id: req.body.id}).then((funcionario) =>{
        funcionario.nome = req.body.nome
        funcionario.cargo = req.body.cargo
        //SALVANDO EDIÇÃO NO BANCO DE DADOS
        funcionario.save().then(() =>{
          req.flash("success_msg", "Funcionario editado com sucesso!")
          res.redirect("/admin/funcionario")
        }).catch((err) =>{
          req.flash("error_msg", "Houve um erro interno ao salvar a edição do funcionario")
          res.redirect("/admin/funcionario")
        })

    }).catch((err) =>{
      req.flash("error_msg", "Houve um erro ao editar o funcionario")
      res.redirect("/admin/funcionario")
    })
})
// DELETANDO OS FUNCIONARIOS
router.post("/funcionario/deletar" , (req, res) =>{
  Funcionario.remove({_id: req.body.id}).then(() =>{
    req.flash("success_msg", "Funcionario deletado   com sucesso!")
    req.redirect("/admin/categoria")
  }).catch((err) => {
    req.flash("error_msg" , "Houve um erro ao deletar o funcionario")
    res.redirect("/admin/funcionario")
  })
})

router.get("/teste", (req, res) =>{
  res.send ("Isso é um teste")
})

module.exports = router

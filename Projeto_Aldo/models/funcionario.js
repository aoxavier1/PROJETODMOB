  const mongoose = require("mongoose")
  const Schema = mongoose.Schema;
  const Funcionario = new Schema ({
    nome: {
      type: String,
      required: true
    },
    cargo: {
      type: String,
      required:true
},
    date: {
      type: Date,
      default: Date.now()
    }
  })

  mongoose.model("funcionario", Funcionario)

  

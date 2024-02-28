const express = require('express')
const app = express()
const mysql = require('mysql2')
const port = process.env.PORT || 9999;
const bodyParser = require('body-parser')


app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'aluno',
    password: 'ifpecjbg',
    database: 'web3',
    port: 3306,
});

connection.connect((err) => {
    if (err) {
        console.log("Erro ao conectar com o MySql",err.message)
    } else {
        console.log('Conectado ao MySql')
    }
})

let operations = {
    create: function(email,senha) {
      return connection.promise().query('insert into usuarios (email, senha) VALUES (?,?)', [email, senha])
    },
    read: function(){
      return connection.promise().query('select * from usuarios for update')
    },
    update: function(email, senha, id){
        return connection.promise().execute('update usuarios set email = ?, senha = ? where id = ?', [email, senha, id])
    },
    delete: function(id){
      return connection.promise().execute('delete from usuarios where id = ?', [id] )
    },
}


app.get("/api/usuarios/", async (req, res)=> {
    operations.read().then((result)=> {
        res.status(200).json(result[0])
    }).catch(err => {
        console.log(err, "Erro coletando os usuarios")
        res.status(500).json({message: "Erro"})
    })
})

app.post("/api/usuarios", async (req,res)=> {
    const {email, senha} = req.body

    operations.create(email,senha).then((result)=> {
        console.log("Usuario inserido com sucesso")
        res.status(200).json({message: "Sucesso"})
    }).catch(err => {
        console.log(err, "Erro ao inserir usuario")
        res.status(500).json({message: "Erro"})
    })
})

app.put("/api/usuarios/:id", async(req,res)=> {
    const clienteId = req.params.id
    const {email, senha} = req.body

    operations.update(email,senha,clienteId).then((result)=>{
        console.log("Usuario atualizado com sucesso")
        res.status(200).json({message: "Sucesso"})
    }).catch(err => {
        console.log(err)
        res.status(500).json({message: "Erro"})
    })
})

app.delete("/api/usuarios/:id", async(req,res)=> {
    const clienteId = req.params.id

    operations.delete(clienteId).then(result => {
        console.log(result)
        if(result[0].affectedRows > 0) {
            res.status(200).json({message: "Sucesso"})
            console.log('Usuario deleteado')
        } else {
            res.status(404).json({message: "Erro"})
            console.log('Registro não encontrado')
        }
    })


})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 

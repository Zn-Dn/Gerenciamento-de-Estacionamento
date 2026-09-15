import express from 'express';
import database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config';

// estudar inset e select
const app = express();
app.use(express.json());
app.use(cors());

const db = new database('banco.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS funcionarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )
`);

const email = process.env.DEMO_EMAIL;
const senhaPura = process.env.DEMO_SENHA;

const senhaHash = await bcrypt.hash(senhaPura, 10);
try{
  const inserir = db.prepare('INSERT INTO funcionarios(email,senha)VALUES(?,?)');
inserir.run(email,senhaHash)  
console.log("fucionou!")
}
catch{
    console.log("ja existe ou deu erro")
}



app.post("/login", async(req,res)=>{
const {email,senha} = req.body


const buscar = db.prepare('SELECT * FROM funcionarios WHERE email = ?');
const funcionario = buscar.get(email);

 if (!funcionario) {
        return res.status(401).json({ erro: 'Email  inválido' });
    }

    const senhaCorreta = await bcrypt.compare(senha,funcionario.senha);


     if (!senhaCorreta) {
        return res.status(401).json({ erro: 'senha inválido' });
    }

    
    res.json({ mensagem: 'Login realizado com sucesso', status:true });

    })
    


    // Cadastro do Cliente

    db.exec(`
   CREATE TABLE IF NOT EXISTS cadastro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL UNIQUE,
    tempo INTEGER NOT NULL
)
    )
`);
    app.post("/Cadastro", async(req,res)=>{
const {nome,cpf,telefone,tempo} = req.body


const inserirCadastro = db.prepare(`
    INSERT INTO Cadastro (nome, cpf, telefone, tempo)
    VALUES (?, ?, ?, ?)
`);

const resultado = inserirCadastro.run(nome, cpf, telefone, tempo);

if (resultado.changes === 0) {
    return res.status(400).json({
        erro: "Nao foi possivel cadastrar"
    });
}

  

    res.json({ mensagem: 'Login realizado com sucesso', status:true });

    })
    
    app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
import express from 'express';
import database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken'
import path from "path";
import { fileURLToPath } from "url";
import { sign } from 'crypto';


const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("dist"));

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const db = new database('banco.db');



db.exec(`
   CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
   )
`);

db.exec(`
   CREATE TABLE IF NOT EXISTS CadastroCliente(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL UNIQUE,
    tempo INTEGER NOT NULL,
    placa TEXT NOT NULL UNIQUE,
    modelo TEXT NOT NULL,
    cor TEXT NOT NULL,
    entrada INTEGER NOT NULL,
    avisado INTEGER NOT NULL DEFAULT 0
)
`);

db.exec(`
   CREATE TABLE IF NOT EXISTS vagas_ocupadas (
    numero INTEGER PRIMARY KEY,
    cliente_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (cliente_id) REFERENCES CadastroCliente(id)
   )
`);

function buscarUsuario(email){


   if (!email) {
        return null;
    }

    const usuario =  db.prepare('SELECT id, email, senha FROM login WHERE email = ?').get(email);


return usuario
}

async function criarUsuario() {


    const email = process.env.DEMO_EMAIL;
    const senhaPura = process.env.DEMO_SENHA;



    if (!email || !senhaPura) {
        console.log('DEMO_EMAIL ou DEMO_SENHA não definidos no .env — seed ignorado.');
        return;
    }

    try {
        const senhaHash = await bcrypt.hash(senhaPura, 10);
        const inserir = db.prepare('INSERT INTO login(email, senha) VALUES (?, ?)');
        inserir.run(email, senhaHash);
        console.log('Usuário demo criado com sucesso.');
    } catch (erro) {

        if (erro.message.includes('UNIQUE')) {
            console.log('Usuário demo já existe, seed ignorado.');
        } else {
            console.log('ERRO REAL ao criar usuário demo:', erro.message);
        }
    }
}

await criarUsuario();


// hash falso para manter o tempo de resposta igual quando o usuário não existe
const HASH_FALSO = bcrypt.hashSync('senha-falsa', 10);

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const usuario = buscarUsuario(email);

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario ? usuario.senha : HASH_FALSO
        );

        if (!usuario || !senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ mensagem: 'Login realizado com sucesso', status: true, token });

    } catch (erro) {
        console.log('ERRO REAL no login:', erro.message);
        res.status(500).json({ erro: 'Erro ao realizar login' });
    }
});


function verificarToken(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    const [tipo, token] = auth.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ mensagem: 'Formato de token inválido' });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
}


const TOTAL_VAGAS = 60;

const cadastraComVaga = db.transaction((dados) => {
    const { nome, cpf, telefone, tempo, placa, modelo, cor } = dados;



    const resultado = db.prepare(`
        INSERT INTO CadastroCliente(nome,cpf,telefone,tempo,placa,modelo,cor,entrada)
        VALUES (?,?,?,?,?,?,?,?)`).run(nome, cpf, telefone, tempo, placa, modelo, cor, Date.now());
    const clienteId = resultado.lastInsertRowid;


    const ocupada = db.prepare(`SELECT numero FROM vagas_ocupadas`)
        .all()
        .map(linha => linha.numero)

    const livres = []
    for (let n = 1; n <= TOTAL_VAGAS; n++) {
        if (!ocupada.includes(n)) livres.push(n);
    }

    if (livres.length === 0) {
        throw new Error('LOTADO');
    }
    const vaga = livres[Math.floor(Math.random() * livres.length)];


    db.prepare('INSERT INTO vagas_ocupadas (numero, cliente_id) VALUES (?, ?)')
        .run(vaga, clienteId);

    return vaga;
})


app.post('/Cadastro', async (req, res) => {
    try {
        const { nome, cpf, telefone, tempo, placa, modelo, cor } = req.body;

        if (!nome || !cpf || !telefone || !tempo || !placa || !modelo || !cor) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        const vaga = cadastraComVaga({ nome, cpf, telefone, tempo, placa, modelo, cor, });

        res.json({ mensagem: 'Cadastro realizado com sucesso', status: true, vaga });

    } catch (erro) {
        console.log('ERRO REAL no cadastro:', erro.message);

        if (erro.message === 'LOTADO') {
            return res.status(409).json({ erro: 'Estacionamento lotado' });
        }
        if (erro.message.includes('UNIQUE')) {
            if (erro.message.includes('cpf')) {
                return res.status(409).json({ erro: 'CPF já cadastrado' });
            }
            if (erro.message.includes('telefone')) {
                return res.status(409).json({ erro: 'Telefone já cadastrado' });
            }
            if (erro.message.includes('placa')) {
                return res.status(409).json({ erro: 'Placa já cadastrada' });
            }
            return res.status(409).json({ erro: 'Registro duplicado' });
        }

        res.status(500).json({ erro: 'Erro ao cadastrar' });


    }
});



app.get('/encontraMotorista', (req, res) => {
    try {

        const nomeDoCliente = String(
            req.query.nomeDoCliente ?? ""
        ).trim();

        if (!nomeDoCliente) {
            return res.status(400).json({
                erro: "Nome é obrigatório"
            });
        }

        const motorista = db.prepare(`
            SELECT nome, telefone, placa, tempo, entrada
            FROM CadastroCliente
            WHERE nome = ?
        `).get(nomeDoCliente);

        if (!motorista) {
            return res.status(404).json({
                erro: "Motorista não encontrado"
            });
        }

        res.json(motorista);

    } catch (erro) {

        console.error(
            "ERRO REAL ao buscar motorista:",
            erro
        );

        res.status(500).json({
            erro: "Erro ao buscar motorista"
        });
    }
});


const removeMotorista = db.transaction((nome) => {
    db.prepare(`
        DELETE FROM vagas_ocupadas
        WHERE cliente_id IN (SELECT id FROM CadastroCliente WHERE nome = ?)
    `).run(nome);

    return db.prepare('DELETE FROM CadastroCliente WHERE nome = ?').run(nome);
});

app.delete("/deletamotorista/:nomedomotorista", (req, res) => {
    try {
        const nome = req.params.nomedomotorista.trim();

        const resultado = removeMotorista(nome);

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: "Motorista não encontrado" });
        }

        res.json({ status: true, mensagem: "Motorista removido" });

    } catch (erro) {
        console.log("ERRO REAL ao deletar:", erro.message);
        res.status(500).json({ erro: "Erro ao deletar motorista" });
    }
});



app.get('/vagas/ocupadas', (req, res) => {
    try {
        const linhas = db.prepare(`SELECT vagas_ocupadas.numero,CadastroCliente.tempo,CadastroCliente.entrada 
            FROM vagas_ocupadas INNER JOIN CadastroCliente 
            ON vagas_ocupadas.cliente_id = CadastroCliente.id`).all();




        res.json({ status: true, ocupadas: linhas });
    }


    catch (erro) {
        console.log('ERRO REAL ao listar vagas:', erro.message);
        res.status(500).json({ erro: 'Erro ao listar vagas' });
    }
});


app.get("/dadosCliente/:numero", (req, res) => {

    try {

        const dados = req.params.numero;

        console.log(dados);

        if (!dados) {
            return res.status(400).json({
                mensagem: "Valor não existe"
            });
        }

        const resultadodados = db.prepare(`
            SELECT
                CadastroCliente.nome,
                CadastroCliente.telefone,
                CadastroCliente.tempo,
                CadastroCliente.placa,
                CadastroCliente.modelo,
                CadastroCliente.entrada
            FROM vagas_ocupadas
            INNER JOIN CadastroCliente
                ON vagas_ocupadas.cliente_id = CadastroCliente.id
            WHERE vagas_ocupadas.numero = ?
        `).get(dados);

        console.log("RESULTADO DO BANCO:", resultadodados);

        if (!resultadodados) {
            return res.status(404).json({
                mensagem: "Nenhum cliente encontrado nessa vaga"
            });
        }

        res.status(200).json({
            mensagem: "Informações encontradas",
            informacoes: resultadodados
        });

    } catch (erro) {

        console.log("ERRO REAL:", erro);

        res.status(500).json({
            erro: "Erro interno do servidor"
        });

    }

});


const LIMITE_AVISO = 5 * 60 * 1000;   // 5 minutos

async function enviarMensagem(telefone, texto) {

    console.log(`ENVIANDO para ${telefone}: ${texto}`);
}


async function verificarAvisos() {
    try {
        const agora = Date.now();

        const clientes = db.prepare(`
            SELECT CadastroCliente.id, CadastroCliente.nome, CadastroCliente.telefone,
                   CadastroCliente.entrada, CadastroCliente.tempo
            FROM vagas_ocupadas
            INNER JOIN CadastroCliente ON vagas_ocupadas.cliente_id = CadastroCliente.id
            WHERE CadastroCliente.avisado = 0
        `).all();

        // usando para repetir uma acao sem uma quantidade expecifica
        for (const cliente of clientes) {
            const resto = cliente.entrada + cliente.tempo - agora;

            if (resto < LIMITE_AVISO) {
                const telefone = '55' + cliente.telefone.replace(/\D/g, '');
                const texto = `Olá, ${cliente.nome}! Seu tempo no estacionamento está quase acabando. Se precisar de mais tempo, procure o atendente.`;

                await enviarMensagem(telefone, texto);

                db.prepare('UPDATE CadastroCliente SET avisado = 1 WHERE id = ?').run(cliente.id);
            }
        }
    } catch (erro) {
        console.log('ERRO REAL ao verificar avisos:', erro.message);
    }
}

setInterval(verificarAvisos, 30 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});







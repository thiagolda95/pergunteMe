const express = require("express");
const app = express();

//Importando body parser para tratar dados preenchidos pelo usuario
const bodyParser = require("body-parser");
const connection = require("./database/database")//bd
const Pergunta = require("./database/Pergunta");//model
const Resposta = require("./database/Resposta");//model

connection
.authenticate()
.then(()=>{
    console.log("Tamo on");
})
.catch((msgErro) => {
    console.log(msgErro);   
})


app.set('view engine', 'ejs');// Usando o ejs como view engine
app.use(express.static('public'));//Usando estáticos - css, img, etc

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) =>{
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']// ordenando por id e decrescente
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) =>{
    res.render("perguntar");
});

app.post("/salvarpergunta", (req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.desc;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/perguntar");
    })
});


app.get("/pergunta/:id", (req, res) =>{
    var id = req.params.id;
    Pergunta.findOne({
        where:{ id: id}    
    }).then(pergunta =>{
        if(pergunta != undefined){//achou a pergunta

        Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order: [['id', 'DESC']
            ]
        }).then(respostas =>{
            res.render("pergunta",{
                pergunta: pergunta,
                respostas: respostas
            });
        });
        }else{//não encontrada
            res.render("/");
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo : corpo,
        perguntaId : perguntaId

    }).then(()=>{
        res.redirect("/pergunta/" + perguntaId);

    });
});


app.listen(8000, ()=>{
    console.log("Está rodando");
}); 
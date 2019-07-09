const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {user, tournament, couple, partido} = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require(__dirname + '/../config/config.json');


const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(sendgridTransport({

  auth: {
    
    api_key: config.sendgridKey
  }
}));

//Comprobamos que no este duplicado el correo

exports.preSignUp = (req, res, next) => {

    
    

    user.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user){
            res.status(409).json({error: "Email en uso"});
            return;
        }
        
        next();

    })
    .catch(err => console.log(err));

};

//POST del registro de usuarios

exports.postSignup = (req, res, next) => {

    if(!req.body.email){
        return res.status(400).json({error: "Falta el email"});
    }

    if(!req.body.password1 || !req.body.password2){
        return res.status(400).json({error: "Falta la contraseña"});
    }

    if(req.body.password1 != req.body.password2){
        return res.status(400).json({error:"Las contraseñas no coinciden"});
    }

    if(!req.body.name){
        return res.status(400).json({error: "Falta el nombre"});
    }

    if(!req.body.lastname){
        return res.status(400).json({error: "Faltan los lastname"});
    }

    user.create({
        name: req.body.name.trim() || "",
        lastname: req.body.lastname,
        email:req.body.email.toLowerCase(),
        password: bcrypt.hashSync(req.body.password1,10)

    })
    .then(user => {

        //Enviar correo cuando se registra
        // transporter.sendMail({
        //     to:user.email,
        //     from: 'tfg@padel.com',
        //     subject:'TFG PÁDEL',
        //     html:'<h1> Te acabas de registrar en TFG de Pádel</h1>'
        // })

        return res.status(201).json({msg: "Registrado con éxito", user: user});
    })
    .catch(err => {
        return res.status(500).json({error: err});
    })
};

//POST del login de usuarios

exports.postSignIn = (req,res,next) => {

    if(!req.body.email){
        return res.status(400).json({error: "No ha enviado ningún correo."})
    }
    
    user.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {

        if (!user){
           return res.status(404).json({msg:"El correo no existe"});
        }
        if(!req.body.password){
            return res.status(400).json({error:"No enviaste ningúna contraseña"});
        }
        
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if(!validPassword) {
            return res.status(401).json({msg: "Contraseña incorrecta"});
        }

        //Secreto importarlo desde .config por ejemplo
        const token = jwt.sign({id: user.id}, config.jwtSecret, {
            expiresIn: 24 * 60 * 1000

        });

       return res.status(200).json({authenticated: true, token: token});


    })
    .catch(err => {
        return res.status(500).json({error: err});
    })

};

exports.verifyToken = (req,res, next) => {
    
    //Comprobar el token
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(400).json({
            error:"No enviaste ningún token"
        })
    }


    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if(err){
            return res.status(400).json({error: "El token no es válido"});
        }
        req.userId = decoded.id;

        user.findOne({
            where: {
                id: req.userId
            }
        })
        .then(user => {
        req.user = user;
        });


        next();
    })

};

exports.isAdmin = (req, res, next) => {

    
    //Buscamos el torneo y comprobamos
    tournament.findOne({
        where: {
            id: req.params.tournamentId
        }
    })
    .then(tournament => {
        if(!tournament){

            return res.status(404).json({error: 'El id del torneo que busca no existe'});
        
        } else if( tournament.adminId !== req.userId){

            return res.status(403).json({error: 'Usted no es el administrador de este torneo'});

        }
        req.tourney = tournament;
        next();

    })
    .catch(err => {
        return res.status(500).json({error: err});
    })

};

//Si es public pasa y si es privado tiene que estar en una pareja que pertenezca a ese torneo
exports.isPlayerTournament = async (req, res, next) => {

    if(req.params.tournamentId == null){
        return res.status(400).json({error: "El id insertado de torneo no es correcto"})
    }
    //Coger las parejas que tiene el user(user1Id) y ver
    // si alguna de las que pertence esta el torneo, si esta next, si no error

    pareja = await couple.findOne({where:
    {
        [Op.or]: [{user1Id:req.userId}, {user2Id:req.userId}],
          tournamentId: req.params.tournamentId
    }});
    
    tourney = await tournament.findOne({where:
    {
        id: req.params.tournamentId
    }});
    
    if(!tourney ){
        return res.status(400).json({error: "No existe un torneo con este id"});
    }

    if(tourney.publico == true){
        req.tourney = tourney;
       return next();
    }

    if (pareja != null && pareja.tournamentId == req.params.tournamentId){
        req.tourney = tourney;
        req.parejaUsuario = pareja;
        return next();
    }

    return res.status(401).json({error: "Usted no pertenece a este torneo"});


};

//Verificar que pertenece a un partido
exports.isPlayerPartido = async (req, res, next) => {
    
    if(req.params.partidoId == null){
        return res.status(400).json({error:"El id de partido no es correcto"})
    }

    match = await partido.findOne({where:
    {
        id: req.params.partidoId
    }});

    if(match == null){
        return res.status(400).json({error:"No existe ningún partido con ese id"})
    }

    //Coger los 2 ids de las dos parejas del partido
    couple1 = await couple.findOne({where:
    {
        id: match.couple1Id
    }})

    //Ver si es de la couple1, si esta next() si no ver si esta en la couple2
    //metemos la pareja en req.couple para el siguiente controller
    if(couple1.user1Id == req.userId || couple1.user2Id == req.userId){
        req.couple = couple1;
        return next();
    }

    couple2 = await couple.findOne({where: {
        id: match.couple2Id
    }});

    if(couple2.user1Id == req.userId || couple2.user2Id == req.userId){
        req.couple = couple2;
        return next();
    }

    return res.status(403).json({error:"Usted no jugó este partido"});

};


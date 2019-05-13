const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {user, tournament, couple} = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//Comprobamos que no este duplicado el correo

exports.preSignUp = (req, res, next) => {

    user.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user){
            res.status(500).json("Email en uso");
            return;
        }
        console.log("aaa");
        next();

    })
    .catch(err => console.log(err));

};

//POST del registro de usuarios

exports.postSignup = (req, res, next) => {

    user.create({
        name: req.body.name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password,10)

    })
    .then(user => {
        res.json({msg: "registrado con exito"});
    })
    .catch(err => {
        res.json({error: err});
    })
};

//POST del login de usuarios

exports.postSignIn = (req,res,next) => {
    
    user.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {

        if (!user){
           return res.status(404).json({msg:"El correo no existe"});
        }
        
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if(!validPassword) {
            return res.json({msg: "Contraseña incorrecta"});
        }

        const token = jwt.sign({user: user}, "secreto", {
            expiresIn: 24 * 60 * 1000

        });

        res.json({authenticated: true, token: token});


    })
    .catch(err => {
        res.json({error: err});
    })

};

exports.verifyToken = (req,res, next) => {
    
    //Comprobar el token
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.json({
            msg:"No enviaste ningún token"
        })
    }


    jwt.verify(token, "secreto", (err, decoded) => {
        if(err){
            return res.json({msg: "El token no es válido"});
        }
        req.userId = decoded.user.id;
        

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

            return res.status(404).json({msg: 'El id del torneo que busca no existe'});
        
        } else if( tournament.adminId !== req.userId){

            return res.status(404).json({msg: 'Usted no es el administrador de este torneo'});

        }
        console.log("pasa pora aqui?");
        next();

    })
    .catch(err => console.log(err));


};

//Si es public pasa y si es privado tiene que estar en una pareja que pertenezca a ese torneo
exports.isPlayer = async (req, res, next) => {

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
    }})

    if(tourney == null){
        return res.status(400).json({erro: "No existe un torneo con este id"});
    }

    if(pareja != null && tourney.publico == true){
       return next();
    }

    if (pareja != null && pareja.tournamentId == req.params.tournamentId){
        return next();
    }

    return res.status(400).json({error: "Usted no pertenece a este torneo"});


};


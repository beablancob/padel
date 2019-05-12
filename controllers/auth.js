const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {user, tournament} = require('../models/index');

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
           return res.status(404).json({msg:"el correo no existe"});
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
    

    const token = req.headers['x-access-token'];

    if (!token) {
        return res.json({
            msg:"No enviaste ningun token"
        })
    }

    jwt.verify(token, "secreto", (err, decoded) => {
        if(err){
            return res.json({msg: "token invalido"});
        }
        req.userId = decoded.user.id;
        

        next();
    })

};

exports.isAdmin = (req, res, next) => {

    

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


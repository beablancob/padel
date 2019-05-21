const {user, tournament, couple, partido, couplePreviousRound} = require('../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userController = require('../controllers/user');

const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(sendgridTransport({

  auth: {
    
    api_key:'tuclave'
  }
}));



//Obtener torneos 
 exports.getTournaments = async (req, res, next) => {

    if(req.query.publico == "true"){

    tournament.findAll({
        where: {
            
            publico: true

        }
    }).then(torneosPublicos => {

        if(torneosPublicos.length == 0){
            return res.status(200).json({mensaje: "No hay ningún torneo público"})
        }else{
            return res.status(200).json({tournaments: torneosPublicos});
        }
    }).catch(err => {
        return res.status(400).json({error: err});

    })

    }else{

    

//     //Cojo parejas en las que estoy
const parejasQueEstoy = await couple.findAll({where:{
    [Op.or]: [{user1Id: req.userId}, {user2Id: req.userId}]

}
});

if(parejasQueEstoy.length == 0){
  return res.status(200).json({msg: "No pertenece a ningún torneo"});
}

let idsTorneos = [];

//Por cada pareja en la que estoy selecciono el id del torneo al que pertenece 
for(p of parejasQueEstoy){
  idsTorneos.push(p.tournamentId);
};

//Busco los torneos en los que estoy con los ids de las parejas de antes
 const torneosQueEstoy = await tournament.findAll({where:{
   id:{
    [Op.or]: [idsTorneos]

   }
 }
});

return res.status(200).json({tournaments: torneosQueEstoy, couples: parejasQueEstoy});
    }
    };

//Obtener datos torneo
exports.getTournament = async (req, res, next) => {
    
    //Buscamos el torneo
    tourney = await tournament.findOne({where:
    {
        id:req.params.tournamentId
    }, include:[couple]

});

//Obtener los nombres y los correos de los jugadores que forman las parejas
         nombresDelTorneo = [];
for(c of tourney.couples){

    user1 = await user.findOne({where:{
      id: c.user1Id
    }});
    user2 = await user.findOne({where:{
      id: c.user2Id
    }});
    nombresDelTorneo.push(c.id,user1.name + " " + user1.apellidos);
    nombresDelTorneo.push( user2.name + " " + user2.apellidos);

}

    
    
    return res.status(200).json({tournament: tourney,nombres:nombresDelTorneo });

};

exports.editResultPartido = async(req, res, next) => {


    //Buscar partido
    match = await partido.findOne({where:
    {
        id: req.params.partidoId
    }});

    if(match.jugado == true){
        return res.status(400).json({error:"El resultado ya fue confirmado"});
    }

    tourney = await tournament.findOne({where:
    {
        id: match.tournamentId
    }})

    //Ver que modificamos un partido de la ronda actual
    if(tourney.rondaActual != match.numeroRonda){
        return res.status(400).json({error:"No puedes modificar un resultado de una ronda que no es la actual"});
    }

    const sets = req.body.sets;

  //Obtener los sets del body y añadirselos al partido
  //Comprobar que hay 6 sets y que ninguno es nulo
  if(Object.keys(sets).length != 6){
    return res.status(400).json({error: "El numero de sets total no es correcto"})
  }

  for(set of sets) {
    if(set == null ){
      return res.status(400).json({error: "Error en un set"});
    }

  }

  let juegospareja1 = sets[0]+sets[1]+sets[2];
  let juegospareja2 = sets[3]+sets[4]+sets[5];

  if(juegospareja1 === juegospareja2){
    return res.status(400).json({error: "Error en los juegos introducidos"})
  }
  
  //Sets pareja 1
  set1Couple1 = sets[0];
  set2Couple1 = sets[1];
  set3Couple1 = sets[2];
  //Sets pareja 2
  set1Couple2 = sets[3];
  set2Couple2 = sets[4];
  set3Couple2 = sets[5];

  //Actualizar los sets del partidos con los datos de la req
  match.set1Couple1 = set1Couple1;
  match.set2Couple1 = set2Couple1;
  match.set3Couple1 = set3Couple1;
  match.set1Couple2 = set1Couple2;
  match.set2Couple2 = set2Couple2;
  match.set3Couple2 = set3Couple2;
    
  //Vemos quien gana

  if(juegospareja1 > juegospareja2){
    match.ganador = match.couple1Id;
    

  }else {
    match.ganador = match.couple2Id;
  }

    //Poner que pareja ha editado el partido
    match.coupleEditedId = req.couple.id;
    console.log(match.coupleEditedId);


  //No ponemos true en este metodo, si en confirmar
  //partido.jugado = true;
  //Una vez añadido el resultado lo guardamos en la bbdd
  await match.save();

  //Enviar correo para a la otra pareja para confirmar el resultado

  //Obtener la pareja a la que enviar el correo
//   if(match.couple1Id == req.couple.id){
//       confirmCoupleId = match.couple2Id;
//   }else{
//       confirmCoupleId = match.couple1Id;
//   }

//   confirmCouple = await couple.findOne({where:{
//       id: confirmCoupleId
//   }})

//   //Buscar el correo de los 2 jugadores
//   user1 = await user.findOne({where:{
//       id: confirmCouple.user1Id
//   }});

//   user2 = await user.findOne({where:{
//     id: confirmCouple.user2Id
// }});

// emails = [user1.email,user2.email];

//   transporter.sendMail({
//     to:emails,
//     from: 'tfg@padel.com',
//     subject:'TFG PÁDEL',
//     html:'<h1> Puedes confirmar el partido</h1>'
// })

  
 //Devolvemos el partido con los datos actualizados
    return res.status(200).json({edited:"true",partido: match})



};

exports.confirmResultPartido = async(req, res, next) => {

    match = await partido.findOne({where:
        {
            id: req.params.partidoId
        }});

        tourney = await tournament.findOne({where:{
        id: match.tournamentId
    }})

    
    
    //Como pasamos antes el middleware de isPlayingPartido,
    //solo comprobamos que no sea el mismo id que coupleEditedId
    console.log(req.couple.id);
    if(req.couple.id != match.coupleEditedId && match.jugado != true){
        
        //Ponemos el partido como jugado
        match.jugado = true;
        match.save();

          //Cogemos las 2 parejas y actualizamos valores

        couple1 = await couple.findOne({where:{
            id: match.couple1Id
        }});
      
        couple2 = await couple.findOne({where:{
            id: match.couple2Id
        }});

        let juegospareja1 = match.set1Couple1+match.set2Couple1+match.set3Couple1;
        let juegospareja2 = match.set1Couple2+match.set2Couple2+match.set3Couple2;


  //Actualizar partidos jugados
  couple1.partidosJugados = couple1.partidosJugados + 1;
  couple2.partidosJugados = couple2.partidosJugados + 1;

  if( match.set1Couple1 > match.set1Couple2){
    couple1.setsGanados = couple1.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets + 1;
    couple2.setsPerdidos = couple2.setsPerdidos + 1;
    couple2.diferenciaSets = couple2.diferenciaSets - 1;
    
    
  } else{
    couple1.setsPerdidos = couple1.setsPerdidos + 1;
    couple2.setsGanados = couple2.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets - 1;
    couple2.diferenciaSets = couple2.diferenciaSets + 1;
  }
  //Set 2
  if( match.set2Couple1 > match.set2Couple2){
    couple1.setsGanados = couple1.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets + 1;
    couple2.setsPerdidos = couple2.setsPerdidos + 1;
    couple2.diferenciaSets = couple2.diferenciaSets - 1;
   
 } else{
    couple1.setsPerdidos = couple1.setsPerdidos + 1;
   couple2.setsGanados = couple2.setsGanados + 1;
   couple1.diferenciaSets = couple1.diferenciaSets - 1;
   couple2.diferenciaSets = couple2.diferenciaSets + 1;
 }
 //Set 3
 if( match.set3Couple1 > match.set3Couple2){
     
    couple1.setsGanados = couple1.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets + 1;
    couple2.setsPerdidos = couple2.setsPerdidos + 1;
    couple2.diferenciaSets = couple2.diferenciaSets - 1;
   
 } else if (match.set3Couple1 < match.set3Couple2){
    couple1.setsPerdidos = couple1.setsPerdidos + 1;
   couple2.setsGanados = couple2.setsGanados + 1;
   couple1.diferenciaSets = couple1.diferenciaSets - 1;
   couple2.diferenciaSets = couple2.diferenciaSets + 1;
 }


 //Actualizar partidos ganados y partidos perdidos 
 if(juegospareja1 > juegospareja2){
    match.ganador = match.couple1Id;
    couple1.partidosGanados = couple1.partidosGanados + 1;
    couple2.partidosPerdidos = couple2.partidosPerdidos + 1;

    //Actualizar puntos
    couple1.puntos = couple1.puntos + tourney.puntosPG;
    couple2.puntos = couple2.puntos + tourney.puntosPP;

    

  }else {
    match.ganador = match.couple2Id;

    couple1.partidosPerdidos = couple1.partidosPerdidos + 1;
    couple2.partidosGanados = couple2.partidosGanados + 1;

    couple1.puntos = couple1.puntos + tourney.puntosPP;
    couple2.puntos = couple2.puntos + tourney.puntosPG;

  }

  couple1.juegosGanados = couple1.juegosGanados + juegospareja1;
  couple2.juegosGanados = couple2.juegosGanados + juegospareja2;
  couple1.juegosPerdidos = couple1.juegosPerdidos + juegospareja2;
  couple2.juegosPerdidos = couple2.juegosPerdidos + juegospareja1;
  //Actualizar diferencia y diferencia de juegos

  couple1.diferenciaJuegos = couple1.diferenciaJuegos + (juegospareja1 - juegospareja2);
  couple2.diferenciaJuegos = couple2.diferenciaJuegos + (juegospareja2 - juegospareja1);

 //Guardamos en la bbdd
 await couple1.save();
 await couple2.save();


//Enviar correo una vez confirmado a la pareja que editó

// editedCouple = await couple.findOne({where:{
//     id: match.coupleEditedId
// }})

// //Buscar el correo de los 2 jugadores
// user1 = await user.findOne({where:{
//     id: editedCouple.user1Id
// }});

// user2 = await user.findOne({where:{
//   id: editedCouple.user2Id
// }});

// emails = [user1.email,user2.email];

// transporter.sendMail({
//   to:emails,
//   from: 'tfg@padel.com',
//   subject:'TFG PÁDEL',
//   html:'<h1> El resultado fue confirmado</h1>'
// })

        

        return res.status(200).json({confirmed: "true", partido: match});
        
    }

    return res.status(401).json({error:"Tiene que confirmar un miembro de la otra pareja el resultado"});       

};

exports.editInfo = async(req, res, next) => {

    if(!req.params.userId){
        return res.status(400).json({error:"No envió el id de usuario"})
    }

    if(req.params.userId != req.userId){
        return res.status(403).json({error:"El id de usuario no es el suyo"})
    }
    
    
  u = await user.findOne({where:{
    id: req.userId
    }});

    if(req.body.password1 && req.body.password2 && req.body.password1 != req.body.password2){
        return res.status(400).json({error:"Fallo en las contraseñas"})
    }

    //Si envia password encriptarlo con bcrypt
    if(req.body.password){
    req.body.password = await bcrypt.hashSync(req.body.password,10);
    }


u.email = (req.body.email || u.email).trim().toLowerCase();
u.name = req.body.name || u.name;
u.apellidos = req.body.apellidos || u.apellidos;
u.password = req.body.password || u.password;

u.save();


//Crear nuevo token
const newToken = await jwt.sign({user: u}, "secreto", {
    expiresIn: 24 * 60 * 1000

});



return res.status(200).json({edited: true,user: u, newToken: newToken });
    


};

exports.tournamentRegister = async(req, res, next) => {
    
    if(!req.params.registerCode){
        return res.status(400).json({error: "No envió un link de torneo"})
    }
    //Buscamos el torneo con el parametro registerCode
    tourney = await tournament.findOne({where:{
        registerCode: req.params.registerCode }});

    if(!tourney){
        return res.status(400).json({error: "No existe ningun torneo con ese id"})
        
    }
    if(tourney.rondaActual != 0){
        return res.status(403).json({error: "El torneo ya ha comenzado"})
    }

    //Vemos si ya estamos registrados en el torneo
    coup = await couple.findOne({where:{
        tournamentId: tourney.id,
        [Op.or]: [{user1Id: req.userId}, {user2Id: req.userId}]

    }

    })

    //Si estamos registrados devolver la pareja
    if(coup){
        return res.status(403).json({error:"Ya está registrado en este torneo", couple:coup})
    }

 
    //Creamos la pareja de ese torneo
    if(req.body.emailUser2){

        //Buscar usuario de nuestra pareja
        user2 = await user.findOne({where:{
            email: req.body.emailUser2
        }})

        if(!user2){
            return res.status(400).json({error:"No existe ningún usuario con ese email"})
        }

        coup2 = await couple.findOne({where:{
            tournamentId: tourney.id,
            [Op.or]: [{user1Id: user2.id}, {user2Id: user2.id}]
    
        }
    
        })
        
        if(coup2){
            return res.status(400).json({error:"Su compañero ya está registrado"});

        }

        c = await couple.create({
            tournamentId: tourney.id,
            user1Id: req.userId,
            user2Id: user2.id
        }
        )

        return res.status(201).json({registered:true, couple:c});


    }
    return res.status(400).json({error: "No envió el email de su pareja"})


};

//Obtener una ronda en concreto
exports.getRondaInfo = async(req, res, next) => {


    if(!req.params.numeroRonda){
        return res.status(400).json({error: "No ha indicado la ronda que busca"});
    }

    if(req.params.numeroRonda < 1 || req.params.numeroRonda > req.tourney.rondaActual){
        return res.status(400).json({error: "El número de la ronda no es correcto"});
    }

    //Si es la ronda actual cogemos couples y los partidos de ahora
    if(req.tourney.rondaActual == req.params.numeroRonda){
        parejas = await tourney.getCouples({order: [
            ['grupo','ASC'],
            ['puntos', 'DESC'],
            ['diferenciaSets', 'DESC'],
            ['diferenciaJuegos', 'DESC']
          ]});

          //Obtener los nombres y los correos de los jugadores que forman las parejas
         nombresDelTorneo = [];
          for(p of parejas){

            user1 = await user.findOne({where:{
              id: p.user1Id
            }});
            user2 = await user.findOne({where:{
              id: p.user2Id
            }});
            nombresDelTorneo.push(p.id,user1.name + " " + user1.apellidos);
            nombresDelTorneo.push( user2.name + " " + user2.apellidos);

      }

        
        partidos = await tourney.getPartidos({where:
        {
            numeroRonda: tourney.rondaActual
        }})


        return res.status(200).json({parejas: parejas, partidos:partidos, nombres: nombresDelTorneo })
    }

    //Si no es la ronda actual coger las parejas de previousCouples
    parejas = await tourney.getCouplePreviousRounds({where:{
        round: req.params.numeroRonda

         }, order: [
        ['grupo','ASC'],
        ['puntos', 'DESC'],
        ['diferenciaSets', 'DESC'],
        ['diferenciaJuegos', 'DESC']
         ]
            });
    partidos = await tourney.getPartidos({where:{
        numeroRonda: req.params.numeroRonda
    }})
    return res.status(200).json({parejas: parejas, partidos:partidos })

    

};

exports.deleteUser = async(req,res) => {

    if(!req.params.userId){
        return res.status(400).json({error:"No envió el id de usuario"})
    }

    if(req.params.userId != req.userId){
        return res.status(403).json({error:"El id de usuario no es el suyo"})
    }

    u = await user.findOne({where: {
        id: req.userId
    }});
    u.destroy();

    return res.status(200).json({deleted: true});

};

 exports.deleteCouple = async(req, res) => {

    if(!req.params.coupleId){
        return res.status(400).json({error: "No envío el id de ninguna pareja"});
    }

    c = await couple.findById(req.params.coupleId);

    if(c){
        tourney = await tournament.findById(c.tournamentId);

        if((c.user1Id == req.userId || c.user2Id == req.userId) && tourney.rondaActual == 0){
            c.destroy();
            return res.status(200).json({deleted: "true"});
        }
        return res.status(400).json({error: "La pareja no es suya"});
    }
    return res.status(400).json({error: "No existe la pareja"});

 };


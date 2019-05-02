const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Combinatorics = require('js-combinatorics');
const {user, tournament, couple, partido} = require('../models/index');

//Crear torneo
exports.postTournament = (req,res,next) => {
    const name = req.body.name;
    const numberCouples = req.body.numberCouples;
    user.findById(req.userId)
    .then(user => {
        tournament.create({
            name: name,
            numberCouples: numberCouples,
            adminId: req.userId
        }).then(tournament => {
            res.status(201).json({msg:"Torneo creado con éxtio",
            tournament: tournament
        });
        })
    })
    .catch(err => console.log(err));
};

//Obetener torneos de los que soy admin

exports.getTournaments = (req, res, next) => {
    tournament.findAll({
        where: {
            adminId: req.userId
        }
    }).then(tournaments => {
        res.status(200).json({tournaments: tournaments})
    })
    .catch(err => console.log(err));

};

//eliminar torneo

exports.deleteTournament = (req, res, next) => {
    tournamentId = req.params.tournamentId;
    tournament.destroy({
        where: {
            adminId: req.userId,
            id: tournamentId
        }
    }).then((a) => {
        if(a){
        return res.status(201).json({msg: "Torneo eliminado"})}
        else{
            return res.status(201).json({msg: "No es el admin de este torneo o ya fue eliminado"})
        }
    }).catch(err => console.log(err));

};

// Obtener datos de torneo que soy admin
exports.getTournament = (req,res,next) => {
    tournament.findOne({
        where: {
            id: req.params.tournamentId,
            adminId: req.userId
        }, include:[couple]
    })
    .then(tournament => {
        if(tournament && tournament.adminId === req.userId){
        res.status(200).json({msg: 'Correcto', tournament: tournament});}
        else {
            res.status(400).json({msg: 'El torneo no existe o no es usted admin'})
        }
    })
    .catch(err => {
        console.log(err);
    });

};

// Añadir pareja a torneo que soy admin

exports.putAddCouple = (req, res, next) => {
   
   
    //Buscar usuario1
    user.findOne({
        where: {
            email: req.body.emailUser1
        }
    }).then(user => {

        if(!user) {
            return res.status(404).json({error: "El correo del jugador 1 no está registrado"});

        };
        
        req.user1Id = user.id;

        

    }).then(() =>{

        //Buscar usuario 2
        user.findOne({
            where: {
                email: req.body.emailUser2
            }
        }).then(user => {
    
            if(!user) {
                return res.status(404).json({error: "El correo del jugador 2 no está registrado"});
    
            };
    
            req.user2Id = user.id;

        }).then(() => {


            couple.create({
                user1Id: req.user1Id,
                user2Id: req.user2Id,
                tournamentId: parseInt(req.params.tournamentId)
            })
            .then(couple => {
                
                if(couple.user1Id && couple.user2Id){
                return res.status(201).json({msg:'Añadida correctamente',
                                            couple: couple});
                };
                
        })
    
        })
        
        .catch(err => {
            console.log(err);
        });

    })
    
};

// Eliminar pareja de torneo del que soy admin

exports.deleteCouple = (req, res, next) => {
    
    couple.findById(req.params.coupleId)
    .then(couple => {


        if(couple && couple.tournamentId == req.params.tournamentId){
            
            couple.destroy()
            .then(couple => {
                
                 return res.json({msg: 'Pareja eliminada correctamente'});
            })
        }else {
            return res.json({msg: 'La pareja no es suya'});
        } 
    })
    .catch(err => console.log(err));
};

exports.editTournament = async (req, res, next) => {

    const t = await tournament.findById(req.params.tournamentId);

    if(t.rondaActual == 0){
        t.update({
            name: req.body.name 
        })
    }else {
        return res.json("El torneo ya está en curso");
    }
    
    return res.json({tournament: t});

};

exports.startTournament = async (req, res, next) => {

    
       const tourney = await tournament.findById(req.params.tournamentId);

       if(tourney.rondaActual != 0) {
           return res.status(500).json({error: "El torneo ya está empezado"});
           
       }

       tourney.rondaActual=1;
       tourney.save();
       console.log(tourney.rondaActual);

       // Si le pasamos el orden de los grupos ejecuta el if sino el else
       let order = req.body.order;
       //console.log(order);
       let couples = [];
       if(order != null){
           
           for(id of order)
           {
               let pareja = null;
               pareja = await couple.findById(id);
               await couples.push(pareja);
            
           }
           const numeroParejas = await Object.keys(couples).length;

       }else{
      
       const result = await couple.findAndCountAll(
          {
            where: 
           { tournamentId: tourney.id}
          }
        );
         couples = await result.rows;

        
        const numeroParejas = await result.count;


        }
        console.log(couples[2].id);
        console.log(Object.keys(couples).length);
        
        let j = 0;
        
        while( Object.keys(couples).length > 0){
          //console.log("aaa");
          
          parejas = couples.slice(0, tourney.parejasPorGrupo);
          for (p of parejas){
              p.grupoActual = j;
             await p.save();


          }
          //console.log(parejas);
          cmb = Combinatorics.combination(parejas,2);
          while(a = cmb.next()){
            //console.log(a[0].id, a[1].id);
            if(tourney.idaYvuelta == false){

           await partido.create({
              numeroRonda:1,
              numeroGrupo:j,
              couple1Id:a[0].id,
              couple2Id:a[1].id
      
      
            }).then(p => {
              tourney.addPartido(p).then(result => {
                console.log("Partido añadido");
              }
      
              )
            })
        } else {

          await  partido.bulkCreate([{
                numeroRonda:1,
                numeroGrupo:j,
                couple1Id:a[0].id,
                couple2Id:a[1].id
        
        
              },
            {
                numeroRonda:1,
                numeroGrupo:j,
                couple1Id:a[1].id,
                couple2Id:a[0].id 
            }]).then(p => {
                tourney.addPartidos(p).then(result => {
                  console.log("Partido añadido");
                }
        
                )
              })

        }
          }
          j++;
          for (let i = 0; i < tourney.parejasPorGrupo; i++){
          couples.shift();
          
          }

      
      };

      tourney.getPartidos()
        .then((partidos) => {
            return res.status(200).json({partidos: partidos});

        }).catch(err => {
            return res.status(500).json({error: err});

        })

    
};

exports.editResult = async (req, res, next) => {
    
  const tourney = await tournament.findById(req.params.tournamentId);
  const partidos = await tourney.getPartidos({
    where: {
      //id del partido req.body.partidoId
      id: req.params.partidoId
    }
  });
  //console.log(partido[0].numeroRonda);
  const partido = partidos[0];
  //req.body.sets
  
  
  //Impedir modificacion si ya se avanzo de ronda
  if(tourney.rondaActual != partido.numeroRonda){
    return res.status(400).json({error: "No puedes modificar resultado de una ronda ya pasada"})
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

  //Actualizar resultados
  partido.set1Couple1 = set1Couple1;
  partido.set2Couple1 = set2Couple1;
  partido.set3Couple1 = set3Couple1;
  partido.set1Couple2 = set1Couple2;
  partido.set2Couple2 = set2Couple2;
  partido.set3Couple2 = set3Couple2;
  
  //Vemos quien gana
  
  if(juegospareja1 > juegospareja2){
    partido.ganador = partido.couple1Id;

  }else {
    partido.ganador = partido.couple2Id;
  }
  partido.jugado = true;

  await partido.save();
 //Devolvemos el partido
  return res.status(200).json({partido: partido})

};

// exports.nextRoundTournament() = async (req,res,next) => {

//     let grupos = [];
//     const tourney = await tournament.findById(req.params.tournamentId);
//     const partidosRondaActual = await tournament.getPartidos({
//         where: {
//         numeroRonda: tourney.rondaActual
//         }
//     });

//     // Comprobar que se han jugado todos los partidos de la ronda para avanzar a la siguiente
//     for(p of partidosRondaActual){
//         if (p.ganador == null){
//             return res.status(400).json({error: "Quedan partidos por jugar esta ronda"});
//         }
//         if(grupos.indexOf(p.numeroGrupo) === -1){
//             grupos.push(p.numeroGrupo);
//         }

//     }

//     const parejas = await tournament.getCouples();
  

// };

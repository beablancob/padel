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
           return res.status(400).json({error: "el torneo ya está empezado"});
           
       }

       tourney.rondaActual=1;
       tourney.save();
       console.log(tourney.rondaActual);
      
       const result = await couple.findAndCountAll(
          {
            where: 
           { tournamentId: tourney.id}
          }
        );
        const couples = await result.rows;
        const numeroParejas = await result.count;
      
        
        //console.log(Object.keys(couples).length);
        
        let j = 0;
      
        while( Object.keys(couples).length > 0){
          console.log("aaa");
          
          parejas = couples.slice(0, tourney.parejasPorGrupo);
          //console.log(parejas);
          cmb = Combinatorics.combination(parejas,2);
          while(a = cmb.next()){
            //console.log(a[0].id, a[1].id);
            if(tourney.idaYvuelta == false){

           await partido.create({
              numeroRonda:0,
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
                numeroRonda:0,
                numeroGrupo:j,
                couple1Id:a[0].id,
                couple2Id:a[1].id
        
        
              },
            {
                numeroRonda:0,
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
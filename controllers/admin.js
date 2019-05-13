const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Combinatorics = require('js-combinatorics');
const {user, tournament, couple, partido, couplePreviousRound} = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

//Dar inicio a la primera ronda de un torneo
exports.startTournament = async (req, res, next) => {


       const tourney = await tournament.findById(req.params.tournamentId);

       if(tourney.rondaActual != 0) {
           return res.status(500).json({error: "El torneo ya está empezado"});
           
       }

       tourney.rondaActual=1;
       tourney.save();
       //console.log(tourney.rondaActual);

       // Si le pasamos el orden de los grupos ejecuta el if 
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

       } else{
      
       const result = await couple.findAndCountAll(
          {
            where: 
           { tournamentId: tourney.id}
          }
        );
         couples = await result.rows;

        
        const numeroParejas = await result.count;


        }
        //console.log(couples[2].id);
        //console.log(Object.keys(couples).length);
        
        let j = 0;
        
        //Mientras que queden parejas del torneo sin meter en grupo 
        while( Object.keys(couples).length > 0){
          //console.log("aaa");
          
          //Agrupamos las parejas segun el torneo
          parejas = couples.slice(0, tourney.parejasPorGrupo);
          for (p of parejas){
              p.grupoActual = j;
             await p.save();


          }
          //console.log(parejas);
          //Usamos el paquete combinator para hacer los partidos
          cmb = Combinatorics.combination(parejas,2);
          while(a = cmb.next()){
            //console.log(a[0].id, a[1].id);
            //Vemos si el torneo esta puesto a ida y vuelta
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

          //Quitamos las parejas del grupo que hayamos creado de couples y pasamos al siguiente grupo con j++
          for (let i = 0; i < tourney.parejasPorGrupo; i++){
          couples.shift();
          
          }

      
      };

      //Devolvemos los partidos de la primera ronda
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

  //Cogemos los sets de la request
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
  //Una vez añadido el resultado lo guardamos en la bbdd
  await partido.save();

 //Devolvemos el partido con los datos actualizados
  return res.status(200).json({partido: partido})

};

exports.nextRound = async (req,res,next) => {

    let grupos = [];
    //req.params.tournamentId

    if(req.params.tournamentId == null){
        return res.status(400).json({error: "El id del torneo no es correcto"});
    }else{
        id = req.params.tournamentId;
    }


    const tourney = await tournament.findById(id);
    const partidosRondaActual = await tourney.getPartidos({
        where: {
        numeroRonda: tourney.rondaActual
        }
    });

    // Comprobar que se han jugado todos los partidos de la ronda para avanzar a la siguiente
    for(p of partidosRondaActual){
        if (p.ganador == null){
            return res.status(400).json({error: "Quedan partidos por jugar esta ronda"});
        }
        if(grupos.indexOf(p.numeroGrupo) === -1){
            grupos.push(p.numeroGrupo);
            
        }
    }
    console.log(grupos);
    
    if(tourney.rondaActual == 0 || tourney.rondaActual == tourney.numeroRondas){
      return res.status(400).json({error: "El torneo aun no ha comenzado o está en la ultima ronda"});
    }

    //Actualizamos todas los puntos y los juegos de las parejas del torneo
    const parejas = await tourney.getCouples({});
    console.log(Object.keys(parejas).length);

    //Para cada pareja del torneo obtenemos los partidos que ha jugado
    for (pareja of parejas){

      const partidosPareja = await partido.findAll({
        where:
        {
          [Op.or]: [{couple1Id:pareja.id}, {couple2Id:pareja.id}],
          tournamentId: tourney.id
        }
       });
       //console.log(partidosPareja);

       //Sumar los puntos, juegos y sets de esta ronda a los puntos de la pareja
       let puntos = pareja.puntos;
       let juegosGanados = pareja.juegosGanados;
       let juegosPerdidos = pareja.juegosPerdidos;
       let setsGanados = pareja.setsGanados;
       let setsPerdidos = pareja.setsPerdidos;
       let beforeJuegosGanados = pareja.juegosGanados;
       let beforeJuegosPerdidos = pareja.juegosPerdidos;
       let beforeSetsGanados = pareja.setsGanados;
       let beforeSetsPerdidos = pareja.setsPerdidos;



    //    console.log(puntos);
    //    console.log(juegosGanados);
    //    console.log(juegosPerdidos);
    //    console.log(setsGanados);
    //    console.log(setsPerdidos);
       for (p of partidosPareja){
        //console.log(p.ganador);
         //console.log(pareja)
         //Sumar puntos y partidos

         if(p.ganador == pareja.id){
           puntos = puntos +  tourney.puntosPG;
           pareja.partidosGanados = pareja.partidosGanados + 1;
           pareja.partidosJugados = pareja.partidosJugados + 1;

         }else{
           puntos = puntos + tourney.puntosPP;
           pareja.partidosPerdidos = pareja.partidosPerdidos + 1;
           pareja.partidosJugados = pareja.partidosJugados + 1;
         }

         //Sumar sets
         if(p.couple1Id == pareja.id){
           juegosGanados = juegosGanados + p.set1Couple1 + p.set2Couple1 + p.set3Couple1;
           juegosPerdidos = juegosPerdidos +p.set1Couple2 + p.set2Couple2 + p.set3Couple2;
           console.log(p.set1Couple1);
           console.log(juegosGanados);
           console.log(juegosPerdidos);

           //Vemos si ganamos el primer set o no. Asi con los 3 sets
           //Set 1
           if( p.set1Couple1 > p.set1Couple2){
             setsGanados = setsGanados + 1;
             
           } else{
            setsPerdidos = setsPerdidos + 1
           }
           //Set 2
           if( p.set2Couple1 > p.set2Couple2){
            setsGanados = setsGanados + 1;
            
          } else{
           setsPerdidos = setsPerdidos + 1
          }
          //Set 3
          if( p.set3Couple1 > p.set3Couple2){
            setsGanados = setsGanados + 1;
            
          } else{
           setsPerdidos = setsPerdidos + 1
          }


         }else {
          juegosPerdidos = juegosPerdidos + p.set1Couple1 + p.set2Couple1 + p.set3Couple1;
          juegosGanados = juegosGanados +p.set1Couple2 + p.set2Couple2 + p.set3Couple2;

          //Vemos si ganamos el primer set o no. Asi con los 3 sets
           //Set 1
           if( p.set1Couple2 > p.set1Couple1){
            setsGanados = setsGanados + 1;
            
          } else{
           setsPerdidos = setsPerdidos + 1
          }
          //Set 2
          if( p.set2Couple2 > p.set2Couple1){
           setsGanados = setsGanados + 1;
           
         } else{
          setsPerdidos = setsPerdidos + 1
         }
         //Set 3
         if( p.set3Couple2 > p.set3Couple1){
           setsGanados = setsGanados + 1;
           
         } else{
          setsPerdidos = setsPerdidos + 1
         }

         }


       }
       //console.log(puntos);
       //Añadimos los puntos, sets y juegos a las parejas y las actualizamos en la bbdd para cada pareja del torneo
        pareja.puntos = puntos;
        pareja.setsGanados = setsGanados;
        pareja.setsPerdidos = setsPerdidos;
        pareja.juegosGanados = juegosGanados;
        pareja.juegosPerdidos = juegosPerdidos;

        //Calculamos diferencia de sets y juegos esta ronda

        pareja.diferenciaSets = (pareja.setsGanados - beforeSetsGanados) - (pareja.setsPerdidos - beforeSetsPerdidos);
        pareja.diferenciaJuegos = (pareja.juegosGanados - beforeJuegosGanados) - (pareja.juegosPerdidos - beforeJuegosPerdidos);
        

       await pareja.save();

       await couplePreviousRound.create({
           coupleId: pareja.id,
           tournamentId: tourney.id,
           round: tourney.rondaActual,
           partidosJugados: pareja.partidosJugados,
           partidosGanados: pareja.partidosGanados,
           partidosPerdidos: pareja.partidosPerdidos,
           setsGanados: pareja.setsGanados,
           setsPerdidos: pareja.setsPerdidos,
           juegosGanados: pareja.juegosGanados,
           juegosPerdidos: pareja.juegosPerdidos,
           puntos: pareja.puntos,
           grupo: pareja.grupoActual,
           diferenciaSets: pareja.diferenciaSets,
           diferenciaJuegos: pareja.diferenciaJuegos

       })




    }

    //Ordenamos los grupos segun hayan quedado en esta ronda
    
    let gruposDeParejas = [];

    for (g of grupos){
      const parejas = await tourney.getCouples({
        where: {
          grupoActual: g
        },
        order: [
          ['puntos', 'DESC'],
          ['diferenciaSets', 'DESC'],
          ['diferenciaJuegos', 'DESC']
        ]
        
      });

      //console.log(parejas);
      
      
      gruposDeParejas[g] = [];

      //Meto las parejas de el array de modo que quede gruposDeParejas[g]=[ParejasGrupoG] ordenadas por puntos, diferencia de sets y juegos en caso de empates
      for (p of parejas){
      gruposDeParejas[g].push(p);
      console.log(p.id);
      }

    }
    let parejasQueBajan = [];
    let parejasQueSuben = [];

    //Cojo de cada grupo las parejas que suben y las que bajan dependiendo de los puntos, sets y juegos
    for(g in grupos){
      
      if(grupos.length == 1){
        break;
      }

      //Primer grupo no sube ninguna
      if(g == 0){
        parejasQueBajan = parejasQueBajan.concat(gruposDeParejas[g].slice(-(tourney.parejasSuben)));
        for(p of parejasQueBajan){
       //console.log(p.id);
      }
       continue;
      }
      
      //Ultimo grupo no baja ninguna
      if(g == grupos.length - 1){
        parejasQueSuben = parejasQueSuben.concat(gruposDeParejas[g].slice(0,tourney.parejasSuben));
        //console.log(numerosQueSuben);
        break;
      }

      

      parejasQueSuben = parejasQueSuben.concat(gruposDeParejas[g].slice(0,tourney.parejasSuben));
      parejasQueBajan = parejasQueBajan.concat(gruposDeParejas[g].slice(-(tourney.parejasSuben)));



    }
    //Junto todas las parejas en un array plano
    let parejasOrdenadasGrupos = gruposDeParejas.flat();
    //console.log(parejasOrdenadasGrupos);
    //console.log(parejasQueBajan);
    //console.log(parejasQueSuben);

    //Cojo los indices de las que suben y las que bajan y las intercambio una a una ya que estan ordenados los grupos una vez finalizados los partidos
    for (let i = 0; i < parejasQueBajan.length; i++) { 
      let indexBaja;
      let indexSube;
      //console.log(numerosQueBajan[i]);
      indexBaja = await parejasOrdenadasGrupos.findIndex( n => 
        n === parejasQueBajan[i]
        
      );
       indexSube = await parejasOrdenadasGrupos.findIndex(n => 
        n === parejasQueSuben[i]);
      //console.log(indexBaja);
      //console.log(indexSube);
      let parejaAux = parejasOrdenadasGrupos[indexBaja];
      parejasOrdenadasGrupos[indexBaja] = parejasQueSuben[i];
      parejasOrdenadasGrupos[indexSube] = parejaAux;
    
    }

    //console.log(parejasOrdenadasGrupos);
    for(p of parejasOrdenadasGrupos){
      console.log(p.id);
    }

    //Cogemos el metodo de iniciar el torneo (/start), la ultima parte, sino hay order
    let couples = [];
    couples = parejasOrdenadasGrupos;
    //la j llevara el numero del grupo
    

    //Avanzamos la ronda del torneo
    tourney.rondaActual = tourney.rondaActual + 1;
    tourney.save();
    let j = 0;
    while( Object.keys(couples).length > 0){
      //console.log("aaa");
      
      //Vamos cogiendo grupos de parejas con el numero de parejas por grupos y actualizamos grupo actual
      parejasPorGrupo = couples.slice(0, tourney.parejasPorGrupo);
      for (p of parejasPorGrupo){
          p.grupoActual = j;
         await p.save();


      }
      //console.log(parejas);

      //Hacemos las combinaciones
      cmb = Combinatorics.combination(parejasPorGrupo,2);
      while(a = cmb.next()){
        //console.log(a[0].id, a[1].id);

        //Vemos si hay uno 2 partidos si es ida y vuelta o no
        if(tourney.idaYvuelta == false){

       await partido.create({
          numeroRonda:tourney.rondaActual,
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
            numeroRonda:tourney.rondaActual,
            numeroGrupo:j,
            couple1Id:a[0].id,
            couple2Id:a[1].id
    
    
          },
        {
            numeroRonda:tourney.rondaActual,
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
      
      //Quitamos las parejas y avanzamos de grupo
      j++;
      for (let i = 0; i < tourney.parejasPorGrupo; i++){
      couples.shift();
      
      }

  
  };

  //Resetear diferencia de sets y juegos
 
  for (p of parejas){
      p.diferenciaJuegos  = 0;
      p.diferenciaSets = 0;
      p.save();
  }

    //Devolvemos los partidos de la ronda siguiente

    tourney.getPartidos({where:
    {
      numeroRonda: tourney.rondaActual
    }})
    .then((partidos) => {
        return res.status(200).json({partidos: partidos});

    }).catch(err => {
        return res.status(500).json({error: err});

    })
  

};

//Rondas pasadas
exports.previousRounds = async (req,res,next) => {

    
  tourney = await tournament.findById(req.params.tournamentId);

  let clasificacion = [];
  let grupos = [];


  for(let nRonda= 1; nRonda < tourney.rondaActual; nRonda++){
  
  

  parejasAnteriores = await tourney.getCouplePreviousRounds();

  //Cogemos los grupos de esa ronda
  for(p of parejasAnteriores){
    if(grupos.indexOf(p.grupo) === -1){
      grupos.push(p.grupo);
  
  }
  }
  

  //Ordenamos los grupos, orden ascendente [0,1,2,3..]
  grupos =  grupos.sort((a,b) => a-b);
  //console.log(grupos);

  
  clasificacion[nRonda] = [];

  //Vamos cogiendo los resultados de las parejas en rondas anteriores divididos por grupos y los partidos de esas rondas y esos grupos
  for(g of grupos){
   
    parejasGrupo = await tourney.getCouplePreviousRounds({where:
      {round: nRonda,
        grupo: g},
        order: [
          ['puntos', 'DESC'],
          ['diferenciaSets', 'DESC'],
          ['diferenciaJuegos', 'DESC']
        ]
      
    });

    partidosGrupo = await tourney.getPartidos({where:{
      numeroRonda:nRonda,
      numeroGrupo:g
    }});

    //Por ejemplo metemos en la ronda 1 el grupo 0
    //Las parejas de ronda 1 y grupo 0 estan en clasificacion[Ronda1][Grupo0][Parejas, Partidos]
    
    clasificacion[nRonda][g]=[];
    clasificacion[nRonda][g].push(parejasGrupo);
    clasificacion[nRonda][g].push(partidosGrupo);
    console.log(clasificacion[nRonda]);

  }

}

return res.status(200).json({clasificacion: clasificacion});


}





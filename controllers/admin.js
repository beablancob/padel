const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Combinatorics = require("js-combinatorics");
const {
  user,
  tournament,
  couple,
  partido,
  couplePreviousRound
} = require("../models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const config = require(__dirname + "/../config/config.json");

const sendgridTransport = require("nodemailer-sendgrid-transport");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.sendgridKey
    }
  })
);

//Crear torneo
exports.postTournament = (req, res, next) => {
  const name = req.body.name || "Torneo de " + req.user.name;
  const numeroParejas = req.body.numeroParejas;
  user
    .findById(req.userId)
    .then(user => {
      tournament
        .create({
          name: name,
          numeroParejas: numeroParejas,
          adminId: req.userId,
          parejasPorGrupo: req.body.parejasPorGrupo,
          publico: req.body.publico,
          puntosPG: req.body.puntosPG,
          puntosPP: req.body.puntosPP,
          idaYvuelta: req.body.idaYvuelta,
          numeroRondas: req.body.numeroRondas,
          parejasSuben: req.body.parejasSuben
        })
        .then(tournament => {
          res
            .status(201)
            .json({ msg: "Torneo creado con éxtio", tournament: tournament });
        });
    })
    .catch(err => console.log(err));
};

//Obetener torneos de los que soy admin

exports.getTournaments = (req, res, next) => {
  tournament
    .findAll({
      where: {
        adminId: req.userId
      }
    })
    .then(tournaments => {
      res.status(200).json({ tournaments: tournaments });
    })
    .catch(err => console.log(err));
};

//Eliminar torneo

exports.deleteTournament = (req, res, next) => {
  tournamentId = req.params.tournamentId;
  tournament
    .destroy({
      where: {
        adminId: req.userId,
        id: tournamentId
      }
    })
    .then(a => {
      if (a) {
        return res.status(201).json({ msg: "Torneo eliminado" });
      } else {
        return res.status(201).json({ error: "El torneo ya fue eliminado" });
      }
    })
    .catch(err => console.log(err));
};

// Obtener datos de torneo que soy admin

exports.getTournament = async (req, res, next) => {
  console.log(req.userId);
  tournament
    .findOne({
      where: {
        id: req.params.tournamentId,
        adminId: req.userId
      },
      include: [
        couple,
        partido
        // {
        //   model: partido,
        //   where: {
        //     numeroRonda: { $col: "tournament.rondaActual" }
        //   }
        // }
      ],
      order: [["couples", "puntos", "DESC"]]
    })
    .then(async tournament => {
      nombresDelTorneo = [];
      if (tournament && tournament.adminId == req.userId) {
        for (p of tournament.partidos) {
          couple1 = await couple.findOne({
            where: {
              id: p.couple1Id
            }
          });

          user1 = await user.findOne({
            where: {
              id: couple1.user1Id
            }
          });
          user2 = await user.findOne({
            where: {
              id: couple1.user2Id
            }
          });

          p.dataValues.user1Name = user1.name;
          p.dataValues.user1LastName = user1.lastname;
          p.dataValues.user2Name = user2.name;
          p.dataValues.user2LastName = user2.lastname;

          couple2 = await couple.findOne({
            where: {
              id: p.couple2Id
            }
          });

          user1 = await user.findOne({
            where: {
              id: couple2.user1Id
            }
          });
          user2 = await user.findOne({
            where: {
              id: couple2.user2Id
            }
          });

          p.dataValues.user3Name = user1.name;
          p.dataValues.user3LastName = user1.lastname;
          p.dataValues.user4Name = user2.name;
          p.dataValues.user4LastName = user2.lastname;
        }
        //Obtener los nombres y los correos de los jugadores que forman las parejas

        for (c of tournament.couples) {
          if (c.user1Id) {
            user1 = await user.findOne({
              where: {
                id: c.user1Id
              }
            });
            nombresDelTorneo.push(c.id, user1.name + " " + user1.lastname);
            c.dataValues.user1Name = user1.name;
            c.dataValues.user1LastName = user1.lastname;
          }
          if (c.user2Id) {
            user2 = await user.findOne({
              where: {
                id: c.user2Id
              }
            });
            nombresDelTorneo.push(user2.name + " " + user2.lastname);
            c.dataValues.user2Name = user2.name;
            c.dataValues.user2LastName = user2.lastname;
          }
        }

        console.log("Aaaaaaaaaaa", tournament);
        res
          .status(200)
          .json({ tournament: tournament, nombres: nombresDelTorneo });
      } else {
        res
          .status(400)
          .json({ error: "El torneo no existe o no es usted admin" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

// Añadir pareja a torneo que soy admin

exports.addCouple = (req, res, next) => {
  //Buscar usuario1
  user
    .findOne({
      where: {
        email: req.body.emailUser1
      }
    })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ error: "El correo del jugador 1 no está registrado" });
      }

      req.user1Id = user.id;
    })
    .then(() => {
      //Buscar usuario 2
      user
        .findOne({
          where: {
            email: req.body.emailUser2
          }
        })
        .then(user => {
          if (!user) {
            return res
              .status(404)
              .json({ error: "El correo del jugador 2 no está registrado" });
          }

          req.user2Id = user.id;

          if (req.user1Id == req.user2Id) {
            return res.status(403).json({
              error: "Los 2 miembros de la pareja son el mismo usuario"
            });
          }
        })
        .then(() => {
          couple
            .create({
              user1Id: req.user1Id,
              user2Id: req.user2Id,
              tournamentId: parseInt(req.params.tournamentId)
            })
            .then(couple => {
              if (couple.user1Id && couple.user2Id) {
                return res
                  .status(201)
                  .json({ msg: "Añadida correctamente", couple: couple });
              }
            });
        })

        .catch(err => {
          console.log(err);
        });
    });
};

// Eliminar pareja de torneo del que soy admin

exports.deleteCouple = async (req, res, next) => {
  tourney = await tournament.findOne({
    where: { id: req.params.tournamentId }
  });

  if (tourney && tourney.rondaActual != 0) {
    return res.status(403).json({ error: "El torneo ya está empezado" });
  }

  couple
    .findById(req.params.coupleId)
    .then(couple => {
      if (couple && couple.tournamentId == req.params.tournamentId) {
        couple.destroy().then(couple => {
          return res.json({ msg: "Pareja eliminada correctamente" });
        });
      } else {
        return res.json({ error: "La pareja no pertenece a su torneo" });
      }
    })
    .catch(err => console.log(err));
};

exports.editTournament = async (req, res, next) => {
  const t = await tournament.findById(req.params.tournamentId);

  if (t.rondaActual == 0) {
    t.update({
      name: req.body.name || t.name,
      numeroParejas: req.body.numeroParejas || t.numeroParejas,
      parejasPorGrupo: req.body.parejasPorGrupo || t.parejasPorGrupo,
      publico: req.body.publico || t.publico,
      puntosPG: req.body.puntosPG || t.puntosPG,
      puntosPP: req.body.puntosPP || t.puntosPP,
      idaYvuelta: req.body.idaYvuelta || t.idaYvuelta,
      numeroRondas: req.body.numeroRondas || t.numeroRondas,
      parejasSuben: req.body.parejasSuben || t.parejasSuben
    });
  } else {
    return res.json("El torneo ya está en curso");
  }

  return res.json({ msg: "Torneo editado con éxito", tournament: t });
};

//Dar inicio a la primera ronda de un torneo

exports.startTournament = async (req, res, next) => {
  const tourney = await tournament.findById(req.params.tournamentId);

  if (tourney.rondaActual != 0) {
    return res.status(500).json({ error: "El torneo ya está empezado" });
  }

  tourney.rondaActual = 1;
  tourney.save();
  //console.log(tourney.rondaActual);

  // Si le pasamos el orden de los grupos ejecuta el if
  let order = req.body.orden;
  //console.log(order);
  let couples = [];
  if (order) {
    for (id of order) {
      let pareja = null;
      pareja = await couple.findById(id);
      if (pareja == null) {
        return res
          .status(400)
          .json({ error: "El id" + id + " no es correcto" });
      }
      await couples.push(pareja);
    }
    const numeroParejas = await Object.keys(couples).length;
  } else {
    const result = await couple.findAndCountAll({
      where: { tournamentId: tourney.id }
    });
    couples = await result.rows;

    const numeroParejas = await result.count;
  }
  //console.log(couples[2].id);
  //console.log(Object.keys(couples).length);

  let j = 0;

  //Mientras que queden parejas del torneo sin meter en grupo
  while (Object.keys(couples).length > 0) {
    //console.log("aaa");

    //Agrupamos las parejas segun el torneo
    parejas = couples.slice(0, tourney.parejasPorGrupo);
    for (p of parejas) {
      p.grupoActual = j;
      await p.save();
    }
    //console.log(parejas);
    //Usamos el paquete combinator para hacer los partidos
    cmb = Combinatorics.combination(parejas, 2);
    while ((a = cmb.next())) {
      //console.log(a[0].id, a[1].id);
      //Vemos si el torneo esta puesto a ida y vuelta
      if (tourney.idaYvuelta == false) {
        await partido
          .create({
            numeroRonda: 1,
            numeroGrupo: j,
            couple1Id: a[0].id,
            couple2Id: a[1].id
          })
          .then(p => {
            tourney.addPartido(p).then(result => {
              console.log("Partido añadido");
            });
          });
      } else {
        await partido
          .bulkCreate([
            {
              numeroRonda: 1,
              numeroGrupo: j,
              couple1Id: a[0].id,
              couple2Id: a[1].id
            },
            {
              numeroRonda: 1,
              numeroGrupo: j,
              couple1Id: a[1].id,
              couple2Id: a[0].id
            }
          ])
          .then(p => {
            tourney.addPartidos(p).then(result => {
              console.log("Partido añadido");
            });
          });
      }
    }
    j++;

    //Quitamos las parejas del grupo que hayamos creado de couples y pasamos al siguiente grupo con j++
    for (let i = 0; i < tourney.parejasPorGrupo; i++) {
      couples.shift();
    }
  }

  //Devolvemos los partidos de la primera ronda
  tourney
    .getPartidos()
    .then(partidos => {
      return res.status(200).json({ partidos: partidos });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

//Editar resultado de un pardio
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
  if (tourney.rondaActual != partido.numeroRonda) {
    return res
      .status(400)
      .json({ error: "No puedes modificar resultado de una ronda ya pasada" });
  }

  //Cogemos los sets de la request
  const sets = req.body.sets;

  //Obtener los sets del body y añadirselos al partido
  //Comprobar que hay 6 sets y que ninguno es nulo
  if (Object.keys(sets).length != 6) {
    return res
      .status(400)
      .json({ error: "El numero de sets total no es correcto" });
  }

  for (set of sets) {
    if (set == null) {
      return res.status(400).json({ error: "Error en un set" });
    }
  }

  let juegospareja1 = sets[0] + sets[1] + sets[2];
  let juegospareja2 = sets[3] + sets[4] + sets[5];

  if (juegospareja1 === juegospareja2) {
    return res.status(400).json({ error: "Error en los juegos introducidos" });
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

  //Cogemos las 2 parejas y actualizamos valores
  couple1 = await couple.findOne({
    where: {
      id: partido.couple1Id
    }
  });

  couple2 = await couple.findOne({
    where: {
      id: partido.couple2Id
    }
  });

  //Actulizar juegos
  couple1.juegosGanados = couple1.juegosGanados + juegospareja1;
  couple1.juegosPerdidos = couple1.juegosPerdidos + juegospareja2;

  couple2.juegosGanados = couple2.juegosGanados + juegospareja2;
  couple2.juegosPerdidos = couple2.juegosPerdidos + juegospareja1;

  //Actualizar partidos jugados
  couple1.partidosJugados = couple1.partidosJugados + 1;
  couple2.partidosJugados = couple2.partidosJugados + 1;

  if (partido.set1Couple1 > partido.set1Couple2) {
    couple1.setsGanados = couple1.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets + 1;
    couple2.setsPerdidos = couple2.setsPerdidos + 1;
    couple2.diferenciaSets = couple2.diferenciaSets - 1;
  } else {
    couple1.setsPerdidos = couple1.setsPerdidos + 1;
    couple2.setsGanados = couple2.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets - 1;
    couple2.diferenciaSets = couple2.diferenciaSets + 1;
  }
  //Set 2
  if (partido.set2Couple1 > partido.set2Couple2) {
    couple1.setsGanados = couple1.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets + 1;
    couple2.setsPerdidos = couple2.setsPerdidos + 1;
    couple2.diferenciaSets = couple2.diferenciaSets - 1;
  } else {
    couple1.setsPerdidos = couple1.setsPerdidos + 1;
    couple2.setsGanados = couple2.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets - 1;
    couple2.diferenciaSets = couple2.diferenciaSets + 1;
  }
  //Set 3
  if (partido.set3Couple1 > partido.set3Couple2) {
    couple1.setsGanados = couple1.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets + 1;
    couple2.setsPerdidos = couple2.setsPerdidos + 1;
    couple2.diferenciaSets = couple2.diferenciaSets - 1;

    //Puede ser que solo hayan sido 2 sets
  } else if (partido.set3Couple1 < partido.set3Couple2) {
    couple1.setsPerdidos = couple1.setsPerdidos + 1;
    couple2.setsGanados = couple2.setsGanados + 1;
    couple1.diferenciaSets = couple1.diferenciaSets - 1;
    couple2.diferenciaSets = couple2.diferenciaSets + 1;
  }

  //Actualizar partidos ganados y partidos perdidos
  if (juegospareja1 > juegospareja2) {
    partido.ganador = partido.couple1Id;
    couple1.partidosGanados = couple1.partidosGanados + 1;
    couple2.partidosPerdidos = couple2.partidosPerdidos + 1;

    //Actualizar puntos
    couple1.puntos = couple1.puntos + tourney.puntosPG;
    couple2.puntos = couple2.puntos + tourney.puntosPP;

    //Actualizar el partido
  } else {
    partido.ganador = partido.couple2Id;

    couple1.partidosPerdidos = couple1.partidosPerdidos + 1;
    couple2.partidosGanados = couple2.partidosGanados + 1;

    couple1.puntos = couple1.puntos + tourney.puntosPP;
    couple2.puntos = couple2.puntos + tourney.puntosPG;
  }

  //Actualizar diferencia de juegos

  couple1.diferenciaJuegos =
    couple1.diferenciaJuegos + (juegospareja1 - juegospareja2);
  couple2.diferenciaJuegos =
    couple2.diferenciaJuegos + (juegospareja2 - juegospareja1);

  //Guardamos en la bbdd
  await couple1.save();
  await couple2.save();

  partido.jugado = true;
  //Una vez añadido el resultado lo guardamos en la bbdd
  await partido.save();

  //Enviar correo de que el resultado ha sido subido por el administrador

  //Obtener los emails de los 4 jugadores del partido
  // user1 = await user.findOne({where: {
  //   id: couple1.user1Id
  //   }});

  //   user2 = await user.findOne({where: {
  //     id: couple1.user2Id
  //     }});

  //     user3 = await user.findOne({where: {
  //       id: couple2.user1Id
  //       }})

  //       user4 = await user.findOne({where: {
  //         id: couple2.user2Id
  //         }})

  //         var emails = [user1.email,user2.email,user3.email,user4.email];

  //   transporter.sendMail({
  //     to:emails,
  //   from: 'tfg@padel.com',
  //   subject:'TFG PÁDEL',
  //   html:'<h1> El administrador actualizó el resultado del partido</h1>'
  // })

  //Devolvemos el partido con los datos actualizados
  return res.status(200).json({ partido: partido });
};

//Pasar a la siguiente ronda
exports.nextRound = async (req, res, next) => {
  let grupos = [];
  //req.params.tournamentId

  if (req.params.tournamentId == null) {
    return res.status(400).json({ error: "El id del torneo no es correcto" });
  } else {
    id = req.params.tournamentId;
  }

  const tourney = await tournament.findById(id);
  const partidosRondaActual = await tourney.getPartidos({
    where: {
      numeroRonda: tourney.rondaActual
    }
  });

  if (tourney.rondaActual == 0 || tourney.rondaActual == tourney.numeroRondas) {
    return res.status(400).json({
      error: "El torneo aun no ha comenzado o está en la última ronda"
    });
  }

  // Coger grupos de los partidos
  for (p of partidosRondaActual) {
    if (grupos.indexOf(p.numeroGrupo) === -1) {
      grupos.push(p.numeroGrupo);
    }

    //Si no esta partido.jugado = true no sumar o no hay ningun resultado provisional(sin confirmar)
    if (p.jugado != true && p.parejaEditedId == null) {
      continue;
    }

    //Si no esta confirmado, confirmarlo y  actualizar valores de parejas
    if (p.jugado != true && p.parejaEditedId != null) {
      match = p;

      match.jugado = true;
      await match.save();

      //Actualizar valores parejas
      let juegospareja1 =
        match.set1Couple1 + match.set2Couple1 + match.set3Couple1;
      let juegospareja2 =
        match.set1Couple2 + match.set2Couple2 + match.set3Couple2;

      //Cogemos las 2 parejas y actualizamos valores
      couple1 = await couple.findOne({
        where: {
          id: match.couple1Id
        }
      });

      couple2 = await couple.findOne({
        where: {
          id: match.couple2Id
        }
      });

      //Actulizar juegos
      couple1.juegosGanados = couple1.juegosGanados + juegospareja1;
      couple1.juegosPerdidos = couple1.juegosPerdidos + juegospareja2;

      couple2.juegosGanados = couple2.juegosGanados + juegospareja2;
      couple2.juegosPerdidos = couple2.juegosPerdidos + juegospareja1;

      //Actualizar partidos jugados
      couple1.partidosJugados = couple1.partidosJugados + 1;
      couple2.partidosJugados = couple2.partidosJugados + 1;

      if (match.set1Couple1 > match.set1Couple2) {
        couple1.setsGanados = couple1.setsGanados + 1;
        couple2.setsPerdidos = couple2.setsPerdidos + 1;
      } else {
        couple1.setsPerdidos = couple1.setsPerdidos + 1;
        couple2.setsGanados = couple2.setsGanados + 1;
      }
      //Set 2
      if (match.set2Couple1 > match.set2Couple2) {
        couple1.setsGanados = couple1.setsGanados + 1;
        couple2.setsPerdidos = couple2.setsPerdidos + 1;
      } else {
        couple1.setsPerdidos = couple1.setsPerdidos + 1;
        couple2.setsGanados = couple2.setsGanados + 1;
      }
      //Set 3
      if (match.set3Couple1 > match.set3Couple2) {
        couple1.setsGanados = couple1.setsGanados + 1;
        couple2.setsPerdidos = couple2.setsPerdidos + 1;
      } else {
        couple1.setsPerdidos = couple1.setsPerdidos + 1;
        couple2.setsGanados = couple2.setsGanados + 1;
      }

      //Actualizar partidos ganados y partidos perdidos
      if (juegospareja1 > juegospareja2) {
        couple1.partidosGanados = couple1.partidosGanados + 1;
        couple2.partidosPerdidos = couple2.partidosPerdidos + 1;

        //Actualizar puntos
        couple1.puntos = couple1.puntos + tourney.puntosPG;
        couple2.puntos = couple2.puntos + tourney.puntosPP;
      } else {
        couple1.partidosPerdidos = couple1.partidosPerdidos + 1;
        couple2.partidosGanados = couple2.partidosGanados + 1;

        couple1.puntos = couple1.puntos + tourney.puntosPP;
        couple2.puntos = couple2.puntos + tourney.puntosPG;
      }

      //Actualizar diferencia de sets y diferencia de juegos
      couple1.diferenciaSets =
        couple1.diferenciaSets +
        (match.set1Couple1 +
          match.set2Couple1 +
          match.set3Couple1 -
          (match.set1Couple2 + match.set2Couple2 + match.set3Couple2));
      couple2.diferenciaSets =
        couple2.diferenciaSets +
        (match.set1Couple2 +
          match.set2Couple2 +
          match.set3Couple2 -
          (match.set1Couple1 + match.set2Couple1 + match.set3Couple1));

      couple1.diferenciaJuegos =
        couple1.diferenciaJuegos + (juegospareja1 - juegospareja2);
      couple2.diferenciaJuegos =
        couple2.diferenciaJuegos + (juegospareja2 - juegospareja1);

      //Guardamos en la bbdd
      await couple1.save();
      await couple2.save();
    }
  }

  const parejas = await tourney.getCouples();
  //console.log(Object.keys(parejas).length);

  //Creamos las previousRounds
  for (pareja of parejas) {
    await couplePreviousRound.create({
      coupleId: pareja.id,
      tournamentId: tourney.id,
      ronda: tourney.rondaActual,
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
    });
  }

  //Ordenamos los grupos segun hayan quedado en esta ronda

  let gruposDeParejas = [];

  for (g of grupos) {
    let parejasss = await tourney.getCouples({
      where: {
        grupoActual: g
      },
      order: [
        ["puntos", "DESC"],
        ["diferenciaSets", "DESC"],
        ["diferenciaJuegos", "DESC"]
      ]
    });

    //console.log(parejas);

    gruposDeParejas[g] = [];

    //Meto las parejas de el array de modo que quede gruposDeParejas[g]=[ParejasGrupoG] ordenadas por puntos, diferencia de sets y juegos en caso de empates
    for (pare of parejasss) {
      gruposDeParejas[g].push(pare);
      console.log(p.id);
    }
  }
  let parejasQueBajan = [];
  let parejasQueSuben = [];

  //Cojo de cada grupo las parejas que suben y las que bajan dependiendo de los puntos, sets y juegos
  for (g in grupos) {
    if (grupos.length == 1) {
      break;
    }

    //Primer grupo no sube ninguna
    if (g == 0) {
      parejasQueBajan = parejasQueBajan.concat(
        gruposDeParejas[g].slice(-tourney.parejasSuben)
      );

      continue;
    }

    //Ultimo grupo no baja ninguna
    if (g == grupos.length - 1) {
      parejasQueSuben = parejasQueSuben.concat(
        gruposDeParejas[g].slice(0, tourney.parejasSuben)
      );
      //console.log(numerosQueSuben);
      break;
    }

    parejasQueSuben = parejasQueSuben.concat(
      gruposDeParejas[g].slice(0, tourney.parejasSuben)
    );
    parejasQueBajan = parejasQueBajan.concat(
      gruposDeParejas[g].slice(-tourney.parejasSuben)
    );
  }
  console.log("-----------", parejasQueBajan);
  console.log("+++++++++++++++++++", parejasQueSuben);
  console.log("<<<<<<<<<", gruposDeParejas);
  function flat(input, depth = 1, stack = []) {
    for (let item of input) {
      if (item instanceof Array && depth > 0) {
        flat(item, depth - 1, stack);
      } else {
        stack.push(item);
      }
    }

    return stack;
  }

  let parejasOrdenadasGrupos = [];
  flat(gruposDeParejas, 1, parejasOrdenadasGrupos);
  //Junto todas las parejas en un array plano
  // if (grupos.length != 1) {
  //   parejasOrdenadasGrupos = gruposDeParejas.flat();
  // } else {
  //   parejasOrdenadasGrupos = gruposDeParejas;
  // }
  console.log("**************", parejasOrdenadasGrupos);
  console.log("------", parejasQueBajan);

  //Cojo los indices de las que suben y las que bajan y las intercambio
  //una a una ya que estan ordenados los grupos una vez finalizados los partidos
  for (let i = 0; i < parejasQueBajan.length; i++) {
    let indexBaja;
    let indexSube;
    //console.log(numerosQueBajan[i]);
    indexBaja = await parejasOrdenadasGrupos.findIndex(
      n => n === parejasQueBajan[i]
    );
    indexSube = await parejasOrdenadasGrupos.findIndex(
      n => n === parejasQueSuben[i]
    );
    //console.log(indexBaja);
    //console.log(indexSube);
    let parejaAux = parejasOrdenadasGrupos[indexBaja];
    parejasOrdenadasGrupos[indexBaja] = parejasQueSuben[i];
    parejasOrdenadasGrupos[indexSube] = parejaAux;
  }

  //console.log(parejasOrdenadasGrupos);
  for (p of parejasOrdenadasGrupos) {
    console.log(p.id);
  }

  //Cogemos el metodo de iniciar el torneo (/start), la ultima parte, en la que no hay  orden
  let couples = [];
  couples = parejasOrdenadasGrupos;
  //la j llevara el numero del grupo

  //Avanzamos la ronda del torneo
  tourney.rondaActual = tourney.rondaActual + 1;
  tourney.save();
  let j = 0;
  while (Object.keys(couples).length > 0) {
    //console.log("aaa");

    //Vamos cogiendo grupos de parejas con el numero de parejas por grupos y actualizamos grupo actual
    parejasPorGrupo = couples.slice(0, tourney.parejasPorGrupo);
    for (p of parejasPorGrupo) {
      p.grupoActual = j;
      await p.save();
    }
    //console.log(parejas);

    //Hacemos las combinaciones
    cmb = Combinatorics.combination(parejasPorGrupo, 2);
    while ((a = cmb.next())) {
      //console.log(a[0].id, a[1].id);

      //Vemos si hay uno 2 partidos si es ida y vuelta o no
      if (tourney.idaYvuelta == false) {
        await partido
          .create({
            numeroRonda: tourney.rondaActual,
            numeroGrupo: j,
            couple1Id: a[0].id,
            couple2Id: a[1].id
          })
          .then(p => {
            tourney.addPartido(p).then(result => {
              console.log("Partido añadido");
            });
          });
      } else {
        await partido
          .bulkCreate([
            {
              numeroRonda: tourney.rondaActual,
              numeroGrupo: j,
              couple1Id: a[0].id,
              couple2Id: a[1].id
            },
            {
              numeroRonda: tourney.rondaActual,
              numeroGrupo: j,
              couple1Id: a[1].id,
              couple2Id: a[0].id
            }
          ])
          .then(p => {
            tourney.addPartidos(p).then(result => {
              console.log("Partido añadido");
            });
          });
      }
    }

    //Quitamos las parejas y avanzamos de grupo
    j++;
    for (let i = 0; i < tourney.parejasPorGrupo; i++) {
      couples.shift();
    }
  }

  //Resetear diferencia de sets y juegos

  for (p of parejas) {
    p.diferenciaJuegos = 0;
    p.diferenciaSets = 0;
    p.partidosJugados = 0;
    p.partidosGanados = 0;
    p.partidosPerdidos = 0;
    p.setsGanados = 0;
    p.setsPerdidos = 0;
    p.juegosGanados = 0;
    p.juegosPerdidos = 0;
    p.puntos = 0;
    p.save();
  }

  //Devolvemos los partidos de la ronda siguiente

  tourney
    .getPartidos({
      where: {
        numeroRonda: tourney.rondaActual
      }
    })
    .then(partidos => {
      return res.status(200).json({ partidos: partidos });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

//Rondas pasadas
exports.previousRounds = async (req, res, next) => {
  tourney = await tournament.findById(req.params.tournamentId);

  if (tourney.rondaActual == 0) {
    return res.status(400).json({ error: "El torneo aún no ha comenzado" });
  }

  let clasificacion = [];
  let grupos = [];

  for (let nRonda = 1; nRonda < tourney.rondaActual; nRonda++) {
    parejasAnteriores = await tourney.getCouplePreviousRounds();

    //Cogemos los grupos de esa ronda
    for (p of parejasAnteriores) {
      if (grupos.indexOf(p.grupo) === -1) {
        grupos.push(p.grupo);
      }
    }

    //Ordenamos los grupos, orden ascendente [0,1,2,3..]
    grupos = grupos.sort((a, b) => a - b);
    //console.log(grupos);

    clasificacion[nRonda] = [];

    //Vamos cogiendo los resultados de las parejas en rondas anteriores divididos por grupos y los partidos de esas rondas y esos grupos
    for (g of grupos) {
      parejasGrupo = await tourney.getCouplePreviousRounds({
        where: { ronda: nRonda, grupo: g },
        order: [
          ["puntos", "DESC"],
          ["diferenciaSets", "DESC"],
          ["diferenciaJuegos", "DESC"]
        ]
      });

      partidosGrupo = await tourney.getPartidos({
        where: {
          numeroRonda: nRonda,
          numeroGrupo: g
        }
      });

      //Por ejemplo metemos en la ronda 1 el grupo 0
      //Las parejas de ronda 1 y grupo 0 estan en clasificacion[Ronda1][Grupo0][ArrayParejas, ArrrayPartidos]
      //Clasificacion[0] es null ya que empieza desde la ronda 1
      clasificacion[nRonda][g] = [];
      clasificacion[nRonda][g].push(parejasGrupo);
      clasificacion[nRonda][g].push(partidosGrupo);
      console.log(clasificacion[nRonda]);
    }
  }

  return res.status(200).json({ clasificacion: clasificacion });
};

exports.editCouple = async (req, res) => {
  if (req.tourney.rondaActual != 0) {
    return res.status(401).json({ error: "El torneo ya ha empezado" });
  }

  if (!req.params.coupleId) {
    return res.status(400).json({ error: "No envío el id de la pareja" });
  }

  c = await couple.findById(req.params.coupleId);

  if (c) {
    if (c.tournamentId == req.params.tournamentId) {
      user1 = await user.findOne({
        where: {
          email: req.body.emailUser1.trim().toLowerCase()
        }
      });

      if (!user1) {
        return res
          .status(400)
          .json({ error: "No existe ningún usuario con ese email1" });
      }

      user2 = await user.findOne({
        where: {
          email: req.body.emailUser2.trim().toLowerCase()
        }
      });

      if (!user2) {
        return res
          .status(400)
          .json({ error: "No existe ningún usuario con ese email2" });
      }

      pareja = await couple.findOne({
        where: {
          [Op.or]: [
            { user1Id: user1.id },
            { user2Id: user1.id },
            { user1Id: user2.id },
            { user2Id: user2.id }
          ],
          tournamentId: req.params.tournamentId
        }
      });

      if (pareja) {
        return res
          .status(403)
          .json({ error: "Uno de los 2 jugadores ya está inscrito" });
      }

      c.user1Id = user1.id;
      c.user2Id = user2.id;
      c.save();

      return res.status(200).json({ edited: "true", couple: c });
    }
  }

  return res.status(400).json({ error: "No exite una pareja con ese id" });
};

exports.getTournamentCouples = async (req, res) => {
  let couples = await req.tourney.getCouples();
  //console.log(couples);
  if (couples.length == 0) {
    return res
      .status(200)
      .json({ msg: "No hay ninguna pareja inscrita en el torneo" });
  }

  nombresDelTorneo = [];
  //Obtener los nombres y los correos de los jugadores que forman las parejas

  for (c of couples) {
    user1 = await user.findOne({
      where: {
        id: c.user1Id
      }
    });

    user2 = await user.findOne({
      where: {
        id: c.user2Id
      }
    });
    nombresDelTorneo.push(c.id, user1.name + " " + user1.lastname);
    nombresDelTorneo.push(user2.name + " " + user2.lastname);
  }

  return res.status(200).json({ couples: couples, nombres: nombresDelTorneo });
};

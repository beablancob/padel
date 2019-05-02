var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var Combinatorics = require('js-combinatorics');

const {user, tournament, couple, partido} = require('./models/index');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// tournament.findOne()
// .then(tournament => {
//   tournament.getCouples().then(
//     couples => {
//       console.log(JSON.stringify(couples).split("},{"));
//     }
//   )
  
// }

//)

// async function  aaaa() {
//     let grupos = [];
//     const tourney = await tournament.findById(1);
//     const partidosRondaActual = await tourney.getPartidos({
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
//     console.log(grupos);

//     for (g of grupos){
//       const parejas = await tourney.getCouples({
//         where: {
//           grupoActual: g
//         }
//       });
      
//     }

    
    //Todas las parejas del torneo
    // const parejas = await tourney.getCouples({
    //   where: {}
    // });

    // //console.log(Object.keys(parejas).length);
    // for (pareja of parejas){

    //   const partidosPareja = await partido.findAll({
    //     where:
    //     {
    //       [Op.or]: [{couple1Id:pareja.id}, {couple2Id:pareja.id}]
    //     }
    //    });

    //    //Sumar los puntos de esta ronda a los puntos de la pareja
    //    let puntos = pareja.puntos;
    //    console.log(puntos);
    //    for (p of partidosPareja){
    //     // console.log(p.ganador);
    //      //console.log(pareja)
    //      if(p.ganador === pareja.id){
    //        puntos = puntos +  tourney.puntosPG;

    //      }else{
    //        puntos = puntos + tourney.puntosPP;
    //      }
    //    }
    //    console.log(puntos);
    //     pareja.puntos = puntos;
    //    await pareja.save();
    //   //  console.log(p.id, partidosPareja[0].couple1Id, partidosPareja[0].couple2Id);
    //   //  console.log(p.id, partidosPareja[1].couple1Id, partidosPareja[1].couple2Id);
    // }

    //Una vez añadidos los puntos ordenar los grupos previos con la puntuacion de ahora
    
//};

//aaaa();

//Editar resultado

async function editarResultado(){
  
  const tourney = await tournament.findById(1);
  const partidos = await tourney.getPartidos({
    where: {
      //id del partido req.body.partidoId
      id: 1
    }
  });
  //console.log(partido[0].numeroRonda);
  const partido = partidos[0];
  //req.body.sets
  sets = [6,4,5,3,6,7];
  
  //Impedir modificacion si ya se avanzo de ronda
  if(tourney.rondaActual != partido.numeroRonda){
    return res.status(400).json({error: "No puedes modificar resultado de una ronda ya pasada"})
  }

  //Obtener los sets del body y añadirselos al partido
  //Comprobar que hay 6 sets y que ninguno es nulo
  if(Object.keys(sets).length != 6){
    res.status(400).json({error: "El numero de sets total no es correcto"})
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

};

//editarResultado();







//LOGIN

app.post('/signin', authRouter);

//REGISTRO

app.post('/signup', authRouter);

//Editar resultado de un partido
app.put('/admin/tournament/:tournamentId/partido/:partidoId/edit', adminRouter);

// Eliminar pareja de un torneo

app.delete('/admin/tournament/:tournamentId/deleteCouple/:coupleId', adminRouter);

// Dar comienzo a un torneo

app.put('/admin/tournament/:tournamentId/start', adminRouter);

//Editar torneo que soy admin si no esta empezado

app.put('/admin/tournament/:tournamentId/edit', adminRouter);

//Añadir pareja a un torneo
app.put('/admin/tournament/:tournamentId/addCouple', adminRouter);

//Eliminar torneo

app.delete('/admin/tournament/:tournamentId', adminRouter);

//Crear torneo
app.post('/admin/tournament', adminRouter);

//Obtener torneos que soy admin
app.get('/admin/tournaments', adminRouter);

//Obetener un torneo

app.get('/admin/tournament/:tournamentId',adminRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

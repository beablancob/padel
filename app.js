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
//     //console.log(grupos);
//     //Todas las parejas del torneo
//     const parejas = await tourney.getCouples();
//     //console.log(Object.keys(parejas).length);
//     for (pareja of parejas){

//       const partidosPareja = await partido.findAll({
//         where:
//         {
//           [Op.or]: [{couple1Id:pareja.id}, {couple2Id:pareja.id}]
//         }
//        });

//        //Sumar los puntos de esta ronda a los puntos de la pareja
//        let puntos = pareja.puntos;
//        console.log(puntos);
//        for (p of partidosPareja){
//         // console.log(p.ganador);
//          //console.log(pareja)
//          if(p.ganador === pareja.id){
//            puntos = puntos +  tourney.puntosPG;

//          }else{
//            puntos = puntos + tourney.puntosPP;
//          }
//        }
//        console.log(puntos);
//         pareja.puntos = puntos;
//        await pareja.save();
//       //  console.log(p.id, partidosPareja[0].couple1Id, partidosPareja[0].couple2Id);
//       //  console.log(p.id, partidosPareja[1].couple1Id, partidosPareja[1].couple2Id);
//     }

//     //Una vez añadidos los puntos ordenar los grupos previos con la puntuacion de ahora
    
// };

// aaaa();






//LOGIN

app.post('/signin', authRouter);

//REGISTRO

app.post('/signup', authRouter);

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

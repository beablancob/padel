var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Combinatorics = require('js-combinatorics');

const uuidv4 = require('uuid/v4');


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});



// tournament.findOne()
// .then(tournament => {
//   tournament.getCouples().then(
//     couples => {
//       console.log(JSON.stringify(couples).split("},{"));
//     }
//   )
  
// }

//)

async function  aaa(){






}

aaa();




//LOGIN

app.post('/signin', authRouter);

//REGISTRO

app.post('/signup', authRouter);

//ADMIN

//Obtener rondas anteriores
app.get('/admin/tournament/:tournamentId/previousRounds', adminRouter);


//Avanzar ronda
app.put('/admin/tournament/:tournamentId/nextRound', adminRouter);

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

//USER

//Obtener una ronda en concreto
app.get('/tournament/:tournamentId/ronda/:numeroRonda', userRouter);

//Editar datos de usuario

app.put('/user/editInfo', userRouter);

//Obtener torneos en los que juego
app.get('/tournaments/myTournaments', userRouter);

//Obtener torneos publicos que no han empezado

app.get('/tournaments/publicos', userRouter);

//Obtener datos de un torneo

app.get('/tournaments/:tournamentId', userRouter);

//Editar resultado de un partido
app.put('/partido/:partidoId/editResult', userRouter);

//Confirmar resultado
app.put('/partido/:partidoId/confirmResult', userRouter);

//Registrarse en un torneo que aun no ha comenzado con enlace
app.put('/tournament/register/:registerLink', userRouter);





app.use('/', indexRouter);

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

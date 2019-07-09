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
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});




//LOGIN

app.post('/signin', authRouter);

//REGISTRO

app.post('/users', authRouter);

//ADMIN

//Obtener rondas anteriores
app.get('/admin/tournaments/:tournamentId/previousRounds', adminRouter);

//Avanzar ronda
app.post('/admin/tournaments/:tournamentId/nextRound', adminRouter);

//Obtener las parejas de un torneo
app.get('/admin/tournaments/:tournamentId/couples', adminRouter);

//Editar resultado de un partido
app.put('/admin/tournaments/:tournamentId/partidos/:partidoId', adminRouter);

// Eliminar pareja de un torneo
app.delete('/admin/tournaments/:tournamentId/couples/:coupleId', adminRouter);

// Editar pareja de un torneo
app.put('/admin/tournaments/:tournamentId/couples/:coupleId', adminRouter);

// Dar comienzo a un torneo
app.put('/admin/tournaments/:tournamentId/start', adminRouter);

//Añadir pareja a un torneo
app.post('/admin/tournaments/:tournamentId/couples', adminRouter);

//Editar torneo que soy admin si no está empezado

app.put('/admin/tournaments/:tournamentId', adminRouter);

//Eliminar torneo
app.delete('/admin/tournaments/:tournamentId', adminRouter);

//Crear torneo
app.post('/admin/tournaments', adminRouter);

//Obetener un torneo
app.get('/admin/tournaments/:tournamentId',adminRouter);

//Obtener torneos que soy admin
app.get('/admin/tournaments', adminRouter);



//USER

app.post('/tournaments/:tournamentId/mail', userRouter);

//Obtener una ronda en concreto
app.get('/tournaments/:tournamentId/ronda/:numeroRonda', userRouter);

//Obtener torneos en los que juego, query publicos
app.get('/tournaments', userRouter);

//Dejo el :userId por si en algun momento se da el caso que existan adminsitradores de la plataforma
//Aunque para el funcionamiento de ahora no es necesario

//Obtener datos usuario
app.get('/users/:userId', userRouter);

//Editar datos de usuario
app.put('/users/:userId', userRouter);

//Eliminar cuenta
app.delete('/users/:userId', userRouter);

//Obtener datos de un torneo
app.get('/tournaments/:tournamentId', userRouter);

//Eliminar pareja a la que pertenezco
app.delete('/couples/:coupleId', userRouter);

//Editar resultado de un partido
app.put('/partidos/:partidoId', userRouter);

//Confirmar resultado
app.put('/partidos/:partidoId/confirmResult', userRouter);

//Registrarse en un torneo que aun no ha comenzado con enlace
app.post('/tournaments/:registerCode/couples', userRouter);




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

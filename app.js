var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin')

const {user, tournament, couple} = require('./models/index');



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

 async function  perro(){
  const tourney = await tournament.findById(1);

 const result = await couple.findAndCountAll(
    {
      where: 
     { tournamentId: 1}
    }
  );
  const couples = await result.rows;
  const numero = await result.count;

  console.log(JSON.stringify(couples).split("},{"));
  console.log(numero);

  let i = 1;
  let j = 0;

  for(c of couples) {
   console.log(c.id);
    
    
  }





  

};

perro();




//LOGIN

app.post('/signin', authRouter);

//REGISTRO

app.post('/signup', authRouter);

//Editar torneo que soy admin si no esta empezado

app.put('/admin/tournament/:tournamentId/edit', adminRouter);

//Añadir pareja a un torneo
app.put('/admin/tournament/:tournamentId/addCouple', adminRouter);

// Eliminar pareja de un torneo

app.delete('/admin/tournament/:tournamentId/deleteCouple/:coupleId', adminRouter);




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

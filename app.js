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

async function  aaaa() {

  //req.params.tournamentId
  tourney = await tournament.findById(req.params.tournamentId);

  let clasificacion = [];
  for(let nRonda= 1; nRonda < tourney.rondaActual; nRonda++){
  
  let grupos = [];

  parejasAnteriores = await tourney.getCouplePreviousRounds();

  //Cogemos los grupos de esa ronda
  for(p of parejasAnteriores){
    if(grupos.indexOf(p.grupo) === -1){
      grupos.push(p.grupo);
  
  }
  }
  

  //Ordenamos los grupos, orden ascendente
  grupos =  grupos.sort((a,b) => a-b);
  //console.log(grupos);

  
  
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

    clasificacion[nRonda] = [];
    clasificacion[nRonda].push(parejasGrupo);
    clasificacion[nRonda].push(partidosGrupo);
    console.log(clasificacion[nRonda]);

  }

}


  //console.log(parejasAnteriores);
  //couplesRonda = tourney.getCouplePreviousRounds()

  


  


  }


  

  
  
    



    
    
 

 //aaaa();

//  async function prueba(){

//   let g = [0,1,2];
//   let a =[];
//   a[g] = [];
//   // a[g[0]] = [1,2,3,4];
//   // a[g[1]] = [5,6,7,8];
//   // a[g[2]] = [9,10,11,12];
//   a[g[0]] = [1,2,3];
//   a[g[1]] = [4,5,6];
//   a[g[2]] = [7,8,9];

//   let numerosQueSuben = [];
//   let numerosQueBajan = [];

//   for(grupo in g){
//     //console.log(grupo);
    
//   if (a.length == 1){
//     continue;
    
//   }
//   if(grupo == 0){
//     //console.log(a[grupo].slice(-1));
//     numerosQueBajan = numerosQueBajan.concat(a[grupo].slice(-1));
//     //console.log(numerosQueBajan);
//     continue;
//   }
//   if(grupo == g.length - 1){
//     numerosQueSuben = numerosQueSuben.concat(a[grupo].slice(0,1))
//     //console.log(numerosQueSuben);
//     continue;
//   }

//   numerosQueSuben =  numerosQueSuben.concat(a[grupo].slice(0,1));
//   numerosQueBajan = numerosQueBajan.concat(a[grupo].slice(-1));
//   //console.log(numerosQueBajan);
//   //console.log(numerosQueSuben);
  
// }

// let todosJuntos = a.flat();
// console.log(todosJuntos);
// // console.log(numerosQueBajan[0]);

// // let indexBaja;
// // indexBaja = todosJuntos.findIndex(n => 
// //   n === numerosQueBajan[0]
  
// // );
// // console.log(indexBaja);

// for (let i = 0; i < numerosQueBajan.length; i++) { 
//   let indexBaja;
//   let indexSube;
//   //console.log(numerosQueBajan[i]);
//   indexBaja = await todosJuntos.findIndex( n => 
//     n === numerosQueBajan[i]
    
//   );
//    indexSube = await todosJuntos.findIndex(n => 
//     n === numerosQueSuben[i]);
//   console.log(indexBaja);
//   //console.log(indexSube);
//   let aux = todosJuntos[indexBaja];
//   todosJuntos[indexBaja] = numerosQueSuben[i];
//   todosJuntos[indexSube] = aux;

// }
// console.log(todosJuntos);



// };
// prueba();










//LOGIN

app.post('/signin', authRouter);

//REGISTRO

app.post('/signup', authRouter);

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

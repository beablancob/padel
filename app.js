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
    let grupos = [];
    //req.params.tournamentId
    const tourney = await tournament.findById(1);
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

    for (pareja of parejas){

      const partidosPareja = await partido.findAll({
        where:
        {
          [Op.or]: [{couple1Id:pareja.id}, {couple2Id:pareja.id}]
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



       console.log(puntos);
       console.log(juegosGanados);
       console.log(juegosPerdidos);
       console.log(setsGanados);
       console.log(setsPerdidos);
       for (p of partidosPareja){
        //console.log(p.ganador);
         //console.log(pareja)
         //Sumar puntos
         if(p.ganador === pareja.id){
           puntos = puntos +  tourney.puntosPG;
           pareja.part

         }else{
           puntos = puntos + tourney.puntosPP;
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
       console.log(puntos);
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

    }


    
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
      //Meto las parejas de el array de modo que quede gruposDeParejas[g]=[ParejasGrupoG]
      for (p of parejas){
      gruposDeParejas[g].push(p);
      console.log(p.id);
      }

    }
    let parejasQueBajan = [];
    let parejasQueSuben = [];

    //Cojo de cada grupo las parejas que suben y las que bajan dependiendo de los puntos
    console.log("AAAAAAAAAAA");
    for(g in grupos){
      
      if(grupos.length == 1){
        break;
      }

      //Primer grupo no sube ninguna
      if(g == 0){
        parejasQueBajan = parejasQueBajan.concat(gruposDeParejas[g].slice(-(tourney.parejasSuben)));
        for(p of parejasQueBajan){
       console.log(p.id);
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

    //Devolvems los partidos de la ronda siguiente

    tourney.getPartidos({where:
    {
      numeroRonda: tourney.rondaActual
    }})
    .then((partidos) => {
        return res.status(200).json({partidos: partidos});

    }).catch(err => {
        return res.status(500).json({error: err});

    })



    
    

    
      //  console.log(p.id, partidosPareja[0].couple1Id, partidosPareja[0].couple2Id);
      //  console.log(p.id, partidosPareja[1].couple1Id, partidosPareja[1].couple2Id);

   // Una vez añadidos los puntos ordenar los grupos previos con la puntuacion de ahora
    
 };

 aaaa();

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

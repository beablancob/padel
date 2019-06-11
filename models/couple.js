'use strict';
module.exports = (sequelize, DataTypes) => {
  const couple = sequelize.define('couple', {
    user1Id: DataTypes.INTEGER,
    user2Id: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER,
    partidosJugados: {
     type: DataTypes.INTEGER,
     defaultValue: 0

    } ,
    partidosGanados: {
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     } ,
    partidosPerdidos:{
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     } ,
    setsGanados: {
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     } ,
    setsPerdidos:{
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     } ,
    juegosGanados:{
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     } ,
    juegosPerdidos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     } ,
    puntos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
 
     },
     grupoActual: {
       type:DataTypes.INTEGER,
       
     },
     diferenciaSets:{
       type:DataTypes.INTEGER,
       defaultValue:0
     },
     diferenciaJuegos:{
       type:DataTypes.INTEGER,
       defaultValue:0
     }

    
  }, {});
  couple.associate = function(models) {
    // associations can be defined here
    couple.belongsTo(models.tournament, {foreignKey: 'tournamentId'});

    //Asocio con los usuarios que forman la pareja
    couple.belongsTo(models.user, {as:'user1',foreignKey:'user1Id'});
    couple.belongsTo(models.user, {as:'user2',foreignKey:'user2Id'});

    //Asocio con los partidos que juegan la parejas
    couple.hasMany(models.partido, {as:'partidos1',foreignKey:'couple1Id'});
    couple.hasMany(models.partido, {as:'partidos2',foreignKey:'couple2Id'});

    //Asocio con los resultados de las rondas anteriores
    couple.hasMany(models.couplePreviousRound, {foreignKey:'coupleId'});

  };

// Método para obtener todos los partidos de una pareja
  couple.prototype.getPartidos = async function (){
    
   let partidos1 = await this.getPartidos1();
   let partidos2 = await this.getPartidos2();

   return partidos1.concat(partidos2);

  };

  return couple;
};
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
       
     }

    
  }, {});
  couple.associate = function(models) {
    // associations can be defined here
    couple.belongsTo(models.tournament, {foreignKey: 'tournamentId'});
  };
  return couple;
};
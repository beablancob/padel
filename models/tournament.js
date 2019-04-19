'use strict';
module.exports = (sequelize, DataTypes) => {
  const tournament = sequelize.define('tournament', {
    name: {type: DataTypes.STRING,
          allowNull: false
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    numberCouples: {type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  ,
  puntosPG: {type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  puntosPP: {type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:0
  },
  rondaActual:{type: DataTypes.INTEGER,
    defaultValue: 0
  }, 
  idaYvuelta: {
    type: DataTypes.BOOLEAN,
    defaultValue:false

  },
  numeroRondas: {
    type:DataTypes.INTEGER,
    defaultValue:1
  },
  parejasSuben: {
    type:DataTypes.INTEGER,
    defaultValue:0
  }

  }, {});
  tournament.associate = function(models) {
    // associations can be defined here
    tournament.belongsTo(models.user, {foreignKey: 'adminId'});
    tournament.hasMany(models.couple, {foreignKey: 'tournamentId'});
    tournament.hasMany(models.ronda, {foreignKey: 'tournamentId' });


  };
  return tournament;
};
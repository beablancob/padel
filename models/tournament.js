'use strict';
const uuidv4 = require('uuid/v4');
module.exports = (sequelize, DataTypes) => {
  const tournament = sequelize.define('tournament', {
    name: {type: DataTypes.STRING,
          allowNull: false
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    numeroParejas: {type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
   ,
  parejasPorGrupo: {type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  }
  ,
  publico: { type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false

  },
  puntosPG: {type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  puntosPP: {type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:1
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
  },
  registerCode: {
    type:DataTypes.UUIDV4,
    defaultValue: uuidv4(),
    allowNull:false
  }

  }, {});
  tournament.associate = function(models) {
    // associations can be defined here
    //Asocio con el id del administrador del torneo
    tournament.belongsTo(models.user, {foreignKey: 'adminId'});

    //Asocio las parejas y partidos con el id del torneo
    tournament.hasMany(models.couple, {foreignKey: 'tournamentId'});
    tournament.hasMany(models.partido,{foreignKey: 'tournamentId' } );
    tournament.hasMany(models.couplePreviousRound, {foreignKey: 'tournamentId' });


  };
  return tournament;
};
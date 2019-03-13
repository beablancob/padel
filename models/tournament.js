'use strict';
module.exports = (sequelize, DataTypes) => {
  const tournament = sequelize.define('tournament', {
    name: {type: DataTypes.STRING,
          allowNull: false
    },
    numberCouples: DataTypes.INTEGER
  }, {});
  tournament.associate = function(models) {
    // associations can be defined here
    tournament.belongsTo(models.user, {foreignKey: 'adminId'});
    tournament.hasMany(models.couple, {foreignKey: 'tournamentId'})

  };
  return tournament;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: true
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,

  }, {});
  user.associate = function(models) {
    
    //Asocio con los torneos como administrador
    user.hasMany(models.tournament, {foreignKey:'adminId'});

    //Asocio con las parejas a las que pertenece
    user.hasMany(models.couple, {as:'couples1',foreignKey:'user1Id'});
    user.hasMany(models.couple, {as:'couples2',foreignKey:'user2Id'});
  

  };

  //Metodo para obtener todas las parejas de un usuario
  user.prototype.getCouples = async function(){

    let parejas1 = await this.getCouples1();
    let parejas2 = await this.getCouples2();

    return parejas1.concat(parejas2);
  }



  return user;
};



const helper = require('kao-helper');

const { Sequelize, DataTypes, Op } = require('sequelize');

module.exports = app => {
  const Models = {};

  const config = helper.parseAdapterConfig(app.kao.config('model'));

  const sequelize = new Sequelize(config);

  sequelize.authenticate().then(() => {
    app.kao.logger.info('Database connection succeeded');
  }).catch(err => {
    app.kao.logger.error(`Database connection failed:[${err}]`);
  });

  sequelize.DataTypes = DataTypes;
  // defineModel
  Object.keys(app.models).forEach(k => {
    Models[k] = Models[k] || app.models[k](sequelize);
  });

  // activeRelation
  // _.each(relations, v => v(Models));

  function model(name) {
    if (!name) return Models;
    return Models[name];
  };

  return {
    kao: {
      model,
      sequelize,
      Sequel: { Sequelize, DataTypes, Op }
    }
  };
};

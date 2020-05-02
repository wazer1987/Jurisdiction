'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RolesSchema = new Schema({
    routes: { type: Array, required: true },
  }, { timestamps: true });

  return mongoose.model('Roles', RolesSchema);
};

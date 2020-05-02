'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    // select就是在我们查询数据库的时候不返还给前端的设置
    __v: { type: String, select: false },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    nickname: { type: String, required: true },
    roles: {
      type: Array,
      required: false },
  }, { timestamps: true });

  return mongoose.model('User', UserSchema);
};

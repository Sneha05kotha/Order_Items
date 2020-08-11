const bcrypt = require("bcrypt-nodejs");
module.exports = {
  tableName: "User",
  attributes: {
    userId: {
      type: "number",
      columnName: "user_Id",
      required: true,
      unique: true,
    },
    username: {
      type: "string",
      columnName: "user_name",
      required: true,
      unique: true,
    },
    accountno: {
      type: "number",
      columnName: "account_no",
      required: true,
      unique: true,
    },
    address: {
      type: "string",
      columnName: "address",
      required: true,
      unique: true,
    },
    phoneno: {
      type: "string",
      columnName: "phone_no",
      required: true,
      unique: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  customToJSON: function () {
    return _.omit(this, ["password"]);
  },
  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  },
};

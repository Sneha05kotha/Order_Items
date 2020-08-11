/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "order",
  attributes: {
    orderid: {
      type: "number",
      columnName: "order_Id",
      required: true,
      unique: true,
    },
    userId: {
      type: "number",
      columnName: "user_Id",
      required: true,
      unique: true,
    },
    itemId: {
      type: "number",
      columnName: "item_Id",
      required: true,
      unique: true,
    },
    status: {
      type: "number",
      columnName: "status",
      required: true,
      unique: true,
    },
    quanity: {
      type: "number",
      columnName: "quantity",
      required: true,
      unique: true,
    },
    amount: {
      type: "number",
      columnName: "amount",
      required: true,
      unique: true,
    },
  },
};

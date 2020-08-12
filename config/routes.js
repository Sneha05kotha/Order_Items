/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  '/': { view: 'pages/homepage' },
  'GET /login': { view: 'login' },
  'GET /viewdata':{ view: 'pages/viewdata'},
  'POST /login': 'CheckController.login',
  '/logout': 'CheckController.logout',
  'GET /register': { view: 'register' },
  'GET /find': 'order.displayFindPage',
  'POST /find': 'order.findJob',
  'GET /select/:jobName/:partId/:qty': 'order.FetchParts',


  'POST /orderItem/:itemId' : 'order.OrderItem',
  'GET /getItems': 'order.getItems',
};

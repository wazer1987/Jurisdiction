'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });
  router.get('/getroutes', jwt, controller.user.getRoutes);
  router.get('/getInfo', jwt, controller.user.getInfo);
  router.post('/regedit', controller.user.regedit);
  router.get('/captcha', controller.user.captcha);
  router.get('/sendemail', controller.user.email);
  router.post('/login', controller.user.login);
};

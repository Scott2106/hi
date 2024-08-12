const superAdminController = require('../controllers/superAdminController.js');
const jwtMiddleware = require('../middlewares/jwtMiddleware.js');

const express = require('express');
const router = express.Router();

router.use(jwtMiddleware.verifyToken, superAdminController.checkSuperAdmin);

router.get('/users', superAdminController.getAllUsers);
router.put('/users/', superAdminController.updateUserRole);
router.delete('/users/:userId/:siteId', superAdminController.deleteUserFromSite);
router.delete('/users', superAdminController.deleteManyUserFromSite);

router.delete('/users/:userId', superAdminController.deleteUserByUserId);


module.exports = router;

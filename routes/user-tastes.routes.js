const router = require('express').Router();
const UserTaste = require('../models/UserTaste.model');
const isAuthenticated = require('../middlewares/jwt.middleware');
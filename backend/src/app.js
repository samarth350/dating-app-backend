const express = require('express');
const app = express();
const passport = require('./config/passport'); 

app.use(express.json());

app.use(require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

module.exports = app;
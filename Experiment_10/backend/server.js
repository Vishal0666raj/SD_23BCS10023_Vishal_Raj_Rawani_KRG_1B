const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');

// load models FIRST
require('./models/url.model');
require('./models/user.model');

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use('/api/url', require('./routes/url.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// DB sync
sequelize.sync({ force: true })
  .then(() => console.log("Tables created"))
  .catch(err => console.error("DB sync error:", err));

// start server
app.listen(8000, () => console.log("Server running"));
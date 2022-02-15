/**
 * Module dependencies.
 */
 require("dotenv").config();
 const cors = require("cors")
 const path = require('path');
 const logger = require('morgan');
 const express = require ("express")
 const mongoose = require("mongoose")
 const errorHandler = require('errorhandler');
 const session = require('express-session');

 const AuthRoutes = require("./appModules/Routes/userRoutes")
 const TransactionsRoute = require("./appModules/Routes/transactionRoutes")
 const {MONGODB_URI, SESSION_SECRET, PORT} = require("./config/index")
 const {createSeedUsers} = require("./utils/createSeedUsers")
 const {isAuth} =require("./utils/isAuth")
 

//  const publicPath = path.join(__dirname, '..', 'build');

  /**
   * Create Express server.
   */
  const app = express();
  
  /** 
   * Connect to MongoDB.
   */
  mongoose.Promise = Promise;
  mongoose.connect(MONGODB_URI, { useUnifiedTopology: true }, async() =>{
    console.log("Database connection successful.");
    await createSeedUsers()
    
  })

  mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
  
  /**
   * Express configuration.
   */
  // app.use(express.static(publicPath));
  app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
  app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3001);
  
  if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
  }
  app.set("view engine", "ejs")
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  }));
  app.use(cors());
  

//   app.get("*",(req, res) => {
//     res.sendFile(path.join(publicPath, 'index.html'));
//  });


  /**
   * Routes
   */


  app.use("/auth/user", AuthRoutes)
  app.use("/transaction", isAuth, TransactionsRoute)

  
  /**
   * Error Handler.
   */
  if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }

  
  /**
   * Start Express server.
   */
  app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
    console.log('  Press CTRL-C to stop\n');
  });
  
  module.exports = app;
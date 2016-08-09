/**
 * Module dependencies.
 */
var debug          = require('debug')('mean2-ts-gulp:server');
var http           = require('http');
var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');


var config         = require('../../config.json') // Get application config
var routes         = require('./routes/index');
var users          = require('./routes/users');

var app = express();

///////////////////////
// view engine setup //
///////////////////////
app.set('views', path.join(__dirname, '../../src/views'));
app.set('view engine', 'jade');
// Get Jade template
function renderView(dir: String) {
  Filesystem.readdirSync( __dirname + "/../../src/views/" + dir).forEach( view => {
    if (Path.extname(view) === '.jade'){
      app.get("/views/" + dir + Path.basename(view,'.jade') + ".html", function(req, res){
        res.render(dir + Path.basename(view,'.jade'), jadeVariables);
      })
    }
  });
};
// Load Jade template for user and admin
var dirs = ['applications/user/', 'applications/admin/']
for (var dir of dirs) {
  renderView(dir);
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// For resources in public folder
app.use(express.static(path.join(__dirname, '../../public')));
// For scripts in client folder
app.use(express.static(path.join(__dirname, '../client')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


console.log('> Connecting MongoDB');

var Db = require('./db');
Db.connect( function (err) {
  console.log('   - MongoDB connected');


  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || config.port);
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
});


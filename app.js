// importar paquetes con middlewares

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

// importar enrutadores

var routes = require('./routes/index');

// crear aplicacion

var app = express();

// instalar generador de vistas EJS

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('quiz'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Tiempo de sesion en 10 segundos para hacer las pruebas
app.use(function(req,res,next){
        if(req.session.user){ // si estamos en una sesion
            if(!req.session.tiempo){ // comienza la cuenta del tiempo
                req.session.tiempo=(new Date()).getTime();
                req.session.tiempo_max=10; // 10 segundos de plazo maximo de tiempo
            }else{
                if((new Date()).getTime()-req.session.tiempo > 10000){ // si se pasa del tiempo eliminamos sesion
                    delete req.session.user;    // eliminacion de sesion de usuario
                    delete req.session.tiempo; // eliminacion del tiempo
                }else{ // si aun no se ha pasado el tiempo de sesion
                    req.session.tiempo=(new Date()).getTime();
                    req.session.tiempo_max=10; // 10 segundos de plazo de tiempo
                }
            }
        }
        next();
    }
);

// Helpers dinamicos
app.use(function(req,res,next){

      // guardar path en session.redir para despues de login
      if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
      }

      // Hacer visible req.session en las vistas
      res.locals.session = req.session;
      next();
    }
);

// instalar enrutadores

app.use('/', routes);

// resto de rutas: genera error 404 de http

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// gestion de errores de produccion

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// exportar app para comando de arranque

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;

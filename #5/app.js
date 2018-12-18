const express = require('express');
const createError = require('http-errors');
const path = require('path');

const db = require('./db');
const basicRouter = require('./routes/index');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(function(req, res, next){
//   if (req.is('text/*')) {
//       req.text = '';
//       req.setEncoding('utf8');
//       req.on('data', function(chunk){ req.text += chunk });
//       req.on('end', next);
//   } else {
//       next();
//   }
// });

app.use('/', basicRouter);
app.use('/api', basicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;

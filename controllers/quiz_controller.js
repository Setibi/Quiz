var models = require('../models/models.js');

// Autoload - :Id
exports.load = function(req, res, next, quizId){
    models.Quiz.find({
                where: {id: Number(quizId)},
                include: [{model: models.Comment}]
    }).then(
        function(quiz){
            if(quiz) {
                req.quiz = quiz;
                next();
            }else{
                next(new Error('No existe quizId=' + quizId))
            }
        }
    ).catch(function(error){next (error)});
};


// GET /quizes

exports.index = function(req,res){
    var busqueda = req.query.search;
    var condicion = ('%' + busqueda + '%').replace(/ /g,'%');

    if(req.query.search){
        models.Quiz.findAll({
            where: ["pregunta like ?", condicion]
        }).then(function(quizes){
                res.render('quizes/index.ejs', {quizes: quizes, errors: []});
            }).catch(function(error) {next(error)});
    }else{
        models.Quiz.findAll().then(
            function(quizes){
                res.render('quizes/index.ejs', {quizes: quizes, errors: []});
            }
        ).catch(function(error) {next(error)})
    }
};

// GET /quizes/:id

exports.show = function(req,res){
  models.Quiz.find(req.params.quizId).then(function(quiz){
        res.render('quizes/show', {quiz: req.quiz, errors: []});
    })
};

// GET /quizes/:id/answer

exports.answer = function(req,res) {
    var resultado = 'Incorrecto';
    if(req.query.respuesta === req.quiz.respuesta){
          resultado = 'Correcto';
    }
    res.render('quizes/answer', {quiz:req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new

exports.new = function(req,res){
    var quiz = models.Quiz.build( // crea objeto quiz
        {pregunta: "Pregunta", respuesta: "Respuesta", categoria: "Categoria"}
     );
    res.render('quizes/new', {quiz:quiz, errors: []});
};

// POST /quizes/create

exports.create = function(req,res){
    var quiz = models.Quiz.build(req.body.quiz);

    var errors = quiz.validate();//ya qe el objeto errors no tiene then
    if (errors)
    {
        var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
        for (var prop in errors) errores[i++]={message: errors[prop]};
        res.render('quizes/new', {quiz: quiz, errors: errores});
    } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
            .save({fields: ["pregunta", "respuesta", "categoria"]})
            .then( function(){ res.redirect('/quizes')}) ;
    }
};

// GET /quizes/:id/edit

exports.edit = function(req,res){
    var quiz = req.quiz; // autoload de instancia de quiz

    res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id

exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.categoria = req.body.quiz.categoria;

    var quiz = models.Quiz.build(req.body.quiz);

    var errors = quiz.validate();//ya qe el objeto errors no tiene then
    if (errors)
    {
        var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
        for (var prop in errors) errores[i++]={message: errors[prop]};
        res.render('quizes/edit', {quiz: req.quiz, errors: errores});
    } else {
        req.quiz //save: guarda campos pregunta y respuesta en BD
            .save( {fields: ["pregunta","respuesta","categoria"]})
            .then( function(){ res.redirect('/quizes');});
        // Redireccion HTTP a lista de preguntas (URL relativo)
    }

};

// DELETE /quizes/:id

exports.destroy = function(req,res){
    req.quiz.destroy().then( function(){
            res.redirect('/quizes');
        }).catch(function (error) {next(error)});
};
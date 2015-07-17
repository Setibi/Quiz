var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req,res){
    res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req,res){
    var comment =  models.Comment.build(
        {texto: req.body.comment.texto, QuizId: req.params.quizId});

    var errors = comment.validate();//ya qe el objeto errors no tiene then



         if (errors) {
             res.render('comments/new.ejs',
                 {comment: comment, quizid: req.params.quizId, errors: errors.errors});
         } else {
             comment // save: guarda en DB campo texto de comment
                 .save()
                 .then(function () {
                     res.redirect('/quizes/' + req.params.quizId)
                 })
             // res.redirect: Redireccion HTTP a lista de preguntas
         }




};
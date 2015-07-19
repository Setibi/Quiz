var models = require('../models/models.js');

var statistics = {
    NumberOfQuestions: 0,
    NumberOfComments: 0,
    AverageOfComments: 0,
    NumberOfQuestionsWithoutComments: 0,
    NumberOfQuestionsWithComments: 0,
};

exports.load = function(req, res) {

    models.Quiz.count()
        .then(function (cuenta) {
            statistics.NumberOfQuestions = cuenta;
            return models.Comment.findAll();
        })
        .then(function (comments) {
            statistics.NumberOfComments = GetNumberOfComments(comments);
            statistics.AverageOfComments = GetCommentsAverage(comments);
            statistics.NumberOfQuestionsWithComments = GetNumberOfQuestionsWithComments(comments);
            statistics.NumberOfQuestionsWithoutComments = GetNumberOfQuestionsWithoutComments();
            res.render('quizes/statistics.ejs', {statistics: statistics, errors: []});
        });

};

function GetNumberOfComments(comments) {
    return comments.length;
}

function GetCommentsAverage(comments) {
    if (statistics.NumberOfQuestions > 0) {
        return Math.round((comments.length / statistics.NumberOfQuestions)*100)/100;
    }
}

function GetNumberOfQuestionsWithoutComments() {
    return statistics.NumberOfQuestions - statistics.NumberOfQuestionsWithComments;
}

function GetNumberOfQuestionsWithComments(allComments) {
    var total = 0;
    var quizIds = [];
    for(var i = 0; i < allComments.length;i++){
        var comment = allComments[i];
        if (quizIds.indexOf(comment.quizId) < 0) {
            quizIds.push(comment.QuizId);
            total++;
        }
    }
    return total;
}
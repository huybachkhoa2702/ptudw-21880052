let controller = {};
let models = require('../models')
let Comment = models.Comment;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
controller.add = (comment) => {
    return new Promise((resolve, reject) => {
        Comment
            .create(comment)
            .then(data => resolve(data))
            .catch(err => reject(new Error(err)));
    });
};
module.exports = controller;
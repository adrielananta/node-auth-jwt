const { errorHandler, withTransaction } = require("../utils");
const { HttpError } = require("../error");
const { Level, sequelize} = require("../models");

const create = errorHandler(withTransaction( async (req, res, t) => {
    
    const [level, created] = await Level.findOrCreate({
        where: {
            level: req.body.level
        },
        transaction: t,
    });
    
    if (!created){
        throw new HttpError(409, "duplicate");
    };

    await t.commit();
    res.status(201).json({
        level: level.level
    });
}));

const get = errorHandler( async (req, res) => {
    const level = await Level.findOne({
        where: {level: req.params.level}
    });

    res.status(200).json({
        level: level.level
    });
});

module.exports = {
    create,
    get
};
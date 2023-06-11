const argon2 = require("argon2");
const { errorHandler, withTransaction, verifyAccessToken } = require("../utils");
const { HttpError } = require("../error");
const { User, Level, Department } = require("../models");

const create = errorHandler(withTransaction( async (req, res, t) => {
    const level = await Level.findOne({where: {level: req.body.level}, transaction: t});
    const department = await Department.findOne({where: {name: req.body.department}, transaction: t});

    if(!level){
        throw new HttpError(404, "Level not found");
    }

    if(!department){
        throw new HttpError(404, "Department not found");
    }

    const [user, created] = await User.findOrCreate({
        where: {
            username: req.body.username
        },
        defaults: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: await argon2.hash(req.body.password),
            levelId: level.id,
            departmentId: department.id
        },
        transaction: t,
    });
    
    if (!created){
        throw new HttpError(409, "duplicate");
    };

    res.status(201).json({
        userId: user.id
    });
}));

const update = errorHandler(withTransaction( async (req, res, t) => {
    const accessToken = await verifyAccessToken(req.headers["authorization"]);

    const level = await Level.findOne({where: {level: req.body.level}, transaction: t});
    const department = await Department.findOne({where: {name: req.body.department}, transaction: t});
    const user = await User.findOne({where: {id:accessToken.userId}, transaction: t});
    
    if(req.params.userId != user.id){
        throw new HttpError(403, "Forbidden");
    };

    if(!level){
        throw new HttpError(404, "Level not found");
    };

    if(!department){
        throw new HttpError(404, "Department not found");
    };

    await User.update(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: await argon2.hash(req.body.password),
            levelId: level.id,
            departmentId: department.id
        },
        {
            where: {
                id: user.id
            },
            transaction: t
        }
    );

    res.json({
        userId: user.id
    });
}));

const read = errorHandler(withTransaction(async (req, res, t) => {
    const user = await User.findOne({where: {id:req.params.userId}, transaction: t});
    const level = await Level.findOne({where: {id: user.levelId}, transaction: t});
    const department = await Department.findOne({where: {id: user.departmentId}, transaction: t});

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        level: level.level,
        department: department.name
    });
}));

const destroy = errorHandler(withTransaction(async (req, res, t) => {
    const accessToken = await verifyAccessToken(req.headers["authorization"]);
    const user = await User.findOne({where: {id:accessToken.userId}, transaction: t});

    if(user.id != req.params.userId){
        new HttpError(403, "Forbidden");
    };

    await User.destroy({
        where: {
            id: user.id
        },
        transaction: t
    });

    res.json({
        message: "user deleted"
    });
}));



module.exports = {
    create,
    update,
    read,
    destroy
};
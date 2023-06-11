const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { sequelize, RefreshToken } = require("../models");
const { HttpError } = require("../error");
const logger = require("../logger");

function errorHandler(fn){
    return async (req, res, next) => {
        try{
            const result = await fn(req, res);
        } catch(err){
            next(err);
        };
    };
};

function withTransaction(fn){
    return async (req, res, next) => {
        let result;
        await sequelize.transaction(async (t) => {
            result = fn(req, res, t);
            return result;
        })
    }
}

const verifyPassword = async (hashedPassword, rawPassword) => {
    if(await argon2.verify(hashedPassword, rawPassword)){
        return true;
    } else {
        throw new HttpError(401, "Invalid username or password");
    }
}

const createRefreshToken = (userId, refreshtokenId) => {
    return jwt.sign(
        {
            userId: userId,
            tokenId: refreshtokenId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

const createAccessToken = (userId) => {
    return jwt.sign(
        {
            userId: userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10m"
        }
    );
};

const validateRefreshToken = async (token) => {
    const decodeToken = () => {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch(err) {
            throw new HttpError(401, "Unauthorised");
        };
    };

    const decodedToken = decodeToken();
    const tokenExists = await RefreshToken.findOne({
        where: {id: decodedToken.tokenId}
    });

    if(!tokenExists){
        throw new HttpError(401, "Unauthorised");
    };
    return decodedToken;
};

const verifyAccessToken = async (authHeader) => {
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        throw new HttpError(401, "Unauthorized");
    };

    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        logger.info(`util_verAccTok: ${decodedToken.userId}`);
        return decodedToken;
    }catch(err){
        throw new HttpError(403, "Forbidden");
    }
};

module.exports = {
    errorHandler,
    withTransaction,
    verifyPassword,
    createRefreshToken,
    createAccessToken,
    validateRefreshToken,
    verifyAccessToken
};
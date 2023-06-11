const { 
    errorHandler, 
    withTransaction, 
    verifyPassword, 
    createRefreshToken, 
    createAccessToken, 
    validateRefreshToken, 
    verifyAccessToken
} = require("../utils");
const { HttpError } = require("../error");
const { User, RefreshToken } = require("../models");
const logger = require("../logger");

const login = errorHandler(withTransaction(async (req, res, t) => {
    const user = await User.findOne({
        where: {username: req.body.username}
    });
    if(!user){
        throw new HttpError(401, "Invalid username or password");
    };

    await verifyPassword(user.password, req.body.password);

    const refreshTokenObj = await RefreshToken.create({
        userId: user.id
    },{transaction: t});

    const refreshToken = createRefreshToken(user.id, refreshTokenObj.id);
    const accessToken = createAccessToken(user.id);

    res.json({
        accessToken,
        refreshToken
    });
}));

const logout = errorHandler(withTransaction(async (req, res, t) => {
    const accessToken = await verifyAccessToken(req.headers["authorization"]);
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    logger.info(`verAccTok: ${accessToken.userId}`);
    logger.info(`verRefTok: ${refreshToken.userId}`);
    if(refreshToken.userId != accessToken.userId){
        throw new HttpError(403, "Forbidden");
    };

    await RefreshToken.destroy({
        where: {id: refreshToken.tokenId},
        transaction: t
    });

    res.json({
        success: true
    });
}));

const newAccessToken = errorHandler(async (req, res) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    logger.info(`verRefTok: ${refreshToken.userId}`);
    const accessToken = createAccessToken(refreshToken.userId);

    res.json({
        accessToken,
        refreshToken: req.body.refreshToken
    });
});

module.exports = {
    login,
    logout,
    newAccessToken
}
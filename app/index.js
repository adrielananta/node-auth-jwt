require("dotenv").config();
const express = require("express");
const logger = require("./logger");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

async function startServer(){
    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use("/api", routes);

    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(err.statusCode || 500)
            .send({ error: err.message });
    });

    app.listen(port, () => {
        logger.info(`App listening on port ${port}`);
    });
};

startServer();
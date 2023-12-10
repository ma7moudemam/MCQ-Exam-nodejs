require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const body_parser = require("body-parser");
const multer = require("multer");
const helmet = require("helmet");
const xss = require("xss");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


/* ****************** Routes ******************** */
const studentRouter = require("./Routers/StudentsRoute");
const subjectRouter = require("./Routers/subjectRoute");
const authRouter = require("./Routers/UserRoute");

/* ************************************************************  */

/* ************************************************************  */

const app = express();

app.use(express.json({ limit: "5kb" })); // request body limit is 5kb

app.use(helmet());


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
    },
  })
);

/* ************************************************************  */

/* *************************** connected to database *****************************  */


mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
    // listening to PORT
    app.listen(process.env.PORT_NUMBER || 8080, (req, res) => {
      console.log("listening........");
    });
  })
  .catch((err) => {
    console.log(err);
  });

/* ************************************************************  */

/* ************************ morgan ****************************  */

app.use(morgan("method :url"));

/* ************************************************************  */

/* ************************ First MW ****************************  */

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

/* ************************************************************  */

/* ************************ cors ****************************  */

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

/* ************************************************************  */

/* ************************ body_parser ****************************  */

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

/* ************************************************************  */

/* ************************ Routing ****************************  */

app.use(authRouter);
app.use("/students", studentRouter);
app.use("/subjects", subjectRouter);

/* ************************************************************  */

/* ************************ NOT-Found MW ****************************  */

app.use((req, res) => {
  res.status(404).json({ data: "Page Not Found" });
});

/* ************************************************************  */

/* ************************ Error MW ****************************  */

app.use((error, req, res, next) => {
  let status = error.status || 500;
  res.status(status).json({ Error: error + "" });
});

/* ************************************************************  */

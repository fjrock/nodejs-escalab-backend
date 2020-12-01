const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const albumRoutes = require("./routes/album");
const artistRoutes = require("./routes/artist");
const genreRoutes = require("./routes/genre");

const appExpress = express();

const db = async () =>{

  try{

    const success = await mongoose.connect(process.env.DATABASE,{

      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true

    });
    console.log("DB Conn");
  } catch (error){
    console.log("error DB Conn",error);
  }

}

db();

appExpress.use(morgan("dev"));
appExpress.use(bodyParser.json());
appExpress.use(cookieParser());
appExpress.use(expressValidator());
appExpress.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.1',
      info: {
          version: "1.0.0",
          title: "Music API",
          description: "Music API Information",
          contact: {
              name: "escalab"
          },
          servers: ["http://localhost:8000"]
      },components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
    
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
appExpress.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

appExpress.use("/api",authRoutes);
appExpress.use("/api",songRoutes);
appExpress.use("/api",albumRoutes);
appExpress.use("/api",artistRoutes);
appExpress.use("/api",genreRoutes);

const port= process.env.PORT;

appExpress.listen(process.env.PORT,() =>{
console.log(`port ${process.env.PORT}`);
});


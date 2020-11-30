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


//import routes
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const albumRoutes = require("./routes/album");
/*const productoRoutes = require("./routes/producto");*/

//app - express

const appExpress = express();


//db - mongo

/*mongoose
    .connect(process.env.DATABASE,{
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then( () => console.log("DB Conn OK"));
*/

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
//execute
db();

// middleware

appExpress.use(morgan("dev"));
appExpress.use(bodyParser.json());
appExpress.use(cookieParser());
appExpress.use(expressValidator());
appExpress.use(cors());

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          version: "1.0.0",
          title: "Music API",
          description: "Music API Information",
          contact: {
              name: "escalab"
          },
          servers: ["http://localhost:8000"]
      }
  },
  // definition the apis with swagger 
  apis: ['./routes/*.js']
};

// final definitions with swagger-express
const swaggerDocs = swaggerJsDoc(swaggerOptions);
appExpress.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes middleware

appExpress.use("/api",authRoutes);
appExpress.use("/api",songRoutes);
appExpress.use("/api",albumRoutes);
/*appExpress.use("/api",productoRoutes);
*/

//port 

const port= process.env.PORT;

//listen port

appExpress.listen(process.env.PORT,() =>{
console.log(`port ${process.env.PORT}`);
});


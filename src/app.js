 
 const express = require('express');

 const app = express();

  app.get("/hello",(req , res) => {
    res.send("hello");
  });

  app.get("/test",(req , res) => {
    res.send("test");
  });

  app.get("/test/t1",(req , res) => {
    res.send("Test t1");
  });

  app.use((req , res) => {
    res.send("Default");
  });

 app.listen(3000 ,  () => {
    console.log("Server is started succefully");
 });

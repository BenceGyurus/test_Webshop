const express = require("express");

const app = express();

//const PORT = 3000;

app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/index.html`);
})

app.listen(3000);
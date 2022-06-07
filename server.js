const express = require('express');
const app = express();
const port = 3000 ;
const controllers = require('./routes/index.js');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(controllers);

app.listen(port , () => {
    console.log(`server is running at ${port}`);
})
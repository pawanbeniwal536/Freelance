const express = require("express");
const connection = require("./Db_Connection/Connection");
const app = express();  
const reviewRoutes = require('./Routes/review');
const cors = require("cors");


require("dotenv").config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT_NUMBER|| 5000;
connection();

app.use('/api/reviews', reviewRoutes);


app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
});
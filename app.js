const express = require('express')
const inquirer = require('inquirer')

const dbCredentials = require('./config')

const app = express();
const PORT = process.env.PORT || PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
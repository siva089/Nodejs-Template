const dotenv = require('dotenv')
const mongoose = require("mongoose")

dotenv.config({ path: "./config.env" })

const app = require("./app")

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("connected")
}).catch(() => {
    console.log("error");
})


app.listen(process.env.PORT, () => {
    console.error("Listening on port 3000");
})
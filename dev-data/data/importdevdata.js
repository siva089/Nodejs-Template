const dotenv = require('dotenv')
const mongoose = require("mongoose")
const fs = require("fs")
const Tour=require('../../models/Tour')

dotenv.config({ path: `${__dirname}/../../config.env`})
console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("connected")    
}).catch((e) => {
    console.log(e);
})



const tours =JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

const importData = async () => {
    try {
        await Tour.create(tours)
        console.log("success")
    } catch (error) {
        console.error(error)
    }
}


const deleteData =async () => {
    try {
        await Tour.deleteMany()
    }
    catch(e){
console.error(e)
    }
}

if (process.argv[2] === '--import') {
importData()    
}
if (process.argv[2] === '--delete') {
    deleteData()
}


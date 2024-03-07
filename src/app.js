const express  = require('express')
const mongoose = require('mongoose')
const Customer = require('../models/customer')
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()
const app = express()
app.use(cors())
CONNECTION= process.env.CONNECTION
mongoose.set('strictQuery', false)


app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT = process.env.PORT || 3000;

const customers = [
    {
    "name": "Caleb",
    "industry":"music"
   },
    {
    "name": "John",
    "industry":"networking"
   },
    {
    "name": "Sal",
    "industry":"sports medecine"
   },
    
]
const customer = new Customer({
    name: 'Caleb',
    industry:'marketing'
})

app.get('/',(req,res)=>{
    res.send(customer)
})
app.get('/api/customers', async(req, res)=>{
    const result = await Customer.find();

    res.send({"customers":result })
})

app.get('/api/customers/:id', async(req,res)=>{

  console.log({requestParams: req.params, requestQuery: req.query})
try{
     const customerId= req.params.id
console.log(customerId)
const customer = await Customer.findById(customerId)
console.log(customer);
if(!customer){
    res.status(400).json({error: "User not found"})
}else{

    res.json({customer})
}
}catch(e){
    res.status(500).json({error:"Something went wrong"})
}
 

})
app.put('/api/customers/:id', async(req, res)=>{
    try {
    const customerId =req.params.id
    const customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new:true})
    res.json({customer})
    } catch (error) {
        res.status(500).json({error: 'Somethong went wrong'})
    }

})
app.patch('/api/customers/:id', async(req, res)=>{
    try {
    const customerId =req.params.id
    const customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new:true})
    res.json({customer})
    } catch (error) {
        res.status(500).json({error: 'Somethong went wrong'})
    }

})

app.delete('/api/customers/:id', async(req, res)=>{

    try {
        const customerId = req.params.id
        const result = await Customer.deleteOne({_id: customerId})
        res.json({deletedCount: result.deletedCount})
        
    } catch (error) {
        res.status(500).json({error:"Something went wrong"})
    }
})

app.post('/api/customers', async (req,res)=>{
    const customer = new Customer(req.body)
    try {
     await customer.save()
    res.status(201).json(customer)
    } catch (e) {
        res.status(400).json({error:e.message})
        
    }
   
})
app.post('/', (req,res)=>{
    res.send()
})


const start = async()=>{
    try{

        await mongoose.connect(CONNECTION);
        app.listen(PORT, ()=>{
        console.log('App listening on port ' + PORT)
    })
    }
    catch(e){
            console.log(e.message)
    }
}
start()
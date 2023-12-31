const express=require("express")
//const appRoute=require('./routes/route.js')
const router=require('express').Router()

const nodemailer=require('nodemailer')
const Mailgen=require('mailgen')
const bodyParser = require("body-parser")

const {EMAIL,PASSWORD}=require(__dirname+'/env.js')
const app=express()
const PORT=process.env.PORT || 5000
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
app.post('/',(req,res)=>{
    let userEmail=req.body.email
    let config={
        service:'gmail',
        auth: {
          user:EMAIL,
          pass:PASSWORD,
        },
      }
    let transporter=nodemailer.createTransport(config)
    let MailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Moemen",
            link:"https://moemen.netlify.app/"
        }
    })
    let response={
        body:{
            greeting: 'Dear',
            signature: 'Sincerely',
            name:req.body.n,
            title:"Welcome",
            action:{
                instructions: 'Check My Portfolio:',
                button: {
                color: '#48cfad', // Optional action button color
                text: 'Portfolio',
                link: 'https://moemen.netlify.app/'
                }
            },
            
        }
    }
    let mail=MailGenerator.generate(response)
    let message={
        from:EMAIL,
        to:userEmail,
        subject:"hello",
        html:mail
    }
    transporter.sendMail(message).then(()=>{
        res.redirect('/')
    }).catch(error=>{
        return res.status(500).json({error})
    })
    
})


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT} `);
})
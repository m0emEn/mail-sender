const nodemailer=require('nodemailer')
const Mailgen=require('mailgen')

const {EMAIL,PASSWORD}=require('../env.js')

//send email from test account
const signup=async(req,res)=>{
    
    
    let testAccount=await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      let message={
        from: '"Fred Foo 👻" <foo@example.com>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello ✔",
        text: "slm 3lykom",
        html: "<b>slm 3lykom</b>",
      };
      transporter.sendMail(message).then((info)=>{
        return res.status(201).json({
            msg:'you should recive an email',
            info:info.messageId,
            preview:nodemailer.getTestMessageUrl(info)
        })
      }).catch(error=>{
        return res.status(500).json({error})
      })

    //res.status(201).json('SignUp Successfully')
}
//send email from real gmail account
const getbill=(req,res)=>{
    const {userEmail}=req.body
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
            name:"Mailgen",
            link:"https://mailgen.js/"
        }
    })
    let response={
        body:{
            name:"moemen",
            intro:"Your Bill has arrived",
            table:{
                data:[
                    {
                        item:"Nodemailer Stack Book",
                        description:"A Backend Application",
                        price:"$10.99",
                    }
                ]
            },
        }
    }
    let mail=MailGenerator.generate(response)
    let message={
        from:EMAIL,
        to:userEmail,
        subject:"Place order",
        html:mail

    }
    transporter.sendMail(message).then(()=>{
        res.status(201).json({
            msg:"you recived the bill"
        })
    }).catch(error=>{
        return res.status(500).json({error})
    })
    
}

module.exports={
    signup,
    getbill

}
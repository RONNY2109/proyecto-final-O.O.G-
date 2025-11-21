const { log } = require('console');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const nodemailer = require("nodemailer");
const User = require("../models/user");
const {PAGE_URL}= require("../config");
const usersRouter = require('express').Router();

// usersRouter.get('/', (req, res)=>{
//    const{name, email, password} = req.body;
//    console.log(name, email, password);
   
// });

//para crear un nuevo usuario
usersRouter.post('/', async (req, res) =>{
  console.log("aqui ")
  const {name, email, password} = req.body;
  console.log(req.body);
  
  console.log("en el post");

    //validacion a nivel de backend
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los espacions son requeridos' });
    }

    //Encriptacion de contraseñas, antes de guardar con bcrypt

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
        name,
        email,
        passwordHash,
    })
    // guardar el usuario en al base de datos con el metodo .save()
    const savedUser = await newUser.save();
    // para crear el token
    const token = jwt.sign({ id: savedUser.id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn :"1d"} )
    console.log(token)

    //envio del correo para verificar con nodemailer
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


//esto es con nodemailer para mandarle el correo de verificacion al usuario.


// transport.sendMail es una promesa, por lo que usamos async y await para enviar el correo

(async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: savedUser.email, // list of receivers
      subject: "Verificacion de Usuario", // Subject line
      html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}"> Verificar Correo</a>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
})();


return res.status(201).json( "Usuario creado. Por Favor verificar tu correo electronico ")


});

//jwt json web token
//endpoint para verificar el usuario

usersRouter.patch('/:id/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decodedToken.id;
        await User.findByIdAndUpdate(id, { verified: true });
        // importante para que no quede en bucle, confirmar con res y no usar el response
        return res.sendStatus(200)
    } catch (error) {
        //Encontra el email del usuario
        const id = req.params.id;
        const { email } = await User.findById(id);
        //Firmar el nuevo token
        const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        
        //Enviar el email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            },
        });   

    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: "Verificación de usuario", // Subject line
        html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar usuario</a>`, // html body
    })

        return res.status(400).json({ error: 'El link ya expiro. Se ha enviado un nuevo link de verificacion'})
    }
});


module.exports = usersRouter;
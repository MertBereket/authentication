const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation , loginValidation } = require('../validation');





router.post('/register', async (req,res) => {
    //Validate a data before make a user
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if the user already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists!');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);


    //Create a new user
    const user = User({
        name : req.body.name,
        email: req.body.email,
        password : hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user : user._id });
    }catch(err){
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req,res) =>{
    //Validate a data before make a user
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is wrong!');

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assing a token
    const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

    res.send('Logged in!');
});

module.exports = router;

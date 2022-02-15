
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Validator = require("validatorjs")

const __User = require("../../models/user")
const __Transaction = require("../../models/transactions")
const __Admin = require("../../models/admin")
const { validatePassword } = require("../../utils/passwordValidate");

const {AUTH_SECRET, EXPIRESIN} = require("../../config/index");



// Sign up route
exports.signUp = async (req, res) => {
    try {

        const rules = {
            email: "required|email",
            name: "required|string",
            password: "required|min:8"
        };

        const validation = new Validator(req.body, rules);

        if (validation.fails()) {
            return res.json({
                responseCode: "02",
                status: "failed",
                message: "Validation Errors",
                data: { errors: validation.errors.all() }
            });
        }

      const data = req.body;
  
      const user = await __User.findOne({ email: data.email });
  
      if (user) {
        return res.json({
            responseCode: "02",
            status: "failed",
            message: "User with same email already registered.",
        });
      }
  
      if (data.password !== data.repeatPassword) {
        return res.json({
            responseCode: "02",
            status: "failed",
            message: "Password do not match.",
        });
      }
  
      const passwordPattern = await validatePassword();
  
      if (!data.password.match(passwordPattern)) {
        return res.json({
            responseCode: "08",
            status: "failed",
            message: "Password must be more than 8 characters and contain atleast one capital letter and one special character."
        });
      
      }
  
      const newUser = await __User.create({...data});
  
      if (!newUser) {
        return res.json({
            responseCode: "09",
            status: "failed",
            message: "Error: Error creating account."
        });
      }

      const admin = await __Admin.findOne()

      await __Transaction.create({
        sender: admin._id,
        receiver: newUser._id ,
        sourceCurrency:"USD" ,
        targetCurrency: "USD",
        amount: 1000 ,
        srcAmount: 1000,
        exchangeRate: 1
      })

      newUser.usdTotal = 1000
      newUser.save()
  
      const tokenData = {
        email: newUser.email,
        name: newUser.name,
        sub: newUser._id,
      };
  
      const token = await jwt.sign(tokenData, AUTH_SECRET, {
        expiresIn: EXPIRESIN,
      });
  
  
      return res.status(200).json({
        responseCode: "00",
        status: "success",
        message: "Account created.",
        data: {token, newUser}
    });

      
    } catch (error) {
        return res.json({
            responseCode: "04",
            status: "failed",
            message: "Error while trying to create account.",
            data: {error}
        });
    }
  };


// Login route controller
exports.login = async (req, res) => {
  try {

    const rules = {
        email: "required|email",
        password: "required|min:8"
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
        return res.json({
            responseCode: "02",
            status: "failed",
            message: "Validation Errors",
            data: { errors: validation.errors.all() }
        });
    }

    const data = req.body;

    const user = await __User.findOne({ email: data.email });

     if (!user) {
        return res.json({
            responseCode: "02",
            status: "failed",
            message: "Account with provided email not found."
        });
      
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
        return res.json({
            responseCode: "02",
            status: "failed",
            message: "Invalid password.Please try again."
        });
      
    }
    const tokenData = {
      email: user.email,
        name: user.name,
      sub: user._id,
    };

    const accessToken = await jwt.sign(tokenData, AUTH_SECRET, {
      expiresIn: EXPIRESIN,

    })

    return res.status(200).json({
        responseCode: "00",
        status: "success",
        message: "Successfully logged in",
        data: {user, accessToken}
    })
   
  }
   catch (error) {
    return res.json({
        responseCode: "04",
        status: "failed",
        message: "Error while trying to login.",
        data: {error}
    });
  }
};

exports.getAllUser = async (req, res) => {

    const users = await __User.find({});

    if(!users){
      return res.json({
          responseCode: "09",
          status: "failed",
          message: "Unable to fetch users"
      });
      
    }
    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Users retreived.",
      data: {users}
  });
}

exports.getCurrentUser = async (req, res) => {
  
  const user = await __User.findOne({ email: req.user.email });

  if(!req.user){
    return res.json({
        responseCode: "09",
        status: "failed",
        message: "Unauthorized access please login"
    });
  }
  return res.status(200).json({
    responseCode: "00",
    status: "success",
    message: "Account retreived.",
    data: {user}
});
  
};
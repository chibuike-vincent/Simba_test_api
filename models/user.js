const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const mongoosePaginate = require('mongoose-paginate-v2');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String, 
        required: true 
    },
    usdTotal: {
        type: Number,
        default: 0
    },
    ngnTotal: {
        type: Number,
        default: 0
    },
    eurTotal: {
        type: Number,
        default: 0
    },
},
{
    timestamps:true
})


userSchema.statics.comparePassword = async (password, callback) =>{
   return await bcrypt.compare(password, this.password);
}


//=============================================================================
userSchema.pre("save", function saveHook(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

userSchema.plugin(mongoosePaginate);

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
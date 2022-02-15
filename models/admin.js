const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const mongoosePaginate = require('mongoose-paginate-v2');


const adminSchema = new mongoose.Schema({
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
    }
},
{
    timestamps:true
})


adminSchema.statics.comparePassword = async (password, callback) =>{
   return await bcrypt.compare(password, this.password);
}


//=============================================================================
adminSchema.pre("save", function saveHook(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

adminSchema.plugin(mongoosePaginate);

const adminModel = mongoose.model("admin", adminSchema)

module.exports = adminModel
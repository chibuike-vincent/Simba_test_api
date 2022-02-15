const __UserModel = require("../models/user")
const __Admin = require("../models/admin")
const __Transaction = require("../models/transactions")
const bcrypt = require("bcryptjs")

const users = [
    {
       name: "Harriet Swift",
       email: "harriet@gmail.com",
       password: "Harriet@1"
    },
    {
        name: "Solomon James",
       email: "solomon@gmail.com",
       password: "Solomon@1"
    },
    {
        name: "Benjamin Jones",
       email: "benjamin@gmail.com",
       password: "Benjamin@1"
    },
    {
        name: "Steve Jobs",
       email: "stevejobs@gmail.com",
       password: "Stevejobs@1"
    },
    {
        name: "Elon Musk",
       email: "elonmusk@gmail.com",
       password: "elonmusk@1"
    }
]


const adminUser = {
    name: "Simba",
    email: "simba@gmail.com",
    password: "SimbaAdmin@1"
 }


 const usersWithHashedPasswordsPromiseArray = users.map(
    async (user) => {
      let hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      return user;
  })


  

exports.createSeedUsers = async() => {
    const admin = await __Admin.find()
    if(admin.length){
        console.log("Seed users already exist.")
        return;
    }else{
        const newAdmin = await __Admin.create({...adminUser})
        if(newAdmin){
            const usersWithHashedPasswords = await Promise.all(usersWithHashedPasswordsPromiseArray)
            const seedUsers = await __UserModel.insertMany(usersWithHashedPasswords)
            if(seedUsers){
                seedUsers.map(async user => {
                    await __Transaction.create({
                        sender: newAdmin._id,
                        receiver: user._id ,
                        sourceCurrency:"USD" ,
                        targetCurrency: "USD",
                        amount: 1000 ,
                        exchangeRate: 1
                      })

                      user.usdTotal = 1000
                      user.save()
                })
            }
        }
        console.log("Seed users created")
        return;
    }
}
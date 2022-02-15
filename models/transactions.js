const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    sourceCurrency: {
        type: String, 
        required: true 
    },
    targetCurrency: {
        type: String, 
        required: true 
    },

    amount: {
        type: String, 
        required: true 
    },
    srcAmount: {
        type: String, 
        required: true 
    },
    exchangeRate: {
        type: String, 
        required: true 
    },
    isReceived: {
        type: Boolean, 
        default: false 
    }
},
{
    timestamps:true
})




transactionSchema.plugin(mongoosePaginate);

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel
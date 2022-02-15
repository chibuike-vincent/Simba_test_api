const Validator = require("validatorjs")

const __Transaction = require("../../models/transactions")
const __User = require("../../models/user")


// Create Transaction route controller
exports.createTransaction = async (req, res) => {
    try {

        const rules = {
            to: "required|string",
            srcValue: "required|string",
            trgtValue: "required|string",
            srcCurrency: "required|string",
            trgtCurrency: "required|string",
            exchangeRate: "required|string"
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
        const user = req.user


        const userDetail = await __User.findOne({ _id: user.sub })
        const receiver = await __User.findOne({ _id: data.to })

        if (data.srcCurrency === "USD" && userDetail.usdTotal >= Number(data.srcValue)) {

            if (data.trgtCurrency === "NGN") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.usdTotal -= Number(data.srcValue)
                receiver.ngnTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            } else if (data.trgtCurrency === "EUR") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.usdTotal -= Number(data.srcValue)
                receiver.eurTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            } else if (data.trgtCurrency === "USD") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.usdTotal -= Number(data.srcValue)
                receiver.usdTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            }
        } else if (data.srcCurrency === "NGN" && userDetail.ngnTotal >= Number(data.srcValue)) {
            if (data.trgtCurrency === "NGN") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.ngnTotal -= Number(data.srcValue)
                receiver.ngnTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            } else if (data.trgtCurrency === "EUR") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.ngnTotal -= Number(data.srcValue)
                receiver.eurTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            } else if (data.trgtCurrency === "USD") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.ngnTotal -= Number(data.srcValue)
                receiver.usdTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            }
        } else if (data.srcCurrency === "EUR" && userDetail.eurTotal >= Number(data.srcValue)) {
            if (trgtCurrency === "NGN") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.eurTotal -= Number(data.srcValue)
                receiver.ngnTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            } else if (trgtCurrency === "EUR") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.eurTotal -= Number(data.srcValue)
                receiver.eurTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            } else if (trgtCurrency === "USD") {
                const trn = await __Transaction.create({
                    sender: userDetail._id,
                    receiver: data.to,
                    sourceCurrency: data.srcCurrency,
                    targetCurrency: data.trgtCurrency,
                    amount: data.trgtValue,
                    srcAmount: data.srcValue,
                    exchangeRate: data.exchangeRate
                })

                userDetail.eurTotal -= Number(data.srcValue)
                receiver.usdTotal += Number(data.trgtValue)
                userDetail.save()
                receiver.save()

                return res.status(200).json({
                    responseCode: "00",
                    status: "success",
                    message: "transaction successful",
                    data: { trn }
                })
            }
        } else {
            return res.json({
                responseCode: "02",
                status: "failed",
                message: "Insufficent fund for this transaction."
            });
        }

    }
    catch (error) {
        console.log(error)
        return res.json({
            responseCode: "04",
            status: "failed",
            message: "Error performing transaction.",
            data: { error }
        });
    }
};


exports.allTransaction = async (req, res) => {
   
    const user = await __User.findOne({ _id: req.user.sub });
    console.log(user )

    const transactions = await __Transaction.find({
        $or: [
            {sender:user._id},
            {receiver: user._id}
        ]
    }).populate("receiver").populate("sender")
  
    if(!transactions){
      return res.status(400).json({
          responseCode: "09",
          status: "failed",
          message: "Unable to retreive transactions"
      });
      
    }
    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Transactions retreived.",
      data: {transactions}
  });
    
  };
app.post("/entry", async (req, res) => {
    const name = req.body.given;
    const details = req.body.details;
    console.log(details);
    const createTransaction = (Amount,ObjectId) => {
        try {
            let createdtransaction = userModel.create({
                amount: Amount,
                users: ObjectId, 
                description: details
            })
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    }
    console.log("sent");
    res.json("received")
    if (name) {
        console.log(name);
        const amount = req.body.amount;
        const contributer = await userModel.findOne({ username: name });
        const prevBalance = contributer.balance;
        const newBalance = Number(prevBalance) - Number(amount);
        const given = req.body.divided;
        if (!given) {
            res.json("go back and check between whom it will be divided");
        }
        console.log(given)
        console.log(typeof (given));
        console.log(Array.isArray(given));
        if (given.includes(name)) {
            console.log("inside includes name");
            if (Array.isArray(given)) {
                console.log("inside array given");
                const eachAmount = Number(amount) / given.length;
                console.log("each amount", eachAmount);
                const netBalance = newBalance + eachAmount;
                const update = await userModel.findOneAndUpdate({ username: name }, { balance: netBalance })
                // console.log(newBalance);
                //Now for other user
                const consumer = await userModel.find({ username: { $in: given } });
                // $and:given.map((name)=>({username:name}))});
                for (let i = 0; i < consumer.length; i++) {
                    if (consumer[i].username == name) {
                        console.log("this is skipped cause this is name");
                        continue;
                    }
                    console.log("this is inside loop", consumer[i].username);
                    const prevBalanceConsumer = consumer[i].balance;
                    const newBalanceConsumer = Number(prevBalanceConsumer) + Number(eachAmount);
                    const update = await userModel.findOneAndUpdate({ username: consumer[i].username }, { balance: newBalanceConsumer })
                }

                console.log(consumer);
                console.log("end");
                return res.status(200).json('changes applied ');
            }
            else {
                console.log("only substracted from contributer");
                const update = await userModel.findOneAndUpdate({ username: name }, { balance: prevBalance });
                return res.status(200).json('changes applied ');
            }
        } else {
            const update = await userModel.findOneAndUpdate({ username: name }, { balance: newBalance })
            console.log("contributer is not in consumer");
            if (Array.isArray(given)) {
                const eachAmount = Number(amount) / given.length;
                const consumer = await userModel.find({ username: { $in: given } });
                // $and:given.map((name)=>({username:name}))});
                for (let i = 0; i < consumer.length; i++) {
                    console.log("this is inside loop", consumer[i].username);
                    const prevBalanceConsumer = consumer[i].balance;
                    const newBalanceConsumer = Number(prevBalanceConsumer) + Number(eachAmount);
                    const update = await userModel.findOneAndUpdate({ username: consumer[i].username }, { balance: newBalanceConsumer })
                }
                return res.status(200).json('changes applied ');
            }
            else {
                console.log("only divided with  single non contributer consumer")
                const singleConsumer = await userModel.findOne({ username: given });
                const prevBalanceConsumer = singleConsumer.balance;
                const newBalanceConsumer = Number(prevBalanceConsumer) + Number(amount);
                const update = await userModel.findOneAndUpdate({ username: given }, { balance: newBalanceConsumer })
                return res.status(200).json('changes applied ');
            }

        }

        // console.log("prev bal",contributer.balance);
        // const divided=req.body.divided;
        // console.log(divided);
    } else {
        return res.status(400).json("Go back and first select who have given");
    }

})
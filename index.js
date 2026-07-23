require("dotenv").config();

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());

<<<<<<< HEAD
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);
=======

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

>>>>>>> a30a028765a81399b1520cd97ecdffb982b381bc

app.get("/", (req, res) => {
    res.send("Mr Faisal AI Running ✅");
});


app.post("/webhook", async (req, res) => {

    try {

        console.log(JSON.stringify(req.body, null, 2));


        const prompt = fs.readFileSync("prompt.txt", "utf8");


        const userMessage =
            req.body.payload?.body ||
            req.body.message ||
            req.body.text ||
            req.body.body ||
            "";


        const from = req.body.payload?.from;


        if (!userMessage) {
            return res.sendStatus(200);
        }


        // Gemini AI
        const model = genAI.getGenerativeModel({
<<<<<<< HEAD
            model: "gemini-2.0-flash"
=======
            model: "gemini-2.5-flash"
>>>>>>> a30a028765a81399b1520cd97ecdffb982b381bc
        });


        const result = await model.generateContent(
`
${prompt}

رسالة المستخدم:
${userMessage}
`
        );


        const reply = result.response.text();


        console.log("AI Reply:", reply);
        console.log("Send To:", from);



<<<<<<< HEAD
        // إرسال الرد للواتساب
=======
        // Send WhatsApp Reply
>>>>>>> a30a028765a81399b1520cd97ecdffb982b381bc
        await axios.post(
            "https://api.wapilot.net/api/v2/instance1680/send-message",
            {
                phone: from,
                message: reply
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WAPILOT_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );


        res.sendStatus(200);


<<<<<<< HEAD
    } catch(err) {
=======
    } catch (err) {
>>>>>>> a30a028765a81399b1520cd97ecdffb982b381bc

        console.log(
            err.response?.data || err.message
        );

        res.sendStatus(500);

    }

});


app.listen(
    process.env.PORT || 3000,
    () => {
        console.log("Server Running ✅");
    }
<<<<<<< HEAD
);
=======
);
>>>>>>> a30a028765a81399b1520cd97ecdffb982b381bc

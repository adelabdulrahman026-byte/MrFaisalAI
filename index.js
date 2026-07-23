require("dotenv").config();

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());


const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


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


        let chatId = req.body.payload?.from;


        if (!userMessage) {
            return res.sendStatus(200);
        }


        // تحويل LID إلى صيغة واتساب
        if (chatId && chatId.includes("@lid")) {
            chatId = chatId.replace("@lid", "@c.us");
        }


        console.log("Chat ID:", chatId);



        // Gemini AI
        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash-lite"
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



        // Send WhatsApp Reply via WAPilot
        await axios.post(
            "https://api.wapilot.net/api/v2/instance1680/send-message",
            {
                chat_id: chatId,
                text: reply
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WAPILOT_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );


        res.sendStatus(200);


    } catch (err) {

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
);

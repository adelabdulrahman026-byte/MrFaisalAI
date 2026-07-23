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

        console.log("FROM:", chatId);
        console.log("PAYLOAD:", req.body.payload);

        if (!userMessage) {
            return res.sendStatus(200);
        }

        // Resolve LID إلى رقم واتساب الحقيقي
        if (chatId && chatId.endsWith("@lid")) {

            try {

                const resolve = await axios.get(
                    `https://api.wapilot.net/api/v2/instance1680/lids/${encodeURIComponent(chatId)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.WAPILOT_API_KEY}`
                        }
                    }
                );

                console.log("Resolve LID:", resolve.data);

                if (
                    resolve.data.success &&
                    resolve.data.data &&
                    resolve.data.data.pn
                ) {
                    chatId = resolve.data.data.pn;
                }

            } catch (err) {

                console.log(
                    "Resolve LID Error:",
                    err.response?.data || err.message
                );

            }

        }

        console.log("Final Chat ID:", chatId);

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

        // Send WhatsApp Reply
        try {

            const send = await axios.post(
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

            console.log("WAPilot Response:", send.data);

        } catch (error) {

            console.log(
                "WAPilot Error:",
                error.response?.data || error.message
            );

        }

        res.sendStatus(200);

    } catch (err) {

        console.log(
            "Server Error:",
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

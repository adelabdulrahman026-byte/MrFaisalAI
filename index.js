require("dotenv").config();

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("Mr Faisal AI Running ✅");
});

app.post("/webhook", async (req, res) => {

    try {

        console.log(JSON.stringify(req.body, null, 2));

        const prompt = fs.readFileSync("prompt.txt","utf8");

        const userMessage =
            req.body.message ||
            req.body.text ||
            req.body.body ||
            "";

        if(!userMessage){
            return res.sendStatus(200);
        }

        const response = await openai.chat.completions.create({

            model:"gpt-4.1-mini",

            messages:[
                {
                    role:"system",
                    content:prompt
                },
                {
                    role:"user",
                    content:userMessage
                }
            ]

        });

        const reply=response.choices[0].message.content;

        console.log(reply);

        // هنا هنبعت الرد لـ WaPilot في الخطوة الجاية

        res.sendStatus(200);

    } catch(err){

        console.log(err);

        res.sendStatus(500);

    }

});

app.listen(process.env.PORT || 3000);
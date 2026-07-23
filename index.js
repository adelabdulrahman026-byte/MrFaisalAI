require("dotenv").config();

const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Mr Faisal AI Running ✅");
});

app.post("/webhook", async (req, res) => {
  try {

    console.log("Incoming:", JSON.stringify(req.body, null, 2));

    // هنعرف اسم الحقول بعد أول رسالة تجريبية
    const message = req.body.message || req.body.text || "";

    if (!message) {
      return res.sendStatus(200);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "أنت مساعد ذكي لمستر فيصل، وردك يكون باللهجة المصرية."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    console.log(reply);

    // هنضيف إرسال الرد إلى WaPilot في الخطوة الجاية

    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 3000);
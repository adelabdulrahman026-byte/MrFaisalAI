const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Mr Faisal AI Running ✅");
});

app.post("/webhook", (req, res) => {
    console.log("وصلت رسالة:");
    console.log(JSON.stringify(req.body, null, 2));

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Server Running On Port 3000");
});
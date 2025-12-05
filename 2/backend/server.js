import express from "express";
import "dotenv/config.js";
const app = express();
app.get("/", (req, res) => {
  res.send("Hello from Server");
});
app.get("/api/v1/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "Why did the scarecrow win an award?",
      content: "Because he was outstanding in his field!",
    },
    {
      id: 2,
      title: "Parallel lines",
      content:
        "Parallel lines have so much in common… it’s a shame they’ll never meet.",
    },
    {
      id: 3,
      title: "The broken pencil",
      content:
        "I tried to write a joke about a broken pencil, but it was pointless.",
    },
    {
      id: 4,
      title: "Dad joke alert",
      content: "Why don’t eggs tell jokes? Because they’d crack each other up.",
    },
    {
      id: 5,
      title: "Math teacher",
      content: "Why was the math book sad? Because it had too many problems.",
    },
  ];
  res.send(jokes);
});
const port = 4000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

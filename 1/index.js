import "dotenv/config.js";
import express from "express";
const app = express();
const github = {
  login: "pushparajwastaken",
  id: 184812092,
  node_id: "U_kgDOCwQCPA",
  avatar_url: "https://avatars.githubusercontent.com/u/184812092?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/pushparajwastaken",
  html_url: "https://github.com/pushparajwastaken",
  followers_url: "https://api.github.com/users/pushparajwastaken/followers",
  following_url:
    "https://api.github.com/users/pushparajwastaken/following{/other_user}",
  gists_url: "https://api.github.com/users/pushparajwastaken/gists{/gist_id}",
  starred_url:
    "https://api.github.com/users/pushparajwastaken/starred{/owner}{/repo}",
  subscriptions_url:
    "https://api.github.com/users/pushparajwastaken/subscriptions",
  organizations_url: "https://api.github.com/users/pushparajwastaken/orgs",
  repos_url: "https://api.github.com/users/pushparajwastaken/repos",
  events_url: "https://api.github.com/users/pushparajwastaken/events{/privacy}",
  received_events_url:
    "https://api.github.com/users/pushparajwastaken/received_events",
  type: "User",
  user_view_type: "public",
  site_admin: false,
  name: "Pushparaj Singh Parmar",
  company: null,
  blog: "",
  location: "Bhopal",
  email: null,
  hireable: null,
  bio: "always student trying out different stuff, curious to learn excited to build stuff \r\nwant to do everything\r\n",
  twitter_username: "KungFuRoh",
  public_repos: 21,
  public_gists: 0,
  followers: 0,
  following: 3,
  created_at: "2024-10-13T07:11:42Z",
  updated_at: "2025-11-16T21:49:55Z",
};
app.get("/", (req, res) => {
  res.send("Lavanyaaaa");
});
app.get("/twitter", (req, res) => {
  res.send("Click Me");
});
app.get("/github", (req, res) => {
  res.json(github);
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});

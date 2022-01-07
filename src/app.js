const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}`
    );

    console.log(response);
    res.send(response.data);
  } catch (error) {
    res.send(new Error(error));
  }
});

app.post("/search", async (req, res) => {
  const { searchQuery } = req.body;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`
    );
    res.send(response.data);
  } catch (error) {
    res.send(new Error(error));
  }
});

module.exports = app;

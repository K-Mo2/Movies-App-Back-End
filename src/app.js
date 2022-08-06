const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();
const { main } = require("./database/mongoose");
const { favoritesSchema } = require("./database/model");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}`
    );
    
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

app.post("/favorites", async (req, res) => {
  try {
    const modelInstance = await main("favorites", favoritesSchema);
    const isDuplicate = await modelInstance.exists({ id: req.body.id });
    
    if (isDuplicate) {
      throw new Error({ Error: "Duplicate favorites"});
    }
    
    const dataInstance = await main("favorites", favoritesSchema, {
      id: req.body.id,
    });

    const saveData = await dataInstance.save();
    
    res.status(200).send(saveData);
  
  } catch (error) {
      res.status(404).send({ Error: error.message });
  }
});

app.get("/favorites", async (req, res) => {
  try {
    const modelInstance = await main("favorites", favoritesSchema);
    const movies = await modelInstance.find();

    let = moviesArr = [];

    for await (const movie of movies) {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.API_KEY}&language=en-US`
      );
      await moviesArr.push(response.data);
    }
    
    res.status(200).send(moviesArr);
  
  } catch (error) {
    res.status(404).send({ Error: "No movies found" });
  }
});

app.delete("/favorites", async (req, res) => {
  try {
    const modelInstance = await main("favorites", favoritesSchema);

    const deleteFavorite = await modelInstance.findOneAndDelete({
      id: req.body.id,
    });
    res.status(200).send(deleteFavorite);
  } catch (error) {
    res.status(404).send(new Error({ Error: error }));
  }
});
module.exports = app;

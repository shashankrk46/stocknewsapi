const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "economictimes",
    address: "https://economictimes.indiatimes.com/markets/stocks/news",
    base: "https://economictimes.indiatimes.com/"
  },
  {
    name: "moneycontrol",
    address: "https://www.moneycontrol.com/news/business/stocks/",
    base: ""
  },
  {
    name: "livemint",
    address: "https://www.livemint.com/market/stock-market-news",
    base: "https://www.livemint.com/"
  }
];

const articles = [];

newspapers.forEach(newspaper => {
  axios.get(newspaper.address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("stock")', html).each(function() {
      const title = $(this)
        .text()
        .trim();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("welcome to my Stock news");
});
app.get("/news", (req, res) => {
  res.json(articles);
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

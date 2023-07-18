const http = require("http");
const url = require("url");
const fs = require("fs");
const port = 4001;

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  res.writeHead(200, { "content-type": "application/json" });

  if (pathname === "/" || pathname === "/fruitLists") {
    const fruitLists = fs.readFileSync("./fruitLists.html", "utf-8");
    const fruitsDataJson = fs.readFileSync("./data.json", "utf-8");
    const cardItem = fs.readFileSync("./card-template.html", "utf-8");
    const fruitsData = JSON.parse(fruitsDataJson);
    res.write(
      fruitLists.replace(
        "{{ fruitLists }}",
        fruitsData
          .map((fruit) => {
            return cardItem
              .replace("{{name}}", fruit.name)
              .replace("{{price}}", fruit.price);
          })
          .join("")
      )
    );
  }
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

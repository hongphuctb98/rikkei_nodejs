const http = require("http");
const url = require("url");
const fs = require("fs");
const port = 3000;
const nodeStatic = require("node-static");
const file = new nodeStatic.Server("./public");
const server = http.createServer((req, res) => {
  file.serve(req, res);
  res.writeHead(200, { "Content-Type": "text/html" });

  const finalData = fs.readFileSync("./content/finalData.txt", "utf8");
  fs.writeFileSync(
    "./content/finalData.txt",
    `${finalData} talking about product`
  );
  const contentHTML = fs.readFileSync("./views/content.html", "utf8");
  res.write(contentHTML);
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

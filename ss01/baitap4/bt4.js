const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  res.writeHead(200, { "content-type": "text/html" });
  if (pathname === "/" || pathname === "/home") {
    res.write(`Home page`);
  } else if (pathname === "/overview") {
    // res.write(`Overview page`);
    res.write("../overview.html");
  } else {
    res.write(`Not Found`);
  }
  res.end();
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

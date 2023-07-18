const http = require("http");
const url = require("url");
const fs = require("fs");
const port = 7000;

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  res.writeHead(200, { "content-type": "text/html" });
  if (pathname === "/" || pathname === "/home") {
    res.write("home page");
  } else if (pathname === "/overview") {
    // fs.readFile("../overview.html", "utf-8", (err, data) => {
    //   if (err) {
    //     res.writeHead(400, { "content-type": "text/html" });
    //     res.write(`Error: ${err}`);
    //   } else {
    //     res.write(data);
    //   }
    // });
    try {
      const data = fs.readFileSync("./overview.html", "utf-8");
      res.write(data);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  } else {
    res.writeHead(400, { "content-type": "text/html" });
    res.write("Not Found");
  }
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  console.log(pathname);
  res.writeHead(200, { "content-type": "text/html" });

  if (pathname === "/" || pathname === "/home") {
    res.write(`<h1>Home page</h1>`);
  } else if (pathname === "/product") {
    let data = fs.readFileSync("example.txt", "utf-8");
    res.write(`<h1>${data}</h1>`);
  } else if (pathname === "/contact") {
    res.write(`<h1>Contact page</h1>`);
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.write(`<h1>Not Found</h1>`);
  }

  res.end();
});

const fileName = "exampleeee.txt";
const text = "here is exampleeee file";
let data = fs.readFileSync("example.txt", "utf-8");
// fs.writeFileSync(fileName, text, "utf-8");
// try {
//   let data = fs.readFileSync("example.txt", "utf-8");
//   // data += " nam ";
//   console.log("data content: ", data);
//   // fs.writeFileSync("example.txt", data, "utf-8");
// } catch (err) {
//   console.error("error", err);
// }

fs.readFile("example.txt", "utf-8", (err, data) => {
  err ? console.log(err) : console.log(data);
});
console.log("done");

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

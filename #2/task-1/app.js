const http = require("http");
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET") {

    if (req.url === "/") {
      let response = "";
      let i = 0;

      const dateIntervalOutput = setInterval(() => {
        const currentDate = new Date();
        response = `${currentDate.getUTCDate()}.${currentDate.getUTCMonth()}.${currentDate.getUTCFullYear()} ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}:${currentDate.getUTCSeconds()}`;
        console.log('Current date: ' + response);
        res.write(response + '\r\n');

        i++;
        if (i >= 10) {
          clearInterval(dateIntervalOutput);
          res.end(response);
        }
      }, process.env.INTERVAL || 1000);
    } else {
      res.end("Error 400 - Bad request")
    } 
  } else {
    res.end("Only GET-request allowed");
  }
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

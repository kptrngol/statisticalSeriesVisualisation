"use strict"
const http = require("http");
const fs = require("fs");

http.createServer((req, res)=>{
    let requestUrl = req.url;
    console.log(requestUrl);
    let resUrlValue = "./views/"

    switch(requestUrl)
    {
        case "/":
            res.setHeader("Content-Type","text/html")
            resUrlValue += "index.html";
            break;
        case "/module.js":
            res.setHeader("Content-Type","application/javascript")
            resUrlValue += "module.js";
            break;
        case "/mainstyle.css":
            res.setHeader("Content-Type","text/css")
            resUrlValue += "/mainstyle.css";
            break;
        default:
            res.setHeader("Content-Type","text/html")
            resUrlValue += "error.html"
            break;
    }   

    fs.readFile(resUrlValue,(err,data)=>{
        if (err) {
            console.log(err)
        } else {
            res.write(data);
            res.end()
        }
    })


}
).listen(3000,"localhost")

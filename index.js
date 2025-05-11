const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

const fs = require("fs");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    res.render("index", { allfiles: files });
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});

app.get("/edit/:filename", (req, res) => {
  res.render("editpage", { filename: req.params.filename });
});

app.post("/create", (req, res) => {
  const { title, details } = req.body;
  fs.writeFile(`./files/${title.split(" ").join("")}.txt`, details, (err) => {
    if (err) console.error(err);
    else console.log("task added");
  });
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const { oldname, newname } = req.body;
  console.log(req.body);
  fs.rename(`./files/${oldname}`, `./files/${newname}`, (err) => {
    if (err) console.error(err);
    else res.redirect("/");
  });
});

app.listen(3000);

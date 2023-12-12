// Write your "projects" router here!
const express = require("express");
const Project = require("./projects-model");

const router = express.Router();

router.get("/", (req, res) => {
  Project.get()
    .then((stuff) => {
      res.json(stuff)
    })
    .catch((err) => {
      res.status(500).json({
        message: "You have hit the sad path",
      });
    });
});

module.exports = router;

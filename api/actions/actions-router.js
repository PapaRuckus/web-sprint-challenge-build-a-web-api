// Write your "actions" router here!
const express = require("express");
const Actions = require("./actions-model");

const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then((actions) => {
      res.json(actions);
    })
    .catch((err) => {
      res.status(500).json({
        message: "You have found sad path",
      });
    });
});

module.exports = router;

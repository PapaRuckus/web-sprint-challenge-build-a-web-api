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

router.get("/:id", async (req, res) => {
  try {
    const actionId = await Actions.get(req.params.id);
    if (!actionId) {
      res.status(404).json({
        message: " action Id not found",
      });
    } else {
      res.json(actionId);
    }
  } catch (error) {
    res.status(500).json({
      message: "sad path :(",
    });
  }
});

router.post("/", (req, res) => {
  const { notes, description, project_id } = req.body;
  if (!notes || !description || !project_id) {
    return res.status(400).json({
      message: "Please provide notes and description",
    });
  } else {
    Actions.insert({ notes, description, project_id })
      .then((action) => {
        res.status(201).json(action);
      })
      .catch((err) => {
        res.status(500).json({
          message: "this is where you want to be",
        });
      });
  }
});

module.exports = router;

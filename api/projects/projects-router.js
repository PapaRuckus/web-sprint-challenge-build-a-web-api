// Write your "projects" router here!
const express = require("express");
const Project = require("./projects-model");

const router = express.Router();

router.get("/", (req, res) => {
  Project.get()
    .then((stuff) => {
      res.json(stuff);
    })
    .catch((err) => {
      res.status(500).json({
        message: "You have hit the sad path",
      });
    });
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Project.get(req.params.id);
    if (!task) {
      res.status(404).json({
        message: "Id not found",
      });
    } else {
      res.json(task);
    }
  } catch (err) {
    res.status(500).json({
      message: "whoops sad path",
    });
  }
});

router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({
      message: "Please provide a name and/or description",
    });
  }

  Project.insert({ name, description })
    .then(({ id }) => {
      return Project.get(id);
    })
    .then((project) => {
      res.status(201).json(project);
      console.log(project);
    })
    .catch((err) => {
      res.status(500).json({
        message: "whoops a doosie",
      });
    });
});

module.exports = router;

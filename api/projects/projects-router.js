// Write your "projects" router here!
const express = require("express");
const Project = require("./projects-model");

const router = express.Router();

router.get("/", (req, res) => {
  Project.get()
    .then((projects) => {
      res.json(projects);
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
  const { name, description, completed } = req.body;
  if (!name || !description) {
    return res.status(400).json({
      message: "Please provide a name and/or description",
    });
  } else {
    Project.insert({ name, description, completed })
      .then((project) => {
        res.status(201).json(project);
        console.log(project);
      })
      .catch((err) => {
        res.status(500).json({
          message: "whoops a doosie",
        });
      });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, description, completed } = req.body;
    const updatedProject = await Project.get(req.params.id);

    if (!name || !description || completed === undefined) {
      res.status(400).json({
        message: "Missing name, description, and/or completed",
      });
    } else if (!updatedProject) {
      res.status(404).json({
        message: "Project with this id doesn't exist",
      });
    } else {
      const updated = await Project.update(req.params.id, req.body);

      if (!updated) {
        res.status(500).json({
          message: "Failed to update the project",
        });
      } else {
        const updatedProject = await Project.get(req.params.id);
        res.status(200).json(updatedProject);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Error in the update operation",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "The project with that ID does not exist",
      });
    } else {
      await Project.remove(req.params.id);
      res.json(project);
    }
  } catch (error) {
    res.status(500).json({
      message: "Whoops this is sad path delete",
    });
  }
});

router.get("/:id/actions", async (req, res) => {
  try {
    const project = await Project.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "The project with that ID does not exist",
      });
    } else {
      const action = await Project.getProjectActions(req.params.id);
      res.status(200).json(action);
    }
  } catch (error) {
    res.status(500).json({
      message: "uh oh",
    });
  }
});

module.exports = router;

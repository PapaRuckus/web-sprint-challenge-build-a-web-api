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
        message: "Oops! Something went wrong while fetching projects.",
      });
    });
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Project.get(req.params.id);
    if (!task) {
      res.status(404).json({
        message: "Project ID not found.",
      });
    } else {
      res.json(task);
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops! There was an error retrieving the project ID.",
    });
  }
});

router.post("/", (req, res) => {
  const { name, description, completed } = req.body;
  if (!name || !description) {
    return res.status(400).json({
      message: "Please provide a name and description.",
    });
  } else {
    Project.insert({ name, description, completed })
      .then((project) => {
        res.status(201).json(project);
      })
      .catch((err) => {
        res.status(500).json({
          message: "An error occurred while adding the project.",
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
        message: "Missing name, description, or completed status.",
      });
    } else if (!updatedProject) {
      res.status(404).json({
        message: "Project with this ID doesn't exist.",
      });
    } else {
      const updated = await Project.update(req.params.id, req.body);

      if (!updated) {
        res.status(500).json({
          message: "Failed to update the project.",
        });
      } else {
        const updatedProject = await Project.get(req.params.id);
        res.status(200).json(updatedProject);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Error in the update operation.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "The project with that ID does not exist.",
      });
    } else {
      await Project.remove(req.params.id);
      res.json(project);
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the project.",
    });
  }
});

router.get("/:id/actions", async (req, res) => {
  try {
    const project = await Project.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "The project with that ID does not exist.",
      });
    } else {
      const action = await Project.getProjectActions(req.params.id);
      res.status(200).json(action);
    }
  } catch (error) {
    res.status(500).json({
      message: "Oops! There was an error retrieving project actions.",
    });
  }
});

module.exports = router;

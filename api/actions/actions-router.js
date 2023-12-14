const express = require("express");
const Actions = require("./actions-model");
const validateUserId = require("./actions-middlware");

const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then((actions) => {
      res.json(actions);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Oops! Something went wrong while fetching actions.",
      });
    });
});

router.get("/:id", validateUserId, async (req, res) => {
  try {
    res.json(req.actionId);
  } catch (error) {
    res.status(500).json({
      message: "Oops! Something went wrong while processing the action.",
    });
  }
});

router.post("/", (req, res) => {
  const { notes, description, project_id } = req.body;
  if (!notes || !description || !project_id) {
    return res.status(400).json({
      message: "Please provide notes, description, and project ID.",
    });
  } else {
    Actions.insert({ notes, description, project_id })
      .then((action) => {
        res.status(201).json(action);
      })
      .catch((err) => {
        res.status(500).json({
          message: "An error occurred while adding the action.",
        });
      });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { notes, description, project_id } = req.body;
    const updatedAction = await Actions.get(req.params.id);

    if (!notes || !description || !project_id) {
      res.status(400).json({
        message: "Please provide notes, description, and project ID.",
      });
    } else if (!updatedAction) {
      res.status(404).json({
        message: "Action with ID does not exist.",
      });
    } else {
      const updated = await Actions.update(req.params.id, req.body);
      if (!updated) {
        res.status(500).json({
          message: "Failed to update action.",
        });
      } else {
        const updatedAction = await Actions.get(req.params.id);
        res.status(200).json(updatedAction);
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
    const action = await Actions.get(req.params.id);
    if (!action) {
      res.status(404).json({
        message: "Action with ID does not exist.",
      });
    } else {
      await Actions.remove(req.params.id);
      res.json(action);
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the action.",
    });
  }
});

module.exports = router;

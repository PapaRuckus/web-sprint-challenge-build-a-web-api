// add middlewares here related to actions
const Actions = require("./actions-model");

async function validateUserId(req, res, next) {
  try {
    const action = await Actions.get(req.params.id);
    if (!action) {
      res.status(404).json({
        message: "Action not found.",
      });
    } else {
      res.json(action)
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: "Error in validating action ID.",
    });
  }
}

module.exports = validateUserId;

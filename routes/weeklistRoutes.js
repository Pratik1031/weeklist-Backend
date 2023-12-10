const express = require('express');
const router = express.Router();
const weeklistController = require('../controller/weeklistController');

router.post('/', weeklistController.createWeeklist);
router.put('/:weeklistId/tasks/:taskId', weeklistController.updateTask);
router.delete('/:weeklistId/tasks/:taskId', weeklistController.deleteTask);
router.put('/:weeklistId/tasks/:taskId/mark', weeklistController.markTask);
router.get('/', weeklistController.getWeeklists);

module.exports = router;

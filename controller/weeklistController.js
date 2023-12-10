const Weeklist = require('../models/Weeklist');
const moment = require('moment');

const createWeeklist = async (req, res) => {
  const { userId, startDate, endDate, description, tasks } = req.body;
  try {
    const activeWeeklists = await Weeklist.find({
      userId: userId,
      endDate: { $gt: new Date() },
    });

    if (activeWeeklists.length >= 2) {
      return res
        .status(400)
        .send('User can only have two active weeklists at a time');
    }
    const newWeeklist = new Weeklist({
      userId,
      startDate,
      endDate,
      description,
      tasks,
    });
    await newWeeklist.save();
    res.status(201).send(newWeeklist);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateTask = async (req, res) => {
  const { weeklistId, taskId } = req.params;
  const { description, completed } = req.body;
  const weeklist = await Weeklist.findById(weeklistId);
  const now = new Date();
  const timeDiff = now.getTime() - weeklist.startDate.getTime();

  if (timeDiff > 24 * 60 * 60 * 1000) {
    return res.status(400).send('Weeklist is locked and cannot be updated');
  }
  await Weeklist.updateOne(
    {
      'tasks._id': taskId,
      'tasks.completed': { $ne: true },
    },
    {
      $set: {
        'tasks.$.description': description,
        'tasks.$.completed': completed,
        'tasks.$.completedAt': new Date(),
      },
    }
  );

  res.status(200).send('Task updated successfully');
};

const deleteTask = async (req, res) => {
  const { weeklistId, taskId } = req.params;
  const weeklist = await Weeklist.findById(weeklistId);
  const now = new Date();
  const timeDiff = now.getTime() - weeklist.startDate.getTime();
  if (timeDiff > 24 * 60 * 60 * 1000) {
    return res.status(400).send('Weeklist is locked and cannot be deleted');
  }
  await weeklist.updateOne(
    {
      'tasks._id': taskId,
      'tasks.completed': { $ne: true },
    },
    {
      $pull: { tasks: { _id: taskId } },
    }
  );

  res.status(200).send('Task deleted successfully');
};

const markTask = async (req, res) => {
  const { weeklistId, taskId } = req.params;
  const { completed } = req.body;
  const weeklist = await Weeklist.findById(weeklistId);
  const now = new Date();
  const timeDiff = now.getTime() - weeklist.startDate.getTime();
  if (timeDiff > 24 * 60 * 60 * 1000) {
    return res
      .status(400)
      .send('Weeklist is locked and tasks cannot be marked');
  }
  await Weeklist.updateOne(
    {
      'tasks._id': taskId,
    },
    {
      $set: {
        'tasks.$.completed': completed,
        'tasks.$.completedAt': completed ? now : null,
      },
    }
  );
  res.status(200).send('Task marked/unmarked successfully');
};

const getWeeklists = async (req, res) => {
  const now = new Date();
  const weeklists = await Weeklist.find({
    endDate: { $gt: now },
  });
  const weeklistsWithTimeLeft = weeklists.map((weeklist) => {
    const timeLeft = moment(weeklist.endDate).diff(moment(now), 'minutes');
    return {
      ...weeklist._doc,
      timeLeft,
    };
  });
  res.status(200).send(weeklistsWithTimeLeft);
};

module.exports = {
  createWeeklist,
  updateTask,
  deleteTask,
  markTask,
  getWeeklists,
};

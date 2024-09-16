const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const fields = ['name', 'email', 'avatar', 'college', 'branch', 'division', 'defaultThreshold', 'workingDays'];
    fields.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
    
    await user.save();
    res.json(user);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

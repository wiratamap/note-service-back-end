const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../../src/core/users/models/user.model');
const authConfig = require('../../configuration/auth.config');

const login = async (req) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return {
      status: 404,
      body: { success: false, message: 'User not found!' },
    };
  }

  const result = await bcrypt.compare(req.body.password, user.password);

  if (result) {
    const token = jwt.sign({ email: user.email }, authConfig.SECRET, { expiresIn: '1h' });

    return {
      status: 200,
      body: { success: true, message: 'Authentication success!', token },
    };
  }

  return {
    status: 403,
    body: { success: false, message: 'Incorect username or password' },
  };
};

module.exports = {
  login,
};

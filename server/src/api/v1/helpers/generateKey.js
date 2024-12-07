const crypto = require("node:crypto");

const generateResetToken = () => crypto.randomBytes(32).toString("hex");

module.exports = generateResetToken;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const tok = token.split(" ");
    const length = tok.length;
    const maintoken=tok[length-1];


    const decode = jwt.verify(maintoken, process.env.JWT_secret);
    next();
  } catch (err) {
    return res.status(401).json({
      err: "Auth failed!",
    });
  }
};

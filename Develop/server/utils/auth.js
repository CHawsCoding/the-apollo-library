const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    let token = req.headers.authorization || "";

    // if no token, and it's not a signup or login request, throw an error
    if (
      !token &&
      req.body.operationName !== "addUser" &&
      req.body.operationName !== "login"
    ) {
      throw new Error("You have no token!");
    }

    // attempt to verify the token and get a decoded token
    // return updated request object
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
};

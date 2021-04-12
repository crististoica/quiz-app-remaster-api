import jwt from "jsonwebtoken";

export const checkUserToken = (req, res, next) => {
  console.log("CHECKING TOKEN");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.userData = {
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      };

      return next();
    }
  );
};

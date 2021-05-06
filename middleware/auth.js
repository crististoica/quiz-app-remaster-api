import jwt from "jsonwebtoken";

export const checkUserToken = (req, res, next) => {
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
        profileImg: decoded.profileImg,
        isAdmin: decoded.isAdmin,
      };

      return next();
    }
  );
};

export const checkAdminToken = (req, res, next) => {
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

      if (!decoded.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.userData = {
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        profileImg: decoded.profileImg,
        isAdmin: decoded.isAdmin,
      };

      return next();
    }
  );
};

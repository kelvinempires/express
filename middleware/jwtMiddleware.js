import jwt from "jsonwebtoken";

export const validateJWT = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied-No token provided 😲");
  try {
    const decoded = jwt.verify(token, "nou193138447");
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(400).send("unauthorized access 😲");
  }
};

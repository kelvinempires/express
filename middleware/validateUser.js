export const validateUser = (req, res, next) => {
  const ourPassword = "12232423";
  const { password } = req.headers;
  if (password === ourPassword) {
    return next();
  }
  res.status(401).json({ message: "invalid password" });
};

export const checkAdminRole = (req, res, next) => {
  console.log("check admin", req.user);

  if (req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

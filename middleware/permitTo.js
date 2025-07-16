
// only admin can create product
const permitTo = (...roles) => {
      return (req, res, next) => {
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
            return res.status(403).json({
                  message: "Forbidden access, you do not have permission to perform this action"
            });
      }
      next();
}
};

module.exports = permitTo;

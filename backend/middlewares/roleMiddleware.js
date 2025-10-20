export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        return next();
      }

      if (allowedRoles.includes(user.role)) {
        return next();
      }

      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    } catch (err) {
      console.error('authorizeRole error:', err);
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
};

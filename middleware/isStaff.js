module.exports = function(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'staff') {
    req.flash('error_msg', 'Access denied. Staff only area.');
    return res.redirect('/dashboard');
  }
  next();
}; 
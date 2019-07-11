exports.requireLoggedOut = function requireLoggedOut(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/petition");
    }
    next();
};
exports.requireSignature = function requireSignature(req, res, next) {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    next();
};

exports.requireNoSignature = function requireNoSignature(req, res, next) {
    if (req.session.signatureId) {
        return res.redirect("/thankyou");
    }
    next();
};

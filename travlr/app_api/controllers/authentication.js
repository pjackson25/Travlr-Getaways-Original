const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res) => {
    const user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    try {
        await user.save();

        const token = user.generateJwt();

        res.status(200).json({
            token
        });
    } catch (err) {
        res.status(400).json(err);
    }
};

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "All fields required"
        });
    }

    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user || !user.validPassword(req.body.password)) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = user.generateJwt();

        res.status(200).json({
            token
        });

    } catch (err) {
        res.status(404).json(err);
    }
};

module.exports = {
    register,
    login
};
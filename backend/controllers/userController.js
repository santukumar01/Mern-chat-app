
import generateTokens from "../cofig/generateToken.js";
import User from "../models/userModel.js";

export default class UserController {


    // async registration(req, res) {
    //     const { name, email, password, pic } = req.body;

    //     if (!name || !email || !password) {
    //         res.status(400);
    //         throw new Error("Please Enter all the Feilds");
    //     }

    //     const userExists = await User.findOne({ email });

    //     if (userExists) {
    //         res.status(400);
    //         throw new Error("User already exists");
    //     }

    //     const user = await User.create({
    //         name,
    //         email,
    //         password,
    //         pic,
    //     });

    //     if (user) {
    //         res.status(201).json({
    //             _id: user._id,
    //             name: user.name,
    //             email: user.email,
    //             isAdmin: user.isAdmin,
    //             pic: user.pic,
    //             token: generateTokens(user._id),
    //         });
    //     } else {
    //         res.status(400);
    //         throw new Error("User not found");
    //     }
    // }

    async registration(req, res) {
        const { name, email, password, pic } = req.body;

        try {
            if (!name || !email || !password) {
                res.status(400);
                throw new Error("Please Enter all the Fields");
            }

            const userExists = await User.findOne({ email });

            if (userExists) {
                res.status(400);
                return res.json({ message: "User already exists" }); // Send response instead of throwing error
                // return res.send({ message: "User already exists" });
            }

            const user = await User.create({
                name,
                email,
                password,
                pic,
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic,
                    token: generateTokens(user._id),
                });
            } else {
                res.status(400);
                throw new Error("User not found");
            }
        } catch (error) {
            // Handle errors here
            console.error(error);
            return res.status(500).json({ message: "Server Error" });
        }
    }

    authUser = async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateTokens(user._id),
            });
        } else {
            console.log("inside catch block of userController");
            return res.status(401).json({ message: "Invalid Email or PassWord" });
        }
    };

    //query paraeter
    allUsers = async (req, res) => {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: { _id: req.user._id } } });
        // console.log(req.query);
        res.send(users);
    }

};
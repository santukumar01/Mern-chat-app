import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const protect = async (req, res, next) => {
    let token;

    // console.log(req.headers);
    // console.log(req.headers.authorization);
    // Bearer" is not a key within the Authorization header object; it's a prefix indicating the type of authentication being used (in this case, a bearer token). The token itself follows the "Bearer" prefix separated by a space.
    // console.log(req.headers.authorization["Bearer"]);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extarcting tokens
            token = req.headers.authorization.split(" ")[1];

            // console.log("token", token);
            // verfy thorugh jwt secret key
            const decoded = jwt.verify(token, process.env.JWT_SEC)
            // console.log("payload", decoded);
            req.user = await User.findById(decoded.id).select(-"password");
            // console.log(req.user);
            next();
        } catch (err) {
            return res.status(501).json({ "messege": "Not 2 Authrised User" })
        }
    } else {
        return res.status(401).json({ "messege": "Not 1 Authrised User" })
    }
}
export default protect;
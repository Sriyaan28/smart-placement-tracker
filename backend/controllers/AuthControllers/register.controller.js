import { hash } from "bcrypt"
import { UserModel } from "../../models/UserModel.js"

export const registerController = async (req, res) => {
    try {
        const newUser = req.body;

        // check if user provides all fields
        const { name, email, password, role } = newUser;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Name, Email, Password and Role fields are required" });
        }

        // convert email to lower case
        newUser.email = newUser.email.trim().toLowerCase();

        // check if user already exists with same email
        const existingMail = await UserModel.findOne({ email: newUser.email });
        if (existingMail) {
            return res.status(409).json({ message: "User already exists with this email" });
        }
        // check if user already exists with same phone number
        const existingNumber = await UserModel.findOne({ number: newUser.number });
        if (existingNumber) {
            return res.status(409).json({ message: "User already exists with this phone number" });
        }

        // hash the password
        newUser.password = await hash(newUser.password, 10);

        // create new user doc
        const newUserDoc = await UserModel.create(newUser);

        // save to db
        await newUserDoc.save();

        // send response
        res.status(201).json({ message: "User registered successfully", payload: { name: newUserDoc.name } });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error - Register Controller", error: err.message });
    }

}
import { Schema, model } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required field"],
        trim: true,
        maxLength: [30, "Cannot exceed 30 characters"],
        match: [/^[a-zA-Z ]+$/, "Name can only contain letters and spaces"]
    },
    email: {
        type: String,
        required: [true, "Email is required field"],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    number: {
        type: String,
        required: [true, "Phone number is required field"],
        match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"]
    },
    password: {
        type: String,
        required: [true, "Password is required field"],
    },
    role: {
        type: String,
        enum: ["STUDENT", "COMPANY", "ADMIN"],
        required: [true, "Role is required field"]
    },
    bio: {
        type: String,
        minLength: [10, "Minimum bio length is 10 characters"],
        maxLength: [100, "Maximum bio length is 100 characters"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userProfile: {
        type: String,
        default: "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80"
    },
    githubUsername: {
        type: String,
        trim: true
    },
    leetcodeUsername: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
})


export const UserModel = model("User", userSchema);
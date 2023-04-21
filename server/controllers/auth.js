import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/users.js"; 

/* Register user */
export const register = async (req, res) => {
    try {
        const{
            firstName, 
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        
        const salt = await bcrypt.genSalt(); 
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, 
            lastName,
            email,
            password: passswordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });
        const savedUser = await newUser.save(); 
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

/* Log in user */ 
export const login = async(req, res) => {
    try {
        const {email, password } = req.body; 
        const user = await User.findOne({email: email});
        if (!user) return res.status(500).json({msg: "User does not exist"});

        const userMatch = await bcrypt.compare(password, user.password)
        if(!userMatch) return res.status(500).json({msg: "Invalid password"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        // Delete pass to prevent sending to front end 
        delete user.password;
        res.status(200).json({token, user})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token", error)
    }
}

async function handleUserSignup(req, res) {
    try {
        const { username, email, password } = req.body
    
        if ([username, email, password].some((field) => field?.trim() === "" )) {
            throw new ApiError(401, "All fields are required")
        }
    
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        })
    
        if (existingUser) {
            throw new ApiError(401, "User already exist!")
        }
    
        const user = await User.create({
            username,
            email,
            password
        })
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
        if (!createdUser) {
            throw new ApiError(401, "Something went wrong while registering user")
        }
    
        return res
            .status(200).redirect("/login")
    } catch (err) {
        return res.status(err.statusCode || 500).send(err.message || 'Something went wrong!')
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body
    
        if (!email && !password) {
            throw new ApiError(401, "All fields are required")
        }
    
        const user = await User.findOne({ email })
        
        if (!user) {
            throw new ApiError(404, "User not found")
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if (!isPasswordValid) {
            throw new ApiError(401, "password invalid")
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(`/user/${loggedInUser._id.toString()}/todos`)
    } catch (err) {
        return res.status(err.statusCode || 500).send(err.message || 'Something went wrong!')
    }
}

async function handleUserLogout(req, res) {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $unset: {
                refreshToken: 1
            }
        }, {
            new: true
        })
        
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .redirect("/")
    } catch (err) {
        return res.status(err.statusCode || 500).send(err.message || 'Something went wrong!')
    }
}

export {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout
}

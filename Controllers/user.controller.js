import User from '../Models/user.js';
// const User = require('../Models/user.js');
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js'



//function to generate the access token and refresh token for the user

export const generateAccessAndRefreshToken = async (userid) => {
    try {
        let user = await User.findById(userid)
        let accessToken = user.generateAccessToken();
        let refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    }
    catch (error) {
        throw new ApiError(500, 'something went wrong while generating access and refresh token')


    }

}

export const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if ([username, email, password].some(field => field.trim() === '')) {
        throw new ApiError(500, 'All fields are required')
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "user already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email: email,
        password: password
    })
    const newUser = await User.findById(user._id).select('-password -refreshToken')
    if (!newUser) {
        throw new ApiError(500, 'Something went wrong while creating the user')
    }

    return res.status(200).json(
        new ApiResponse(200, newUser, 'user created succesfully')
    )


})

export const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username || email)) {
        throw new ApiError(400, 'username and email is required')
    }
    let existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!existingUser) {
        throw new ApiError(400, 'user does not exists')
    }
    let isPasswordValid = await existingUser.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, 'invalid user credentials')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);
    let loggedInUser = await User.findById(existingUser._id).select('-password -refreshToken')





    let options = {
        httpOnly: true,
        secure: false,
        sameSite: "None"

    }
    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                loggedInUser, accessToken, refreshToken
            },
            'user logged in successfully'
        ))
})

export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new ApiError(204, "no content")
    }
    await User.updateOne(
        { refreshToken },

        {
            $unset: {
                refreshToken: ""
            }

        });
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "None"
    }
    return res.clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out succesfully'))


})


export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingToken) {
        throw new ApiError(401, 'unautharized request')
    }
    try {

        const decodeToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodeToken?._id)
        if (!user) {
            throw new ApiError(401, 'invalid refresh token')
        }
        if (incomingToken !== user?.refreshToken) {
            throw new ApiError(401, 'refresh token is used or expired')
        }
        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "None"
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    'Access Token refreshed'
                )
            )

    }
    catch (error) {
        throw new ApiError(400, error.message || 'invalid refresh token')

    }
})
// module.export = {
//     registerUser,
//     login,
//     logout,
//     refreshAccessToken,
// }
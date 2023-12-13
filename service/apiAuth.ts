import argon2 from 'argon2'
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const register = async (req, res) => {
    const { username, fullname, password, phone, email, address, role } = req.body
    console.log(req.body);
    if (!username || !password) {
        return res.status(400)
            .json({ success: false, message: 'Missing username or password' })
    }
    try {
        // check người dùng đã tồn tại chưa 
        const user = await User.findOne({ username })
        const checkEmail = await User.findOne({ email })
        console.log('user', user)
        if (user) {
            return res.status(400).json({ success: false, message: 'Tài khoản đã tồn tại' });
        }
        if (checkEmail) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }
        const hashPassword = await argon2.hash(password)
        const newUser = new User({ username, fullname, password: hashPassword, phone, email, address, role: 0 })

        await newUser.save()

        //return token
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ success: true, message: 'success', accessToken })

    } catch (error) {
        console.log(error);
    }
}
const login = async (req, res) => {
    const { username, password } = req.body
    console.log('req.body', req.body)
    if (!username || !password) {
        return res.status(400)
            .json({ success: false, message: 'Missing username or password' })
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác !' })
        }
        const passwordInvalid = await argon2.verify(user.password, password)
        if (!passwordInvalid) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác !' })
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({ success: true, message: 'User logged in successfully', accessToken, user })
    } catch (error) {
        console.log(error);
    }
}
module.exports = { register, login }

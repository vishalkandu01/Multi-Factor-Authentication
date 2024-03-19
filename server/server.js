const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const randomize = require('randomatic')
const dotenv = require('dotenv')

const app = express()

dotenv.config({
    path: './.env'
})

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT


const dbConnect = async () => {
    const mongoUri = `${process.env.MONGO_URI}/${process.env.DB_NAME}`

    try {
        const connectionInstance = await mongoose.connect(mongoUri)
        console.log(`connectionInstance host is ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error('mongoose connection error: ', error)
        process.exit(1);
    }
}

dbConnect();



const User = mongoose.model('User', {
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    }
})



const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP Verification',
            text: `YOUR OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Email Error Occurs:', err);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });

    } catch (error) {
        console.error('Error sending email:', error);
    }
};


app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)

    try {
        const user = await User.findOne({ email, password })
        if (!user) {
            return res.json(
                {
                    success: false,
                    message: 'Invalid credentials'
                }
            )
        }

        const generatedOtp = randomize('0', 6);
        user.otp = generatedOtp;
        await user.save();

        sendOtpEmail(email, generatedOtp);

        return res.json({ success: true })

    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'An error occurred during login'
            }
        );
    }
})


app.post('/auth/verify-otp', async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await User.findOne({ otp });

        if (!user) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        user.otp = '';
        await user.save();

        return res.json({ success: true });

    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        return res.status(500)
            .json(
                {
                    success: false,
                    message: 'An error occurred during OTP verification'
                }
            );
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
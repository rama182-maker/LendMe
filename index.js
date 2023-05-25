const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000;
const User = require('./api/models/user.schema');

const authRoutes = require('./api/routes/auth.route');
const { checkAccessToken } = require('./api/middleware/auth.middleware');
const userRoutes = require('./api/routes/user.route');

app.use(cookieParser())
app.use(express.json())

app.use(authRoutes);
app.use(userRoutes);

const dbURI = "mongodb://localhost:27017/lendme"

mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((result) => {
    app.listen(PORT,() => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
})
.catch((err) => console.log(err))

app.get("/", (req, res) => {
    res.status(200).send("API is live !");
  });
  
app.get("/profile",checkAccessToken, async (req, res) => {
    const user = await User.findById(req.userData.id);
    res.status(200).send(user.name+"'s Profile page is live !");
})
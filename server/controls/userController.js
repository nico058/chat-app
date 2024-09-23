const User = require('../model/userModel')
const bcrypt = require('bcrypt')

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const usernameCheck = await User.findOne({ username })
    if (usernameCheck) {
      return res
        .status(400)
        .json({ message: 'Username already used', status: false })
    }

    const emailCheck = await User.findOne({ email })
    if (emailCheck) {
      return res
        .status(400)
        .json({ message: 'Email already used', status: false })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      username: username, //versione estasa con ripetizione del nome della variabile
      email, //JS ricorda la variabile che vuoi salvare con lo stesso nome scriendolo solo una volta
      password: hashedPassword, //qui devo indicare la variabile perché hanno nomi diversi
    })
    delete user.password

    console.log(user)

    // return res.json({status: true, user});

    return res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    next(error)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.json({
        message: 'Incorrect username or password',
        status: false,
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.json({
        message: 'Incorrect username or password',
        status: false,
      })
    }
    delete user.password

    return res.json({ status: true, user })
  } catch (error) {
    next(error)
  }
}

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id
    const avatarImage = req.body.image
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    })
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    })
  } catch (error) {
    next(error)
  }
}

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ])
    return res.json(users)
  } catch (error) {
    next(error)
  }
}

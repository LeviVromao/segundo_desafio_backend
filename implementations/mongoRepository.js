const { userModel } = require("../database/mongo")

const findByEmail = async (email) => {
    try {
        const user = await userModel.findOne({email})
        return user
    } catch (error) {
        console.error(error)
    }
}

const findByID = async (id) => {
    try {
        const user = await userModel.findById(id)
        return user
    } catch (error) {
        console.error(error)        
    }
}

const updateLastLogin = async (email) => {
    const date = new Date()
    const actualDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    const user = await findByEmail(email)
    const updatedUser = await userModel.findOneAndUpdate({email: user.email}, {
        lastLogin: actualDate,
        updatedAt: actualDate
    })

    await updatedUser.save()
    return updatedUser
}

const save = async (user) => {
    try {
        const newUser = new userModel(user)
        await newUser.save()
        return newUser
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    findByEmail,
    save,
    updateLastLogin,
    findByID
}
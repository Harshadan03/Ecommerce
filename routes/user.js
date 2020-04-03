const express = require('express')
const router = express.Router()

const { requireSignIn, isAdmin, isAuth } = require('../controllers/auth')
const { userById, readUserProfile, updateUserProfile, purchaseHistory } = require('../controllers/user')

router.get('/secret/:userId', requireSignIn, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})

router.get("/user/:userId", requireSignIn, isAuth, readUserProfile)
router.put("/user/:userId", requireSignIn, isAuth, updateUserProfile)

router.get("/order/by/user/:userId", requireSignIn, isAuth, purchaseHistory)


router.param("userId", userById)

module.exports = router
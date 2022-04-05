import express from 'express';
const router = express.Router();

const ADMIN_USERS = [
    {
        username: 'admin',
        password: 'admin',
        role: 'ADMIN',
    }
];

/* admin login */
router.post('/login', async function login(req, res, next) {
    console.log({"params:": req.params, "body:": req.body});
    try {
        let success = true, message = "Login successful";
        const user = ADMIN_USERS.filter(user => user.username === req.body.username)[0] ?? {};
        if (typeof user.username === "undefined") {
            res.json({
                success: false, message: "Invalid username.", user: {}
            })
        }
        // console.log({user})
        const validPassword = user.password === req.body.password;

        if (validPassword) res.json({
            success, message, user
        }); else res.json({
            success: false, message: "Invalid password", user: {}
        });
    } catch (err) {
        console.error(`Error while logging in. `, err.message);
        next(err);
    }
});

export default router;

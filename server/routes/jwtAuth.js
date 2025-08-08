const router = require("express").Router();

//create_account
router.post("/", async (req, res) => {
    try{
        
        const {username, name, email, password} = req.body
        const user = await pool.query("SELECT * FROM tenants WHERE tenant_email = $1", [
            email
        ]);

        if(user.rows.length !== 0) {
            return res.status(401).send("User Already in use!")
        }
        
        const saltRound = 10;
        const salt = bcrypt.genSalt(saltRound)
        (saltRound);

        const bcryptPassword = bcrypt.hash(password, salt);

        const newUser = await pool.query("INSERT INTO tenants (tenant_username, tenant_name, tenant_email, tenant_password) VALUES ($1, $2, $3)", [username, name, email, bcryptPassword]);

    } catch (err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = router;
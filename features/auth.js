function auth(app, con){
    //10 mins
    const cookieTime = new Date(Date.now() + 1 * 60000)

    app.get('/auth', function(req,res) {
        con.query("Select * from temp;", function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        res.end("Auth Server");     
    })

    /// Registration Function 
    app.post('/register', function(req,res) {
        const email = req.body.email 
        const name = req.body.name 
        const password = req.body.password 

        if(password == null || email == null || name == null){
            res.status(401).json({message: "User not successful created", error: "missing fields"})
            return
        }
        var sql = `INSERT INTO users (name, email, password) VALUES ("${name}", "${email}", "${password}")`;

        con.query(sql, function (err, result) {
            if (err) {
                res.status(401).json({
                    message: "User not successful created",
                    error: err.sqlMessage,
                  });
                  return 
            }

            sql= `select id from users where email = "${email}";`
            con.query(sql, function (err, result) {
                id = result[0]["id"];
                
                res.cookie("user_id", id, {
                    expires: cookieTime
                }).status(200).json({
                    message: "User successfully created",
                    user_data: {
                        id: id,
                        email: email,
                        name: name , 
                        isVolunteer: false, 
                        isJudge: false, 
                        role: "user"
                    },
                })
            });            
          });
    })

    /// Login Function 
    app.post('/login', function(req,res) {
        const email = req.body.email
        const password = req.body.password 

        if(password == null || email == null){
            res.status(401).json({message: "Login Failed", error: "missing fields"})
            return
        }

        var sql = sql= `select * from users where email = "${email}";`; 
        con.query(sql, function (err, result) {
            if (err) {
                res.status(500).json({message: "Login Failed", error: "server error"})
                return
            }

            if (result.length == 0){
                res.status(404).json({message: "Login Failed", error: "user not found"})
                return
            }

            if (password != result[0]["password"]){
                res.status(401).json({message: "Login Failed", error: "incorrect password"})
                return
            }

            console.log(result); 
            const id = result[0]["id"];
            const name = result[0]["name"];
            const isVolunteer = result[0]["isVolunteer"];
            const isJudge = result[0]["isJudge"];
            const role = result[0]["role"];
            

            res.cookie("user_id", id, {
                expires: cookieTime
            }).status(200).json({
                message: "Auth Success",
                user_data: {
                    id: id,
                    email: email,
                    name: name , 
                    isVolunteer: isVolunteer, 
                    isJudge: isJudge, 
                    role: role
                },
            })
        });   

    })
}

module.exports = auth
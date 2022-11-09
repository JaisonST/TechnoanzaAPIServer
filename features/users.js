function user_functions(app,con){
    //get user details by id 
    app.get('/user/id/:id', function(req,res) {
        con.query(`Select * from users where id = ${req.params.id};`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            if (p=="[]"){res.status(404).json({message: "User not found", error: "invalid id"})
            return}
            else res.end(p);
        });
    })

    //get user details by email
    app.get('/user/email/:email', function(req,res) {
        con.query(`Select * from users where email = "${req.params.email}";`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            if (p=="[]"){res.status(404).json({message: "User not found", error: "invalid email"})
            return}
            else res.end(p);    
        });
    })

    
    //get total registered user count 
    app.get('/user/count', function(req,res) {
        con.query(`select count(distinct id) as count from users;`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            //console.log(result[0]['count'])
            if (p=="[]"){
                res.status(404).json({message: "User not found", error: "invalid email"})
                return
            }
            else res.end(p);    
        });
    })
}

module.exports = user_functions

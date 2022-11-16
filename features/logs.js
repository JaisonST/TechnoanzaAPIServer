function logging(app,con){
    
    app.post('/log',function(req,res){
        const date = new Date().toISOString().replace('T', ' ').slice(0,-1);
        const email = req.body.email;
        const eventname = req.body.eventname
        con.query(`insert into logs(date,email,event) values("${date}","${email}","${eventname}")`)
        res.end(JSON.stringify({'message':'success'}));
    })

    //get total logs count
    app.get('/logs/count', function(req,res) {
        con.query(`Select count(email) as count from logs;`, function (err, result) {
            if (err) throw err;
            res.end(JSON.stringify(result[0]));    
        });
    })

    app.get('/getlogs/:email',async function(req,res){
        const email = req.params.email;
        if (await usercheck(email)){
            con.query(`select * from logs where email = "${email}"`,function(err,result){
                if (err) throw err
                else{
                    res.end(JSON.stringify({'logs':result}))
                }
            })
        }
        else res.status(404).json({message: "User not found", error: "invalid email"})

    })

    async function usercheck(email){
        return new Promise(function(resolve,reject){
            con.query(`select * from users where email = "${email}"`,function(err,result){
                if (err)return reject(err);
                if(result.length==0)resolve(false)
                else resolve(true);
            });
        });
    }
}
module.exports = logging

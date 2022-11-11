function admin_functions(app,con){
    //add judge
    app.get('/admin/judge/:id', function(req,res){
        con.query(`Update users set isJudge=true where id = ${req.params.id}`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            if (p=="[]"){
                res.status(404).json({message: "User not found", error: "invalid id"})
                return
            }
            else res.end("Judge Added");
        });
    })

    //add volunteer
    app.get('/admin/volunteer/:id', function(req,res) {
        con.query(`Update users set isVolunteer=true where id = ${req.params.id}`,function(err,result){
            if (err) throw err;
            p=JSON.stringify(result);
            if (p="[]"){
                res.status(404).json({message: "User not found",error: "invalid id"})
                return
            }
            else res.end("Volunteer Added")
        });
    })
}

module.exports = admin_functions

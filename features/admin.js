function admin_functions(app,con){
    //add new judge
    app.get('/admin/addjudge/:id', function(req,res) {
        con.query(`Update users set isjudge = True where id = ${req.params.id};`, function (err, result) {
            if (err) throw err;
            p=result['affectedRows'];
            if (p==0){
                res.status(404).json({message: "User not found", error: "invalid id"})
                return
            }
            else res.end('{message:"Judge Added"}');
        });
    })
    
    //add new volunteer
    app.get('/admin/addvolunteer/:id', function(req,res) {
        con.query(`Update users set isvolunteer = True where id = ${req.params.id};`, function (err, result) {
            if (err) throw err;
            p=result['affectedRows'];
            if (p==0){
                res.status(404).json({message: "User not found", error: "invalid id"})
                return
            }
            else res.end("{message:'Volunteer Added'}");
        });
    })

    //remove judge
    app.get('/admin/removejudge/:id', function(req,res) {
        con.query(`Update users set isjudge = False where id = ${req.params.id};`, function (err, result) {
            if (err) throw err;
            p=result['affectedRows'];
            if (p==0){
                res.status(404).json({message: "User not found", error: "invalid id"})
                return
            }
            else res.end("{message:'Judge Removed'}");
        });
    })

    //remove volunteer
    app.get('/admin/removevolunteer/:id', function(req,res) {
        con.query(`Update users set isvolunteer = False where id = ${req.params.id};`, function (err, result) {
            if (err) throw err;
            p=result['affectedRows'];
            if (p==0){
                res.status(404).json({message: "User not found", error: "invalid id"})
                return
            }
            else res.end("{message:'Volunteer Removed'}");
        });
    })
}

module.exports = admin_functions
function user_functions(app,con){
    //get user details by id 
    app.get('/user/id', function(req,res) {
        res.end(JSON.stringify({"error": "unimplimented"}));     
    })

    //get user details by email
    app.get('/user/email', function(req,res) {
        res.end(JSON.stringify({"error": "unimplimented"}));     
    })
    
    //get total registered user count 
    app.get('/user/count', function(req,res) {
        res.end(JSON.stringify({"error": "unimplimented"}));     
    })
}

module.exports = user_functions
function auth(app, con){
    app.get('/db', function(req,res) {
        con.query("Select * from temp;", function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        res.end("Auth Server");     
    })
}

module.exports = auth
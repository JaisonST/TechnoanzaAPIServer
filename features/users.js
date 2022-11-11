const e = require("express");
const { json } = require("express");
const { eventNames } = require("../db");

function user_functions(app,con){
    //get user details by id 
    app.get('/user/id/:id', function(req,res) {
        con.query(`Select * from users where id = ${req.params.id};`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            if (p=="[]"){
                res.status(404).json({message: "User not found", error: "invalid id"})
                return
            }
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
        con.query(`Select count(id) as count from users;`, function (err, result) {
            if (err) throw err;
            res.end(JSON.stringify(result));    
        });
    })

    //get events using user email
    app.get('/user/getevents/:email',async function(req,res){
        var event_list = [];
        var o, uemail = req.params.email;
        
        con.query(`Select eventname,id from events;`, async function (err, result) {
            if (err) throw err;
            for (var i in result){
                o = {'eventname':result[i]['eventname'],
                'id':result[i]['id']};
                if(await check(o['eventname'],uemail)==true)event_list.push(o);
            }
            res.end(JSON.stringify({'events':event_list}));
            
        });
    
    //check if email is registered for the event
    async function check (event,uemail){
        return new Promise(function(resolve,reject){
            con.query(`Select * from ${event} where ${event}.email = "${uemail}";`, function (err, rr) {
            if (err) return reject(err);
            if (1 == rr.length)resolve(true);
            else resolve(false);
            });
        });
    }})
}

module.exports = user_functions

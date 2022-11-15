function events_functions(app, con){
        
        app.post('/events/getscore',function(req,res){
            var round = req.body.round;
            var table = req.body.event + "scores";
            con.query(`select teamid from ${table} where round = ${round} order by score desc`,
            function(err,result){
                if (err){
                   if (err.code == "ER_NO_SUCH_TABLE") res.status(401).json({message: "No Scores Fetched", error: "Event has no entries"});
                   else if(err) throw err;
                }
                else res.end(JSON.stringify({"teams":result}))
            });
        })

        app.post('/events/setscore', async function(req,res) {
        var score = req.body.score
        var members = req.body.members
        var round = req.body.round
        var eventname = req.body.event
        var teamid = "";members.sort();members.forEach(element => teamid+=element);
        var table=`${eventname}scores`;
        if (await make_score_table(table,round,teamid)){
            var query = `insert into ${table}(round,teamid,score) values( ${round}, "${teamid}" , ${score} )`
            con.query(query,function(err,result){
                if (err) throw er;
                else {res.end(JSON.stringify({"message":"Score Added"}))}
            });
        }
        else res.status(401).json({message: "Score not registered", error: `Team score exists for round ${round}`});
    })

    async function make_score_table(table,round,teamid){
        return new Promise(function(resolve, reject) {
            con.query(`CREATE table if not exists ${table}(round int, teamid varchar(200),score int)`,
            async function(err,result){
                if (await check_dupl(table,round,teamid)) resolve(true);
                else resolve(false);
            });
        });
    }

    async function check_dupl(table,round,teamid){
        return new Promise(function(resolve, reject) {
            con.query(`select * from ${table} where round = ${round} && teamid = "${teamid}"`,
            function(err,result){
                if (err) reject(err);
                else if (result.length == 0)resolve(true);
                else resolve(false);
            });
        })
    }
    
    async function check_event_exists(event_name){
        var sql = `select count(*) from events where eventName = "${event_name}";`; 
        return new Promise(function(resolve, reject) {
            con.query(sql, function (err, result) {
                if (err) return reject(err);
                if(result[0]["count(*)"] == 0)
                    resolve(false);
                else 
                    resolve(true); 
            });
        });
    }

    async function create_table(event_name){
        var sql = `insert into events(eventName) values("${event_name}");`; 
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        sql = `Create table ${event_name}(email varchar(100) NOT NULL, teamName varchar(50) NOT NULL, teamid varchar(200) NOT NULL, Foreign Key(email) references users(email));`;
        return new Promise(function(resolve, reject) {
            con.query(sql, function (err, result) {
                if (err) return reject(err);
                resolve(result); 
            });
        });
    } 

    async function check_users_exists(members){
        sql = `select count(*) from users where email in(`;
        var email_list = [];
        for (var i in members){
            var uemail = members[i]["email"]; 
            sql = sql + '"'+ uemail + '",';  
            email_list.push(uemail); 
        }
        sql = sql.slice(0, -1) + `);`;
        return new Promise(function(resolve, reject) {
            con.query(sql, function (err, result) {
                if (err) return reject(err); 
                if(result[0]["count(*)"] < email_list.length){
                    resolve(false);
                };
                resolve(true); 
            });
        });
    } 

    async function check_users_registered(members, event_name){
        var sql = `select count(*) from ${event_name} where email in(`;
        var email_list = [];
        for (var i in members){
            var uemail = members[i]["email"]; 
            sql = sql + '"'+ uemail + '",';  
            email_list.push(uemail); 
        }
        sql = sql.slice(0, -1) + `);`;
        return new Promise(function(resolve, reject) {
            con.query(sql, function (err, result) { 
                if(result[0]["count(*)"] == 0){
                    resolve(false);
                };
                resolve(true); 
            });
        });
    }

    async function create_event_registration(event_name, members, team_name){
        //iterate thro members and generate sql command 
        var sql = `insert into ${event_name}(email, teamName, teamid) Values `;
        //1.generate team id
        var teamid= ""; 
        for (var i in members){
            teamid = teamid + members[i]["email"]; 
        }
         
        //2.generate values 
        for (var i in members){
            var value = `("${members[i]["email"]}", "${team_name}", "${teamid}"),`; 
            sql = sql + value; 
        }
        sql = sql.slice(0, -1) + ";";
        

        return new Promise(function(resolve, reject) {
            con.query(sql, function (err, result) {
                if (err) return reject(err);
                resolve(result); 
            });
        });
    } 
    ///register users for events (workshops + competitions)
    app.post('/events/registration', async function(req,res) {
    
        const event_name = req.body.event
        const members = req.body.members
        const team_name = req.body.team_name

        if(event_name == null || members == null || team_name == null || members.length == 0 ){
            res.send(JSON.stringify({message: "Team not registered", error: "missing fields"}))
            return;
        }

        try{
            const event_exists = await check_event_exists(event_name); 
            if (!event_exists){var table_creation = await create_table(event_name);} 
            const check_users = await check_users_exists(members); 
            if (!check_users){
                //res users dont exists
                res.status(401).json({message: "Team not registered", error: "user not found"});    
                return;  
            }
            
            const check_registered = await check_users_registered(members, event_name); 
            if (check_registered){
                //res users dont exists
                res.status(401).json({message: "Team not registered", error: "user already registered"});    
                return;  
            }

            const create_registration = await create_event_registration(event_name, members, team_name); 
            res.status(200).json({message: "success"}); 

        }catch(e){
            console.log(e); 
            res.status(500).json({message: "Team not registered", error: "Server error"}); 
        } 
    })
    ///get all events
    app.get('/events/get_events', function(req,res){
        con.query(`Select * from events;`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            if (p=="[]"){
                res.status(404).json({message: "No event created", error: "No events"})
                return
            }
            else res.end(p);
        });
    })
    ///get users registered for a particular event
    app.get('/events/get_registered_users/:event_name', function(req,res){
        con.query(`Select email from ${req.params.event_name};`, function (err, result) {
            if (err) throw err;
            p=JSON.stringify(result);
            if (p=="[]"){
                res.status(404).json({message: "No users registered for this event", error: "No registered users"})
                return
            }
            else res.end(p);
        });
    })
    ///get teams for a particular event
     app.get('/events/get_registered_teams/:event_name', function(req,res){
        con.query(`Select * from ${req.params.event_name} order by teamid;`, function (err, result) {
            if (err) throw err;
            var final_result = [];
            var i = 0;
            while (i<result.length) {
                var members = [];
                var j = i;
                while (result[j]["teamid"] == result[i]["teamid"]){
                    members.push({email:result[j]["email"]});
                    j++;
                    if (j==result.length){
                        break;
                    }
                }
                final_result.push({teamName:result[i]["teamName"],members});
                i = j;
            }               
            p=JSON.stringify(final_result);
            if (p=="[]"){
                res.status(404).json({message: "No users registered for this event", error: "No registered users"})
                return
            }
            else res.end(p);
        });
    })   
}

module.exports = events_functions

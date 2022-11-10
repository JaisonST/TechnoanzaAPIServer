
function events_functions(app, con){

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

    async function check_uesrs_exists(members){
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

    async function check_users_registerd(members, event_name){
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
            const check_users = await check_uesrs_exists(members); 
            if (!check_users){
                //res users dont exists
                res.status(401).json({message: "Team, not registered", error: "user not found"});    
                return;  
            }
            
            const check_registered = await check_users_registerd(members, event_name); 
            if (check_registered){
                //res users dont exists
                res.status(401).json({message: "Team, not registered", error: "user already registered"});    
                return;  
            }

            const create_registration = await create_event_registration(event_name, members, team_name); 
            res.status(200).json({message: "success"}); 

        }catch(e){
            console.log(e); 
            res.status(500).json({message: "Team not registered", error: "Server error"}); 
        } 
    })
}

module.exports = events_functions
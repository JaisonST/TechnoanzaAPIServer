# Technovanza API Server
This is the docs to use the API's for the technovanza website 2022. 

## Setup

Complete the following steps to setup the project. 

1. Setup packages 


```bash
npm install 
```

Execute the above command to setup the required packages. 

2. Setup SQL database 

```bash
mysql -u root -p technovanza < dump.sql
```

3. Create variables file 
```bash
touch .env
```

After creating the .env file, open it and add the following values to it. 

```
DB_HOST=(localhost)
DB_USER=(root)
DB_PASSWORD=(password)
DB_DATABASE=(Technovanza)
```

You should now be able to run the below to start the server in dev mode. 

``` 
npm run dev 
```


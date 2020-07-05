const http=require('http');
const app=require('./app');
const port= process.env.PORT ||3000;
//when a req came run the server
//run the function that pass via create Server
const server= http.createServer(app);
//listen the server function on  port
server.listen(port);
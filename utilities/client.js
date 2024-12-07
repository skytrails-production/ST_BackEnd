const {createClient}=require('redis');
const client=createClient({url:"redis://localhost:6379"});


client.on('error',(err)=>{
    console.log('Error====',+err);
}).on('connect',()=>{
    console.log('Connected to Redis');
    });


    // client.connect();

    module.exports=client;



const {createClient}=require('redis');
// const client=createClient({url:"redis://localhost:6379"});


// client.on('error',(err)=>{
//     console.log('Error====',+err);
// }).on('connect',()=>{
//     console.log('Connected to Redis');
//     });


//     // client.connect();

//     module.exports=client;
    const client = createClient(
        {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASS,
        socket: {
            host: process.env.REDIS_SOCKET_HOST,
            port: process.env.REDIS_SOCKET_PORT
        }
    }
);
   client.on('error',(err)=>{
    console.log('Error====',+err);
}).on('connect',()=>{
    console.log('Connected to Redis');
    });
    
     client.connect();
    
     module.exports=client;
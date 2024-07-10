const cron = require('node-cron');
// const AWS = require('aws-sdk');
// const { exec } = require('child_process');

// // Configure AWS
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-1'
// });



// //backup command for mongodb

// const backupDatabase = () => {
//     return new Promise((resolve, reject) => {
//         // MongoDB backup command
//         const backupCommand = `mongodump --uri="${process.env.MONGO_URL}" --archive --gzip`;

//         // Execute the backup command
//         exec(backupCommand, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`mongodump error: ${error.message}`);
//                 reject(error);
//                 return;
//             }
//             if (stderr) {
//                 console.error(`mongodump stderr: ${stderr}`);
//                 reject(new Error(stderr));
//                 return;
//             }
            
//             // Backup command executed successfully
//             const params = {
//                 Bucket: process.env.AWS_BUCKET_NAME,
//                 Key: `backup/backup-${new Date().toISOString()}.gz`,
//                 Body: stdout // Use stdout as the backup data
//             };

//             // Upload backup data to S3
//             s3.upload(params, (err, data) => {
//                 if (err) {
//                     console.error(`Error uploading backup to S3: ${err.message}`);
//                     reject(err);
//                 } else {
//                     console.log('Backup completed and uploaded to S3.');
//                     resolve(params.Key); // Resolve with the uploaded backup filename
//                 }
//             });
//         });
//     });
// };





// // Function to delete old backups from S3
// // const deleteOldBackups = async () => {
// //     const params = {
// //         Bucket: process.env.AWS_BUCKET_NAME
// //     };

// //     try {
// //         const objects = await s3.listObjectsV2(params).promise();
// //         const backups = objects.Contents;

// //         if (backups.length > 3) {
// //             // Sort backups by date
// //             backups.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

// //             // Delete backups older than the 3 most recent ones
// //             const oldBackups = backups.slice(3);
// //             const deleteParams = {
// //                 Bucket: process.env.AWS_BUCKET_NAME,
// //                 Delete: {
// //                     Objects: oldBackups.map((backup) => ({ Key: backup.Key })),
// //                 },
// //             };

// //             await s3.deleteObjects(deleteParams).promise();
// //             console.log('Old backups deleted from S3.');
// //         }
// //     } catch (error) {
// //         console.error('Error deleting old backups from S3:', error);
// //         throw error; // Propagate the error for error handling
// //     }
// // };



// const scheduleTime = new Date();
// scheduleTime.setMinutes(scheduleTime.getMinutes() + 1);

// const minutes = scheduleTime.getMinutes();
// const hour = scheduleTime.getHours();
// const day = scheduleTime.getDate();
// const month = scheduleTime.getMonth() + 1;



// // Schedule the task
// cron.schedule(`${minutes} ${hour} * * *`, async () => {
//     try {
//         console.log('Running database backup task...');
        
//         await backupDatabase();
//         // await deleteOldBackups();
//         console.log('Backup task completed.');
//     } catch (error) {
//         console.error('Backup task failed:', error);
//     }
// });
//import fs from 'fs';
import AWS from 'aws-sdk';
import imageCompression from 'browser-image-compression';


// Enter copied or downloaded access id and secret here
const ID = 'AKIAVJYVTJEDV3DLGHNM';
const SECRET = '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';

// Enter the name of the bucket that you have created here
const S3_BUCKET = 'membersphoto';
const REGION ='ap-south-1';

AWS.config.update({
    accessKeyId: ID,
    secretAccessKey: SECRET
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

export { handleImageUpload };

const uploadFile = async (file) => {
    // read content from the file
    //const fileContent = fs.readFileSync(file);
    debugger;
    //return fileContent;
    // setting up s3 upload parameters
    const params = {
        ACL: 'public-read',
        Bucket: S3_BUCKET,
        Key: file.name, // file name you want to save as
        Body: file
    };

    // Uploading files to the bucket
    return await myBucket.upload(params
        /*, function(err, data) {
        debugger;
        if (err) {
            throw err
        }
        console.log(`File uploaded successfully. ${data.Location}`)}*/
    ).promise();
};


const handleImageUpload = async (imageFile) => {

    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024} KB`);

    var options = {
        maxSizeMB: 0.25,
        //maxWidthOrHeight: 1000,
        useWebWorker: true
    }

    debugger;
    return await imageCompression(imageFile, options)
    .then(async (compressedFile) => {
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024} KB`); // smaller than maxSizeMB

        const params = {
            ACL: 'public-read',
            Bucket: S3_BUCKET,
            Key: compressedFile.name, // file name you want to save as
            Body: compressedFile
        };
        //return params;
        var data = await uploadFile(compressedFile);
        debugger;
        return data;
    })
    .catch(function (error) {
        console.log(error.message);
    });
}
require("dotenv").config();
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

//pinata API 정보
const pinataApiKey = process.env.PINATA_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_KEY;

exports.pinataUpload  = async (filePath)=>{
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    let data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    return axios.post(url, data, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
        }
    })
    .then(function (response) {
        //handle response here
        return response.data.IpfsHash;
    })
    .catch(function (error) {
       console.log(error);
    });
}
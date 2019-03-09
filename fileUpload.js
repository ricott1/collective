// Import
const FileStorage = require('@skalenetwork/filestorage-js');
const Web3 = require('web3');
 
// Setup with web3
const web3Provider = new Web3.providers.HttpProvider('http://104.248.242.122:8003/');
let web3 = new Web3(web3Provider);
let filestorage = new FileStorage(web3);
 
// Setup with host directly
let filestorage = new FileStorage(host = 'http://104.248.242.122:8003/');


//get file data from file upload input data
let file = document.getElementById('files').files[0];
let reader = new FileReader();

//file reader method to upload file
reader.onload = async function(e) {
  let link = filestorage.uploadFile(
    account, 
    file.name, 
    file.size, 
    reader.result 
    true, 
    pivateKey
  );
};
reader.readAsArrayBuffer(file);
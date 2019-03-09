
export async function upload(jsoninput, filename, account, privateKey){
	//let privateKey = "0x828146b3a9105a3e8db44247105ef4e16ee0f15146a7884fc9859e7f03f93ecd";
	var providerUrl = "http://104.248.242.122:8003";
	const FileStorage = require('@skalenetwork/filestorage-js');
	const Web3 = require('web3');
	const PrivateKeyProvider = require("truffle-privatekey-provider");
	const web3Provider = new PrivateKeyProvider(privateKey, providerUrl);
	let web3 = new Web3(web3Provider);
	let filestorage = new FileStorage(web3);
	 
	//let account = "0xCbD3833f696f3D50d9a2266eFE514E0807898c30";
	
	let jsondata = Buffer.from(JSON.stringify(jsoninput));
    let buffer = new ArrayBuffer(jsondata.length);
    let data = jsondata.buffer;
	await filestorage.uploadFile(
	    account, 
	    name, 
	    jsondata.length, 
	    data, 
	    true, 
	    privateKey
	  );
}

// export async function upload(fileName, fileSize, fileData){
//   let { account, filestorage} = store.getState().web3;
//   let pivateKey = process.env.PRIVATE_KEY;

//   let jsondata = Buffer.from(JSON.stringify({test:"test"}));
//   let buffer = new ArrayBuffer(jsondata.length);
//   let data = jsondata.buffer;
//   await filestorage.uploadFile(account, "JSON5", 15, data, true, pivateKey);
// }
// }


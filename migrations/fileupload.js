export async function upload(json, filename, account, privatekey){
  //get filestorage instance
  let filestorage = new FilestorageClient(web3);

  let jsondata = Buffer.from(JSON.stringify(json));
  let buffer = new ArrayBuffer(jsondata.length);
  let data = jsondata.buffer;
  await filestorage.uploadFile(account, filename, jsondata.length, data, true, privatekey);
}
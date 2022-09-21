const path = require("path");
const fs = require('fs');
const Caver = require('caver-js');
const caver = new Caver('https://api.baobab.klaytn.net:8651/'); //테스트넷
//const caver = new Caver('https://klaytn-mainnet-rpc.allthatnode.com:8551'); // 메인넷
async function newinstance(privateKey){
    //트랜잭션 사인을 위한 개인키를 선언
    const wallet2 = caver.klay.accounts.privateKeyToAccount(privateKey)// 개인키
    //선언한 개인키를 월랫 인스턴스 추가
    caver.klay.accounts.wallet.add(wallet2)
    

}

async function getContract(contractAddress,abi){

    let deployedABI = fs.readFileSync(abi, 'utf-8');
    let myContract = new caver.contract(JSON.parse(deployedABI),contractAddress);
    console.log("success")
    return myContract
}

async function signedtran(inputData,account,contractAddress){
    let signedTransaction = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account, //내 주소
        to: contractAddress,// 컨트랙트 주소
        data: inputData,
       // nonce: nonce,
        gas: '500000'
    })
    let senderRawTransaction = await signedTransaction.rawTransaction //트랜잭션 서명
    // // feepayer 계정은 컨트렉을 배포 할때 사용한 계정으로...
    await caver.klay.sendTransaction({
    senderRawTransaction,
    feePayer: account
    })
    .once('transactionHash', transactionHash => {
    console.log('txHash', transactionHash)
    })
    .once('receipt', receipt => {
    console.log('receipt', receipt)
    })
}

async function minting(myContract,account, contractAddress, nonce,ipfsurl){
   // let imagefile = fs.readFileSync("C:\\horse_mint\\genesis_json_hash\\"+i+".json", "utf-8"); //대량민팅용 ipfs메타데이터 받을때 사용
   // let json_data = JSON.parse(imagefile);
   // console.log(json_data)
   // let json_hash = json_data.jsonhash
   // console.log(json_hash)
   // newnonce = nonce + addNonce;
   // console.log('newnonce=[', newnonce, ']');
    json_hash = ipfsurl
    myContract = getContract(contractAddress)
    
    let inputData = await myContract.methods.mintNFT(json_hash).encodeABI() // 컨트랙트 함수를 가져와 양식에 맞게 작성
    await signedtran(inputData,account,contractAddress,nonce)
}

async function burn(account, contractAddress, nonce,tokenid){
    
    getContract(contractAddress, contractABIpath)
    let inputData = await myContract.methods.burn(tokenid).encodeABI()
    await signedtran(inputData,account,contractAddress,nonce)
}

async function tranferNFT(from, to, contractAddress,nonce,tokenid) {
    getContract(contractAddress, contractABIpath)
    const inputData = await myContract.methods.transferFrom(from,to,tokenid).encodeABI()
    //1.보내는사람주소 2.받을사람 3.토큰id
    await signedtran(inputData,from,contractAddress,nonce)
}


async function mintBatch(account,contractAddress,privateKey,ipfsurl) {
    
    await newinstance(privateKey)
   // nonce = await caver.klay.getTransactionCount(account) //accountkey 삽입
   // console.log('nonce=[', nonce, ']'); 
   // nonce++;
    await minting(account, contractAddress,ipfsurl);//1. account 2. contract
        
      /*  for(i=51;i<101;i++){
            await minting('0x5e8b63991C61349eD5d3cF5B8C5D2e25eA0DcCcC','0x8C356B750Ad64355f3a92DaF40192ac145991191', nonce, addNonce, i);//1. account 2. contract
            addNonce++;
         }*/
        //await minting('0xE15C93e446C9E726d997017e222B2aA6C110009a','0x16082a5a3E72276d6a6F219170CB0094cD6382de', nonce, i-1, i );//1. account 2. contract
}

async function burnbatch(account,contractAddress,privateKey,tokenid) {
    newinstance(privateKey)
    nonce = await caver.klay.getTransactionCount("accountkey") //accountkey 삽입
    console.log('nonce=[', nonce, ']');
        
    
    burn(account, contractAddress, nonce,tokenid)
}

async function transferbatch(from,to,contractAddress,privateKey,tokenid){
    newinstance(privateKey)
    tranferNFT(from, to, contractAddress,nonce,tokenid)

}

   
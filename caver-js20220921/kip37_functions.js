const fs = require('fs')
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651/')
//37에서 민트는 추가발행
//creat가 발행
//safeTransferFrom 은 단일토큰전송
//safeBatchTransferFrom은 다중 전송(사용자가 아닌 여러토큰을 전송하는 메서드)
//setApprovalForAll 권한주기




async function create(owner,contract_address,tokenid,number) {

    const deployedABI = fs.readFileSync('./kip37deployedABI','utf-8')
    const myContract = new caver.contract(JSON.parse(deployedABI), contract_address)
    //배포한 컨트랙트 내부 함수를 사용하기위해 abi를 json 파일로 읽어 오고 컨트랙트 주소와 같이 가져온다.
    //console.log(myContract)//완료
    const ipfsUrl = "http://ipfs.io/ipfs/QmW19JHqRUagDvUoYxzzLRHwNZ8DCM4Mxy956cbLJfu3j3" //nft 데이터
    const inputData = await myContract.methods.create(tokenid, number,ipfsUrl ).encodeABI() // 발행
    console.log(inputData);
     // 컨트랙트 함수를 가져와 양식에 맞게 작성
    const signedTransaction = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: owner, //내 주소
        to: contract_address,// 컨트랙트 주소
        data: inputData,
        gas: '500000'
    })
    // 트랜잭션을 보내기위한 양식

    const senderRawTransaction = signedTransaction.rawTransaction //트랜잭션 서명

    // // feepayer 계정은 컨트렉을 배포 할때 사용한 계정으로...
    caver.klay.sendTransaction({
    senderRawTransaction,
     feePayer: owner
    })  
    .once('transactionHash', transactionHash => {
    console.log('txHash', transactionHash)
    })
    .once('receipt', receipt => {
    console.log('receipt', receipt)
    })
}
async function transfer(owner,contract_address,from,tokenid,number,to) {
  const deployedABI = fs.readFileSync('./kip37deployedABI','utf-8')
  const myContract = new caver.contract(JSON.parse(deployedABI), contract_address)
  //배포한 컨트랙트 내부 함수를 사용하기위해 abi를 json 파일로 읽어 오고 컨트랙트 주소와 같이 가져온다.
  const inputData = await myContract.methods.safeTransferFrom(owner,to, tokenid, number,from).encodeABI()
  // 1번 토큰 주인 2번 받는사람 3번 토큰id 4번 수량 5번 보내는사람
  const signedTransaction = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: owner, //내 주소
        to: contract_address,// 컨트랙트 주소
        data: inputData,
        gas: '500000'
    })
    // 트랜잭션을 보내기위한 양식

    const senderRawTransaction = signedTransaction.rawTransaction //트랜잭션 서명

    // // feepayer 계정은 컨트렉을 배포 할때 사용한 계정으로...
    caver.klay.sendTransaction({
    senderRawTransaction,
    
     feePayer: to
    })  
    .once('transactionHash', transactionHash => {
    console.log('txHash', transactionHash)
    })
    .once('receipt', receipt => {
    console.log('receipt', receipt)
    })

}
async function approve(owner,contract_address,to){
  const deployedABI = fs.readFileSync('./kip37deployedABI','utf-8')
  const myContract = new caver.contract(JSON.parse(deployedABI), contract_address)
  const inputData = await myContract.methods.setApprovalForAll(toadress,true).encodeABI()// 권한주기메서드
  const signedTransaction = await caver.klay.accounts.signTransaction({
    type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    from: owner, //내 주소
    to: contract_address,// 컨트랙트 주소
    data: inputData,
    gas: '500000'
})
// 트랜잭션을 보내기위한 양식

const senderRawTransaction = signedTransaction.rawTransaction //트랜잭션 서명

// // feepayer 계정은 컨트렉을 배포 할때 사용한 계정으로...
caver.klay.sendTransaction({
senderRawTransaction,

 feePayer: to
})  
.once('transactionHash', transactionHash => {
console.log('txHash', transactionHash)
})
.once('receipt', receipt => {
console.log('receipt', receipt)
})

}
async function createbatch(privatekey,owner,contract_address,tokenid,number) {

  wallet2 = caver.klay.accounts.privateKeyToAccount(privatekey);//배포자 개인키
  caver.klay.accounts.wallet.add(wallet2);
  await create(owner,contract_address,tokenid,number)
}
async function transferbatch(privatekey,owner,contract_address,from,tokenid,number,to){ //개인키,오너주소,컨트랙트주소,보내는사람=오너 대부분, 보낼 토큰id, 보낼 수량, 받는사람
  wallet2 = caver.klay.accounts.privateKeyToAccount(privatekey);//배포자 개인키
  caver.klay.accounts.wallet.add(wallet2);
  await transfer(owner,contract_address,from,tokenid,number,to)

}
async function approvebatch(privatekey,owner,contract_address,to){
  wallet2 = caver.klay.accounts.privateKeyToAccount(privatekey);//배포자 개인키
  caver.klay.accounts.wallet.add(wallet2);
  await approve(owner,contract_address,to)

}



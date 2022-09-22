const path = require("path");
const fs = require('fs');
const Caver = require('caver-js');
const { exit } = require("process");
function klaynetwork(network) {
    let caver;
    if (network == 'baobab') {
        caver = new Caver('https://api.baobab.klaytn.net:8651/'); //테스트넷
    } else if (network == 'ganache') {
        caver = new Caver('http://localhost:8545'); //테스트넷
    } else if (network == 'mainnet') {
        caver = new Caver('https://klaytn-mainnet-rpc.allthatnode.com:8551'); // 메인넷
    } else {
        caver = new Caver('https://api.baobab.klaytn.net:8651/'); //테스트넷
    }
    return caver;
};

async function deploy_kip17(caver,sender,name,symbol){
    /*
    기능 : kip-17 컨트랙트 배포
    caver = 네트워크
    sender = 현재 연결된 유저 (배포자)
    name = NFT 컨트랙트 이름
    symbol  = 짧은 이름
    */
    let tx = await caver.klay.KIP17.deploy({
        name: name,
        symbol: symbol,
    }, sender.address)
    console.log(tx._address)

    return tx._address
 }

 async function contract_abi(caver,contract_address){
    /*
    기능 : 배포된 컨트랙트 abi불러오기
    caver = 네트워크
    contract_address = 배포된 컨트랙트 주소
    */
    const kip17Instance  = new caver.klay.KIP17(contract_address)
    return kip17Instance
 }

 async function mint_NFT(caver,kip17Instance,sender,tokenURI){
    /*
    기능 : 배포된 컨트랙트 에서 NFT 발행
    caver = 네트워크
    kip17Instance = ABI
    sender = 현재 연결된 컨트랙트 주인
    tokenURI = 발행할 NFT 메타데이터
    */
    let token_id =await kip17Instance.totalSupply()
    let new_token_id = parseInt(token_id)+1
    let inputdata = await kip17Instance.mintWithTokenURI(sender.address, new_token_id, tokenURI,{ from: sender.address })
    return inputdata
    

 }

 async function approve(caver,kip17Instance,sender,receiver,tokenid){
    /*
    기능 : 배포된 컨트랙트 에서 특정 NFT에 대한 권한 주기
    caver = 네트워크
    kip17Instance = ABI
    sender = 현재 연결된 컨트랙트 주인
    receiver = 권한을 받을 사람
    tokenid = 권한을 줄 토큰 ID
    */
    let appv = await kip17Instance.approve(receiver, tokenid, { from: sender.address })
    return appv
 }

 async function NFT_transfer(caver,kip17Instance,sender,receiver,tokenid){
     /*
    기능 : NFT 보내기
    caver = 네트워크
    kip17Instance = ABI
    sender = 현재 연결된 컨트랙트 주인
    receiver = 받을 사람
    tokenid = 보내줄 토큰 ID
    */
    let tx = await kip17Instance.safeTransferFrom(sender.address, receiver, tokenid, { from: sender.address })
    return tx
 }

 async function NFT_burn(caver,kip17Instance,sender,tokenid){
    /*
    기능 : 컨트랙트에 배포된 NFT 삭제 시키기
    caver = 네트워크
    kip17Instance = ABI
    sender = 현재 연결된 컨트랙트 주인
    tokenid = 삭제할 NFT 토큰 ID
    */
    let burning = await kip17Instance.burn(tokenid, { from: sender.address })
    return burning
 }
async function pause(caver,kip17Instance,sender){
     /*
    기능 : 토큰 전송과 관련된 기능들을 중지
    caver = 네트워크
    kip17Instance = ABI
    sender = 현재 연결된 컨트랙트 주인
    */
    let pauser = await kip17Instance.pause({ from: sender.address })
    return pauser
}
async function unpause(caver,kip17Instance,sender){
     /*
    기능 : 토큰 전송과 관련된 기능들을 중지 해제
    caver = 네트워크
    kip17Instance = ABI
    sender = 현재 연결된 컨트랙트 주인
    */
    let unpauser = await kip17Instance.unpause({ from: sender.address })
    return unpauser
}


 async function batch(){
    let caver = await klaynetwork('baobab')
    const sender = caver.klay.accounts.wallet.add(caver.klay.accounts.privateKeyToAccount('privatekey'))
    let deploy = await deploy_kip17(caver,sender,"jbking","jkin")
    const kip17Instance = await contract_abi(caver,deploy)
    console.log('a')
    const mint  =await mint_NFT(caver,kip17Instance,sender,"메타데이터")
    console.log(mint.transactionHash)

 }

 batch()
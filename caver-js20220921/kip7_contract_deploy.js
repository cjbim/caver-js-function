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

async function deploy_kip7(caver,sender,name,symbol,supply){
    let total = supply * caver.utils.toPeb(1, 'KLAY')
    
    let tx = await caver.klay.KIP7.deploy({
        name: name,
        symbol: symbol,
        decimals: 18,
        initialSupply: total,
        },sender.address)
    console.log(tx._address)

    return tx._address

 }

async function contract_abi(caver,contract_address){
    /*
    기능 : 배포된 컨트랙트 abi불러오기
    caver = 네트워크
    contract_address = 배포된 컨트랙트 주소
    */
    const kip7Instance  = new caver.klay.KIP7(contract_address)
    return kip7Instance
 }

async function get_balance(caver,kip7Instance,owner){
    /*
    기능 : 계정의 토큰이 얼마 있는지 확인한다
    caver = 네트워크
    kip7Instance = 컨트랙트 abi    
    owner = 확인할 지갑 address 
    */
    let balance = await kip7Instance.balanceOf(owner.address).then(console.log)
    return balance
 }

async function totalSupply(caver,kip7Instance){
    /*
    기능 : 토큰의 총발행량 확인
    caver = 네트워크
    kip7Instance = 컨트랙트 abi     
    */
    let total = await kip7Instance.totalSupply().then(console.log)
    return total
 }


async function token_transfer(caver,kip7Instance,owner,receiver,amt){
    /*
    기능 : 토큰의 총발행량 확인
    caver = 네트워크
    kip7Instance = 컨트랙트 abi     
    owner = 보내는 사람
    receiver = 받는 사람 
    amt = 보내는 토큰의 갯수
    */
    let transfer = await kip7Instance.transfer(receiver, amt, { from: owner.address })
    return transfer
 }

async function approve(caver,kip7Instance,owner,receiver){
    /*
    기능 : 토큰 소유자의 토큰을 owner가 amount만큼 사용하도록 허락합니다
    caver = 네트워크
    kip7Instance = 컨트랙트 abi     
    owner = 주인
    receiver = 허락받을 자 
    amt = 허락받을 토큰의 갯수
    */
    let approver = await kip7Instance.approve(receiver, 10, { from: owner.address })
    return approver

 }
 async function token_mint(caver,kip7Instance,owner,amt){
    /*
    기능 : amt만큼 토큰을 만들어 account에게 발행합니다. 이 함수는 토큰 총 공급량을 증가시킵니다.
    caver = 네트워크
    kip7Instance = 컨트랙트 abi     
    owner = 주인
    amt = 추가발행 토큰의 갯수
    */
    let minter = await kip7Instance.mint(owner.address, amt, { from: owner.address }) // 1번 파라미터에 다른 계정의 주소넣어도 가능하다 
    return minter
 }

 async function burn(caver,kip7Instance,owner,amt){
    /*
    기능 : 토큰을 burn 시킵니다
    caver = 네트워크
    kip7Instance = 컨트랙트 abi     
    owner = 주인
    amt = burn할 토큰의 갯수
    */
    let burning = await kip7Instance.burn(amt, { from: owner.address })
 }

 

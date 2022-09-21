const fs = require('fs')
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651/')



async function getContract(contractAddress,deployedABI ){
    let myContract = new caver.contract(JSON.parse(deployedABI),contractAddress);
    //console.log("success")
    return myContract
}
async function kip7_getBalance(account) {
    let balance = await myContract.methods.balanceOf(account).call()
    return balance;
}

async function transfer(contract_address,owner,to,number) {
    let deployedABI = fs.readFileSync('./kip7deployedABI', 'utf-8');
    myContract = await getContract(contract_address,deployedABI)
    let estimategas = await myContract.methods.safeTransfer(to,number).estimateGas({'from':owner}) //가스값 추정하기
    let estimategsatransform = caver.utils.fromPeb(estimategas, 'KLAY')
    console.log("estimagegas1: ",estimategsatransform)
    console.log("estimagegas1: ",estimategas)

    console.log("estimagegas2: ",caver.utils.toPeb(estimategas, 'KLAY'))
    let inputData = await myContract.methods.safeTransfer(to, caver.utils.toPeb(number, 'KLAY') ).encodeABI()  //일반 보내기
    
     // 컨트랙트 함수를 가져와 양식에 맞게 작성
    const signedTransaction = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: owner, //내 주소
        to: contract_address,// 컨트랙트 주소
        data: inputData,
        gas: estimategas*2
     
    })
    // 트랜잭션을 보내기위한 양식

    const senderRawTransaction = signedTransaction.rawTransaction //트랜잭션 서명

    // feepayer 계정은 컨트렉을 배포 할때 사용한 계정으로...
    await caver.klay.sendTransaction({
    senderRawTransaction,
    feePayer: owner
    })
   /* .once('transactionHash', transactionHash => {
    console.log('txHash', transactionHash)
    })*/
    


}
async function multisend(contract_address,owner,to1,to2,number1,number2) {

    const deployedABI = fs.readFileSync('./kip7deployedABI','utf-8')
    const myContract = new caver.contract(JSON.parse(deployedABI), contract_address)
    //배포한 컨트랙트 내부 함수를 사용하기위해 abi를 json 파일로 읽어 오고 컨트랙트 주소와 같이 가져온다.
    //console.log(myContract)//완료
    const address= [to1,to2]
    const coin = [caver.utils.toPeb(number1, 'KLAY'),caver.utils.toPeb(number2, 'KLAY')]
    let estimategas = await myContract.methods.multisend(address, coin).estimateGas({'from':owner}) //가스값 추정하기
    console.log(estimategas)
    let inputData = await myContract.methods.multisend(address, coin).encodeABI() //멀티 샌드
    console.log(inputData);
     // 컨트랙트 함수를 가져와 양식에 맞게 작성
    const signedTransaction = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: owner, //내 주소
        to: contract_address,// 컨트랙트 주소
        value: inputData,
        gas: estimategas*2
    })
    // 트랜잭션을 보내기위한 양식

    const senderRawTransaction = signedTransaction.rawTransaction //트랜잭션 서명

    // // feepayer 계정은 컨트렉을 배포 할때 사용한 계정으로...
    caver.klay.sendTransaction({
    senderRawTransaction,
    feePayer: owner
    })
  /*  .once('transactionHash', transactionHash => {
    console.log('txHash', transactionHash)
    })*/


}

async function transferbatch(privatekey,contract_address,owner,to,number) {
    const wallet2 = caver.klay.accounts.privateKeyToAccount(privatekey);
    caver.klay.accounts.wallet.add(wallet2);
    let deployedABI = fs.readFileSync('./kip7deployedABI', 'utf-8');
    myContract = await getContract(contract_address,deployedABI)
    let total = await myContract.methods.totalSupply().call()
    console.log("totalSupply : ",caver.utils.fromPeb(total, 'KLAY'))
    let result = await kip7_getBalance(owner)
    console.log("ownerbalance: ",caver.utils.fromPeb(result, 'KLAY'))
    let result2 = await kip7_getBalance(to)
    console.log("tobalance: ",caver.utils.fromPeb(result2, 'KLAY'))
    await transfer(contract_address,owner,to,number)
    console.log("----------------------입금완료------------------------")
    let result3 = await kip7_getBalance(owner)
    console.log("ownerbalance: ",caver.utils.fromPeb(result3, 'KLAY'))
    let result4 = await kip7_getBalance(to)
    console.log("tobalance: ",caver.utils.fromPeb(result4, 'KLAY'))
}

async function multisendbatch(privatekey,contract_address,owner,to1,to2) { 
    let deployedABI = fs.readFileSync('./kip7deployedABI', 'utf-8');
    number1 = 5
    number2 = 10
    myContract = await getContract(contract_address,deployedABI)
   // console.log("myContract=[", myContract, "]")
   // console.log("myContract=[", myContract.address, "]")

    
    const wallet2 = caver.klay.accounts.privateKeyToAccount(privatekey); //privatekey insert
    //트랜잭션 사인을 위한 개인키를 선언
    caver.klay.accounts.wallet.add(wallet2);
    const result = await myContract.methods.balanceOf(owner).call()
    console.log(result)
    const result2 = await myContract.methods.balanceOf(to1).call()
    console.log(result2)
    await multisend(contract_address,owner,to1,to2,number1,number2)

    //const result2 = await myContract.methods.balanceOf(owner).encodeABI
    //console.log(result2)
}

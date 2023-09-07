// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


    

//주소.balance
//주소의 현재 갖고 있는 이더의 잔액을 의미함.  //  msg.value는 송금액

// msg.sender
// msg.sender는 스마트컨트랙을 사용하는 주체

contract Donation{
    event SendInfo(address _msgSender, uint256 _currentValue);
    event MyCurrentValue(address _msgSender,uint256 _value);
    event CurrentValueOfSomeone(address _msgSender, address _to, uint256 _value);


   //이더를 보낼라면 
    function sendEther(address payable _to) public payable {
        require (msg.sender.balance >= msg.value , "your balance is not enough, test");
        //트랜스퍼 함수를 통해 이더 송금
        _to.transfer(msg.value);
        //보낸 나의 주소, 내 잔고
         emit SendInfo(msg.sender, (msg.sender).balance);
    }
    //그냥 현재 잔고확인 함수
    function checkValueNow() public{
        emit MyCurrentValue(msg.sender, (msg.sender).balance);
    }
    //어떤 계정의 잔고 확인하고 싶을때, 확인하고 싶은 주소를 매개변수로 넣기
    function checkUserValue(address _to) public{
       emit CurrentValueOfSomeone(msg.sender, _to, _to.balance);
    }

}


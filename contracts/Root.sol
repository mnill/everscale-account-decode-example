pragma ton-solidity >= 0.51.0;
pragma AbiHeader pubkey;

library RootContractErrors {
    uint8 constant error_tvm_pubkey_not_set = 100;
    uint8 constant error_message_sender_is_not_my_owner = 101;
}

contract RootContract {

    mapping (address => uint128) private balances;
    uint32 private contractVersion;

    constructor() public {
        require(tvm.pubkey() != 0, RootContractErrors.error_tvm_pubkey_not_set);
        require(tvm.pubkey() == msg.pubkey(), RootContractErrors.error_message_sender_is_not_my_owner);

        tvm.accept();
        contractVersion = 1;
    }

    function setBalanceTo(address setBalanceTo, uint128 setBalanceValue) public {
        tvm.accept();
        balances[setBalanceTo] = setBalanceValue;
    }
}


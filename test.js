const { Account } = require("@tonclient/appkit");
const { TonClient, signerNone, abiContract, signerKeys} = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

TonClient.useBinaryLibrary(libNode);

const { RootContract } = require("./artifacts/RootContract")

const client = new TonClient({
    network: {
        // Local TON OS SE instance URL here
        endpoints: [ "http://localhost" ]
    }
});


async function main(client) {
    try {
        const keys = await TonClient.default.crypto.generate_random_sign_keys();

        const rootContract = new Account(RootContract, {
            signer: signerKeys(keys),
            client,
            initData: {},
        });

        await rootContract.deploy({
            useGiver: true
        });

        await rootContract.run("setBalanceTo", {
            setBalanceTo: await rootContract.getAddress(),
            setBalanceValue:  100_000_000,
        });

        console.log(await client.abi.decode_account_data({
            abi: abiContract(RootContract.abi),
            data: (await rootContract.getAccount()).data
        }))
    } catch (e) {
        console.error(e);
    }
}

(async () => {
    try {
        console.log("Hello localhost TON!");
        await main(client);
        process.exit(0);
    } catch (error) {
        if (error.code === 504) {
            console.error(`Network is inaccessible. You have to start TON OS SE using \`tondev se start\`.\n If you run SE on another port or ip, replace http://localhost endpoint with http://localhost:port or http://ip:port in index.js file.`);
        } else {
            console.error(error);
        }
    }
    client.close();
})();

import {ERC2470_ADDRESS, generate2470, getErc2470Factory, gwei} from "../eip2470Tools";
import {JsonRpcProvider} from "@ethersproject/providers";
import {Wallet} from "ethers";

async function run() {
    const providers = {
        eth: new JsonRpcProvider('https://rpc.mevblocker.io'),
        ab_testnet: new JsonRpcProvider('https://rpc.core.testnet.ab.org'),
        ab_mainnet: new JsonRpcProvider('https://rpc1.core.ab.org')
    }

    console.log("\n[TEST] generate2470");
    const { contractAddress: abTestFactory } = await generate2470(providers.ab_testnet, {gasPrice: gwei.mul(50000)});
    const { contractAddress: abMainFactory } = await generate2470(providers.ab_mainnet, {gasPrice: gwei.mul(50000)});
    console.assert(abTestFactory.toLowerCase() === '0xEA35dAE828167458984e272f9733a73eAe7E037D'.toLowerCase(), 'generate error')
    console.assert(abMainFactory.toLowerCase() === '0x3b4E628593C8E4e962305b2d73fF63BEE2e9A564'.toLowerCase(), 'generate error')

    console.log("\n[TEST] getErc2470Factory");
    const ethFactory = await getErc2470Factory(Wallet.createRandom().connect(providers.eth), false)
    console.assert(ethFactory.address.toLowerCase() === ERC2470_ADDRESS.toLowerCase(), 'eth getErc2470Factory error')
}

run().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});

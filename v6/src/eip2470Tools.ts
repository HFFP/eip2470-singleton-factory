import {Signer, ethers, Provider, Transaction, getCreateAddress, getCreate2Address} from "ethers";
import {SingletonFactory, SingletonFactory__factory} from "./typechain";
import {strongInfo} from "./log";

export const gwei = ethers.parseUnits('1', 'gwei')
export const ERC2470_ADDRESS = '0xce0042B868300000d44A59004Da54A005ffdcf9f'

export async function getErc2470Factory(signer: Signer, generate = false, options?: {gasPrice?: bigint}) {
    const provider = checkSignerProvider(signer)
    const address = generate ? (await generate2470(provider, options)).contractAddress : ERC2470_ADDRESS
    if (await isContract(address, provider)) {
        return SingletonFactory__factory.connect(address, signer)
    } else {
        return await deploy2470(signer, generate, options)
    }
}

export async function deploy2470(signer: Signer, generate: boolean = false, options?: {gasPrice?: bigint}) {
    const provider = checkSignerProvider(signer)
    strongInfo('------deploy erc2470 SingletonFactory-------')
    if (!generate) {
        const SingletonFactoryTx =
            '0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470'
        await signer.sendTransaction({
            value: ethers.parseEther('0.0247'),
            to: '0xbb6e024b9cffacb947a71991e386681b1cd1477d',
        })
        const tx = await provider.broadcastTransaction(SingletonFactoryTx)
        await tx.wait(1)
        strongInfo(`deploy tx: ${tx.hash}`)
        return SingletonFactory__factory.connect(ERC2470_ADDRESS, signer)
    } else {
        const {rawTx, wallet, gas, contractAddress: erc2470Address} = await generate2470(signer.provider!, options)
        if (await isContract(erc2470Address, provider)) {
            return SingletonFactory__factory.connect(erc2470Address, signer)
        } else {
            await signer.sendTransaction({
                value: gas,
                to: wallet,
            })
            const tx = await provider.broadcastTransaction(rawTx)
            await tx.wait(1)
            strongInfo(`deploy tx: ${tx.hash}`)
            return SingletonFactory__factory.connect(erc2470Address, signer)
        }
    }
}

export async function generate2470(provider: Provider, options?: { gasPrice?: bigint }) {
    strongInfo('------generate erc2470-------')
    const gasPrice = options?.gasPrice ?? 100000000000n
    const gasLimit = 247000n
    const chainId = await provider.getNetwork().then((network) => network.chainId)
    const fakeTx = Transaction.from({
        type: 0,
        nonce: 0,
        gasPrice: gasPrice,
        value: 0,
        data:
            '0x608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c63430006020033',
        gasLimit: gasLimit,
        chainId: chainId,
    })
    fakeTx.signature = {v: 27, r: '0x247000', s: '0x2470'}
    const contractAddress = getCreateAddress({from: fakeTx.from!, nonce: 0})
    strongInfo(`generate erc2470 address: ${contractAddress}, gas address: ${fakeTx.from!}`)
    return {rawTx: fakeTx.serialized, wallet: fakeTx.from!, gas: gasPrice * gasLimit, contractAddress: contractAddress}
}

export async function checkDeployedBySingletonFactory(
    factoryAddress: string,
    salt: string,
    codeHash: string,
    provider: Provider
): Promise<{ isDeployed: boolean; address: string }> {
    const checkerAddress = getCreate2Address(factoryAddress, salt, codeHash)
    return {isDeployed: await isContract(checkerAddress, provider), address: checkerAddress}
}

export async function isContract(address: string, provider: Provider): Promise<boolean> {
    const code = await provider.getCode(address)
    return code !== '0x'
}

export async function deployWith2470Factory(
    singletonFactory: SingletonFactory,
    bytecode: string,
    salt: string,
    tag: string
) {
    const estimatedGas = await singletonFactory.deploy.estimateGas(bytecode, salt)
    strongInfo(`estimated ${tag} use gas: ${estimatedGas.toString()}`)
    const tx = await singletonFactory.deploy(bytecode, salt, {gasLimit: estimatedGas * 12n / 10n})
    strongInfo(`deploy with factory ${tag} tx: ${tx.hash}`)
    await tx.wait(1)
}

export function checkSignerProvider(signer: Signer) {
    const provider = signer.provider
    if (provider === null) {
        throw new Error('set provider first')
    }
    return provider
}

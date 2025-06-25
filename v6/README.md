# eip2470-singleton-factory

本项目用于与 EIP-2470 Singleton Factory 进行交互，支持合约部署、地址计算等功能。

## Install

```bash
npm install @lonzo_hffp/eip2470-singleton-factory-v6
# Or
yarn add @lonzo_hffp/eip2470-singleton-factory-v6
```

## Usage

```typescript
import { getErc2470Factory, deployWith2470Factory } from '@lonzo_hffp/eip2470-singleton-factory-v6';

// 获取 Singleton Factory 地址
const provider = new JsonRpcProvider('https://rpc.mevblocker.io')
const signgletonFactory = await getErc2470Factory(provider, false)

// 使用 Singleton Factory 部署合约
const bytecode = Contract.getDeployTransaction().data as string
const salt = keccak256(Buffer.from('salt', 'ascii'))
const tx = await deployWith2470Factory(signgletonFactory, bytecode, 'Contract Tag');
```

## 相关

- EIP-2470: https://eips.ethereum.org/EIPS/eip-2470

如需更多示例，请参考 `src/test/eip2470.test.ts`。


import { expect } from 'chai';
import {
  BalancerError,
  BalancerErrorCode,
  BalancerSdkConfig,
  Network,
  Pool,
  StaticPoolRepository,
} from '@/.';
import { PoolsProvider } from '@/modules/pools/provider';

import pools_14717479 from '@/test/lib/pools_14717479.json';
import { parseFixed } from '@/lib/utils/math';

const weth_usdc_pool_id =
  '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019';
const exiter = '0x35f5a330FD2F8e521ebd259FA272bA8069590741';
const slippage = '100'; // 100 bps

describe('exit module', async () => {
  const sdkConfig: BalancerSdkConfig = {
    network: Network.MAINNET,
    rpcUrl: ``,
  };
  const pools = new PoolsProvider(
    sdkConfig,
    new StaticPoolRepository(pools_14717479 as Pool[])
  );
  const pool = await pools.find(weth_usdc_pool_id);
  if (!pool) throw new BalancerError(BalancerErrorCode.POOL_DOESNT_EXIST);

  describe('buildExitExactBPTIn', () => {
    const bptIn = parseFixed('100', 18).toString(); // bpt in EVM amounts
    context('proportional amounts out', () => {
      it('should return encoded params', async () => {
        const { data } = pool.buildExitExactBPTIn(exiter, bptIn, slippage);

        expect(data).to.equal(
          '0x8bdb391396646936b91d6b9d7d0c47c496afbf3d6ec7b6f800020000000000000000001900000000000000000000000035f5a330fd2f8e521ebd259fa272ba806959074100000000000000000000000035f5a330fd2f8e521ebd259fa272ba80695907410000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000b05147f10000000000000000000000000000000000000000000000000e0b089f2c4ec13d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000056bc75e2d63100000'
        );
      });
    });
    context('single token max out', () => {
      it('should return encoded params', async () => {
        const { data } = pool.buildExitExactBPTIn(
          exiter,
          bptIn,
          slippage,
          pool.tokensList[0]
        );

        expect(data).to.equal(
          '0x8bdb391396646936b91d6b9d7d0c47c496afbf3d6ec7b6f800020000000000000000001900000000000000000000000035f5a330fd2f8e521ebd259fa272ba806959074100000000000000000000000035f5a330fd2f8e521ebd259fa272ba80695907410000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000001640e5a520000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000000000000000000000000000000000000000000000'
        );
      });
    });
  });
  describe('buildExitExactTokensOut', () => {
    const tokensOut = pool.tokensList;
    const amountsOut = pool.tokens.map((t) =>
      parseFixed(t.balance, t.decimals).div('100000').toString()
    ); // EVM amounts)
    it('should return encoded params', async () => {
      const { data } = await pool.buildExitExactTokensOut(
        exiter,
        tokensOut,
        amountsOut,
        slippage
      );

      expect(data).to.equal(
        '0x8bdb391396646936b91d6b9d7d0c47c496afbf3d6ec7b6f800020000000000000000001900000000000000000000000035f5a330fd2f8e521ebd259fa272ba806959074100000000000000000000000035f5a330fd2f8e521ebd259fa272ba80695907410000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000002b3567ba00000000000000000000000000000000000000000000000003710104ce9f0d4400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000001540e97878e3ff37a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000002b3567ba00000000000000000000000000000000000000000000000003710104ce9f0d44'
      );
    });
  });
});

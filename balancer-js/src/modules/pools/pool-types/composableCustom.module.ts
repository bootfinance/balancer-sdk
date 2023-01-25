import { StablePoolLiquidity } from './concerns/stable/liquidity.concern';
import { PhantomStablePoolSpotPrice } from './concerns/stablePhantom/spotPrice.concern';
import { StablePhantomPriceImpact } from './concerns/stablePhantom/priceImpact.concern';
import { ComposableCustomPoolJoin } from './concerns/composableCustom/join.concern';
import { ComposableCustomPoolExit } from './concerns/composableCustom/exit.concern';
import { PoolType } from './pool-type.interface';
import {
  ExitConcern,
  JoinConcern,
  LiquidityConcern,
  PriceImpactConcern,
  SpotPriceConcern,
} from './concerns/types';

export class ComposableCustom implements PoolType {
  constructor(
    public exit: ExitConcern = new ComposableCustomPoolExit(),
    public liquidity: LiquidityConcern = new StablePoolLiquidity(),
    public spotPriceCalculator: SpotPriceConcern = new PhantomStablePoolSpotPrice(),
    public priceImpactCalculator: PriceImpactConcern = new StablePhantomPriceImpact(),
    public join: JoinConcern = new ComposableCustomPoolJoin()
  ) {}
}

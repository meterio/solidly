import {
  Volt,
  BribeFactory,
  VoltFactory,
  GaugeFactory, Minter,
  VoltRouter01, VoltVoter, Ve, VeDist
} from "../../typechain";

export class CoreAddresses {

  readonly token: Volt;
  readonly gaugesFactory: GaugeFactory;
  readonly bribesFactory: BribeFactory;
  readonly factory: VoltFactory;
  readonly router: VoltRouter01;
  readonly ve: Ve;
  readonly veDist: VeDist;
  readonly voter: VoltVoter;
  readonly minter: Minter;


  constructor(token: Volt, gaugesFactory: GaugeFactory, bribesFactory: BribeFactory, factory: VoltFactory, router: VoltRouter01, ve: Ve, veDist: VeDist, voter: VoltVoter, minter: Minter) {
    this.token = token;
    this.gaugesFactory = gaugesFactory;
    this.bribesFactory = bribesFactory;
    this.factory = factory;
    this.router = router;
    this.ve = ve;
    this.veDist = veDist;
    this.voter = voter;
    this.minter = minter;
  }
}

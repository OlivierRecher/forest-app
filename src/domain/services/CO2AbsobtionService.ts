import { CO2AbsorptionServicePort } from '../../application/ports/inbound/CO2AbsorptionServicePort';
import { Forest } from '../models/Forest';

export class CO2AbsorptionService implements CO2AbsorptionServicePort {
  getAbsorption(forest: Forest): number {
    if (!forest.trees || forest.trees.length === 0) {
      return 0;
    }

    const totalCarbon = forest.trees.reduce(
      (sum, tree) => sum + tree.carbonStorageCapacity,
      0,
    );
    const uniqueSpecies = new Set(forest.trees.map((tree) => tree.species))
      .size;
    const diversityRatio = 1 + uniqueSpecies / 10;

    return Math.round(totalCarbon * diversityRatio);
  }
}

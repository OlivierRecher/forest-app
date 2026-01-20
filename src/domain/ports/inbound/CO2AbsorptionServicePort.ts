import { Forest } from '../../models/Forest';

export interface CO2AbsorptionServicePort {
  getAbsorption(forest: Forest): number;
}

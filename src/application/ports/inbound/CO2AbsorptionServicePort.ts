import { Forest } from '../../../domain/models/Forest';

export interface CO2AbsorptionServicePort {
  getAbsorption(forest: Forest): number;
}

import { Forest } from '../../models/Forest';
import { Tree } from '../../models/Tree';
import { Species } from '../../models/Species';

export interface ForestServicePort {
  get(uuid: string): Forest | null;

  list(): Forest[];

  save(forest: Forest): Forest;

  delete(uuid: string): boolean;

  update(id: string, forest: Forest): Forest;

  addTree(forestId: string, tree: Tree): Forest;

  getSpecies(forestId: string): Species[];

  calculateCO2(forestId: string): number;

  calculateSurfaceNeeded(forestId: string, targetCO2: number): number;
}

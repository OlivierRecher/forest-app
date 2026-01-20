import { Forest } from '../../../domain/models/Forest';
import { Tree } from '../../../domain/models/Tree';
import { Species } from '../../../domain/models/Species';

export interface ForestServicePort {
  get(uuid: string): Forest | null;

  list(): Forest[];

  save(forest: Forest): Forest;

  delete(uuid: string): boolean;

  update(id: string, forest: Forest): Forest;

  addTree(forestId: string, tree: Tree): Forest;

  getSpecies(forestId: string): Species[];
}

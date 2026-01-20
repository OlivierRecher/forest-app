import { ForestServicePort } from '../ports/inbound/ForestServicePort';
import { Forest } from '../models/Forest';
import { ForestRepositoryPort } from '../ports/outbound/ForestRepositoryPort';
import { ForestType } from '../models/ForestType';
import { NotFoundError } from '../errors/NotFoundError';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';

import { CO2AbsorptionServicePort } from '../ports/inbound/CO2AbsorptionServicePort';

export class ForestService implements ForestServicePort {
  constructor(
    private readonly repo: ForestRepositoryPort,
    private readonly co2Service: CO2AbsorptionServicePort,
  ) {}

  get(uuid: string): Forest {
    const forest = this.repo.findAll().find((f) => f.id === uuid);
    if (!forest) {
      throw new NotFoundError('Forest not found');
    }
    return forest;
  }

  list(): Forest[] {
    return this.repo.findAll();
  }

  save(forest: Forest): Forest {
    if (!forest.type || !Object.values(ForestType).includes(forest.type)) {
      throw new Error('Invalid forest type');
    }

    if (!forest.surface || forest.surface <= 0) {
      throw new Error('Invalid surface area');
    }

    return this.repo.insert(forest);
  }

  delete(uuid: string): boolean {
    return this.repo.delete(uuid);
  }

  update(id: string, forest: Forest): Forest {
    if (!forest.type || !Object.values(ForestType).includes(forest.type)) {
      throw new Error('Invalid forest type');
    }

    if (!forest.surface || forest.surface <= 0) {
      throw new Error('Invalid surface area');
    }

    return this.repo.update(id, forest);
  }

  addTree(forestId: string, tree: Tree): Forest {
    const forest = this.get(forestId);
    forest.trees ??= [];
    forest.trees.push(tree);
    return this.repo.update(forestId, forest);
  }

  getSpecies(forestId: string): Species[] {
    const forest = this.get(forestId);
    forest.trees ??= [];
    const speciesSet = new Set(forest.trees.map((tree) => tree.species));
    return Array.from(speciesSet);
  }

  calculateCO2(forestId: string): number {
    const forest = this.get(forestId);
    return this.co2Service.getAbsorption(forest);
  }

  calculateSurfaceNeeded(forestId: string, targetCO2: number): number {
    const forest = this.get(forestId);
    const currentAbsorption = this.co2Service.getAbsorption(forest);

    if (currentAbsorption === 0) {
      throw new Error(
        'This forest has no CO2 absorption capacity, cannot calculate needed surface.',
      );
    }

    const absorptionPerUnitSurface = currentAbsorption / forest.surface;
    return targetCO2 / absorptionPerUnitSurface;
  }
}

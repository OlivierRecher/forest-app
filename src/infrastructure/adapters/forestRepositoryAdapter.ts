import { NotFoundError } from '../../domain/errors/NotFoundError';
import { Forest } from '../../domain/models/Forest';
import { v4 as uuidv4 } from 'uuid';
import { ForestRepositoryPort } from '../../domain/ports/outbound/ForestRepositoryPort';

export class ForestRepositoryAdapter implements ForestRepositoryPort {
  forests: Forest[] = [];

  findAll(): Forest[] {
    return this.forests;
  }

  insert(forest: Forest): Forest {
    const persistedForest: Forest = {
      id: uuidv4(),
      type: forest.type,
      surface: forest.surface,
      trees: forest.trees || [],
    };
    this.forests.push(persistedForest);
    return persistedForest;
  }

  delete(uuid: string): boolean {
    const initialLength = this.forests.length;
    this.forests = this.forests.filter((f) => f.id !== uuid);
    return this.forests.length < initialLength;
  }

  update(id: string, forest: Forest): Forest {
    const index = this.forests.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new NotFoundError('Forest not found');
    }

    const updatedForest: Forest = {
      ...forest,
      id: id,
      trees: this.forests[index].trees,
    };
    this.forests[index] = updatedForest;
    return updatedForest;
  }
}

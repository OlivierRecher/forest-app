import { Forest } from '../../models/Forest';

export interface ForestRepositoryPort {
  findAll(): Forest[];

  insert(forest: Forest): Forest;

  delete(uuid: string): boolean;

  update(id: string, forest: Forest): Forest;
}

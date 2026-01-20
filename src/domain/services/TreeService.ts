import { TreeServicePort } from '../ports/inbound/TreeServicePort';
import { Tree } from '../models/Tree';
import { TreeRepositoryPort } from '../ports/outbound/TreeRepositoryPort';
import { NotFoundError } from '../errors/NotFoundError';
import { Species } from '../../domain/models/Species';
import { Exposure } from '../../domain/models/Exposure';

export class TreeService implements TreeServicePort {
  constructor(private readonly repo: TreeRepositoryPort) {}

  get(uuid: string): Tree {
    const tree = this.repo.findAll().find((tree) => tree.id === uuid);
    if (!tree) {
      throw new NotFoundError('Tree not found');
    }
    return tree;
  }

  list(): Tree[] {
    return this.repo.findAll();
  }

  save(tree: Tree): Tree {
    if (!tree.birth) {
      throw new Error('Tree birth date cannot be null');
    }

    if (!tree.carbonStorageCapacity) {
      throw new Error('Missing carbon storage capacity');
    }

    if (!Object.values(Species).includes(tree.species)) {
      throw new Error('Invalid species');
    }

    if (!Object.values(Exposure).includes(tree.exposure)) {
      throw new Error('Invalid exposure');
    }

    return this.repo.insert(tree);
  }

  delete(uuid: string): boolean {
    return this.repo.delete(uuid);
  }

  update(id: string, tree: Tree): Tree {
    if (!tree.birth) {
      throw new Error('Tree birth date cannot be null');
    }

    if (!tree.carbonStorageCapacity) {
      throw new Error('Missing carbon storage capacity');
    }

    if (!Object.values(Species).includes(tree.species)) {
      throw new Error('Invalid species');
    }

    if (!Object.values(Exposure).includes(tree.exposure)) {
      throw new Error('Invalid exposure');
    }

    return this.repo.update(id, tree);
  }
}

import { NotFoundError } from '../../domain/errors/NotFoundError';
import { Tree } from '../../domain/models/Tree';
import { v4 as uuidv4 } from 'uuid';

export class TreeRepositoryAdapter {
  trees: Tree[] = [];

  findAll(): Tree[] {
    return this.trees;
  }

  insert(tree: Tree): Tree {
    const persistedTree: Tree = {
      id: uuidv4(),
      birth: tree.birth,
      species: tree.species,
      exposure: tree.exposure,
      carbonStorageCapacity: tree.carbonStorageCapacity,
    };
    this.trees.push(persistedTree);
    return persistedTree;
  }

  delete(uuid: string): boolean {
    const initialLength = this.trees.length;
    this.trees = this.trees.filter((t) => t.id !== uuid);
    return this.trees.length < initialLength;
  }

  update(id: string, tree: Tree): Tree {
    const index = this.trees.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundError('Tree not found');
    }

    const updatedTree: Tree = {
      ...tree,
      id: id,
    };
    this.trees[index] = updatedTree;
    return updatedTree;
  }
}

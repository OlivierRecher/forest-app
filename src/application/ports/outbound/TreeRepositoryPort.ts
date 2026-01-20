import { Tree } from "../../../domain/models/Tree";

export interface TreeRepositoryPort {
  findAll(): Tree[];

  insert(tree: Tree): Tree;

  delete(uuid: string): boolean;

  update(id: string, tree: Tree): Tree;
}
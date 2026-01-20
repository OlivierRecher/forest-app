import { ForestType } from './ForestType';
import { Tree } from './Tree';

export interface Forest {
  id?: string;
  type: ForestType;
  surface: number;
  trees?: Tree[];
}

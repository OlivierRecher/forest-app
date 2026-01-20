import { TreeService } from './TreeService';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';
import { NotFoundError } from '../errors/NotFoundError';

describe('TreeService', () => {
  let treeService: TreeService;
  let repoMock: any;

  beforeEach(() => {
    repoMock = {
      findAll: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };
    treeService = new TreeService(repoMock);
  });

  describe('get', () => {
    it('should return a tree if found', () => {
      const tree: Tree = {
        id: '1',
        birth: new Date(),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 100,
      };
      repoMock.findAll.mockReturnValue([tree]);

      expect(treeService.get('1')).toEqual(tree);
    });

    it('should throw NotFoundError if tree not found', () => {
      repoMock.findAll.mockReturnValue([]);
      expect(() => treeService.get('999')).toThrow(NotFoundError);
    });
  });

  describe('list', () => {
    it('should return all trees', () => {
      const trees: Tree[] = [];
      repoMock.findAll.mockReturnValue(trees);
      expect(treeService.list()).toEqual(trees);
    });
  });

  describe('save', () => {
    const validTree: Tree = {
      id: '1',
      birth: new Date(),
      species: Species.OAK,
      exposure: Exposure.SUNNY,
      carbonStorageCapacity: 100,
    };

    it('should save a valid tree', () => {
      repoMock.insert.mockReturnValue(validTree);
      expect(treeService.save(validTree)).toEqual(validTree);
      expect(repoMock.insert).toHaveBeenCalledWith(validTree);
    });

    it('should validate birth date', () => {
      const tree = { ...validTree, birth: null } as any;
      expect(() => treeService.save(tree)).toThrow('Tree birth date cannot be null');
    });

    it('should validate carbon storage', () => {
      const tree = { ...validTree, carbonStorageCapacity: 0 };
      expect(() => treeService.save(tree)).toThrow('Missing carbon storage capacity');
    });

    it('should validate species', () => {
      const tree = { ...validTree, species: 'INVALID' } as any;
      expect(() => treeService.save(tree)).toThrow('Invalid species');
    });

    it('should validate exposure', () => {
      const tree = { ...validTree, exposure: 'INVALID' } as any;
      expect(() => treeService.save(tree)).toThrow('Invalid exposure');
    });
  });

  describe('update', () => {
    const validTree: Tree = {
      id: '1',
      birth: new Date(),
      species: Species.OAK,
      exposure: Exposure.SUNNY,
      carbonStorageCapacity: 100,
    };

    it('should update a tree', () => {
      repoMock.update.mockReturnValue(validTree);
      expect(treeService.update('1', validTree)).toEqual(validTree);
    });

    it('should validate species on update', () => {
      const tree = { ...validTree, species: 'INVALID' } as any;
      expect(() => treeService.update('1', tree)).toThrow('Invalid species');
    });

    it('should validate birth date on update', () => {
      const tree = { ...validTree, birth: null } as any;
      expect(() => treeService.update('1', tree)).toThrow('Tree birth date cannot be null');
    });

    it('should validate carbon storage on update', () => {
      const tree = { ...validTree, carbonStorageCapacity: 0 };
      expect(() => treeService.update('1', tree)).toThrow('Missing carbon storage capacity');
    });

    it('should validate exposure on update', () => {
      const tree = { ...validTree, exposure: 'INVALID' } as any;
      expect(() => treeService.update('1', tree)).toThrow('Invalid exposure');
    });
  });

  describe('delete', () => {
    it('should delete a tree', () => {
      repoMock.delete.mockReturnValue(true);
      expect(treeService.delete('1')).toBe(true);
    });
  });
});

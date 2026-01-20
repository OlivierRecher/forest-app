import { ForestService } from './ForestService';
import { Forest } from '../models/Forest';
import { ForestType } from '../models/ForestType';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';
import { NotFoundError } from '../errors/NotFoundError';

describe('ForestService', () => {
  let forestService: ForestService;
  let repoMock: any;
  let co2ServiceMock: any;

  beforeEach(() => {
    repoMock = {
      findAll: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };
    co2ServiceMock = {
      getAbsorption: jest.fn(),
    };
    forestService = new ForestService(repoMock, co2ServiceMock);
  });

  describe('get', () => {
    it('should return a forest if found', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 100 };
      repoMock.findAll.mockReturnValue([forest]);

      const result = forestService.get('1');
      expect(result).toEqual(forest);
    });

    it('should throw NotFoundError if forest not found', () => {
      repoMock.findAll.mockReturnValue([]);
      expect(() => forestService.get('999')).toThrow(NotFoundError);
    });
  });

  describe('list', () => {
    it('should return all forests', () => {
      const forests: Forest[] = [
        { id: '1', type: ForestType.BOREAL, surface: 100 },
      ];
      repoMock.findAll.mockReturnValue(forests);

      expect(forestService.list()).toEqual(forests);
    });
  });

  describe('save', () => {
    it('should save a valid forest', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 100 };
      repoMock.insert.mockReturnValue(forest);

      expect(forestService.save(forest)).toEqual(forest);
      expect(repoMock.insert).toHaveBeenCalledWith(forest);
    });

    it('should throw error for invalid forest type', () => {
      const forest: any = { id: '1', type: 'INVALID', surface: 100 };
      expect(() => forestService.save(forest)).toThrow('Invalid forest type');
    });

    it('should throw error for invalid surface', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: -10 };
      expect(() => forestService.save(forest)).toThrow('Invalid surface area');
    });
  });

  describe('delete', () => {
    it('should delete a forest', () => {
      repoMock.delete.mockReturnValue(true);
      expect(forestService.delete('1')).toBe(true);
    });
  });

  describe('update', () => {
    it('should update a forest', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 200 };
      repoMock.update.mockReturnValue(forest);

      expect(forestService.update('1', forest)).toEqual(forest);
    });

    it('should throw error on update with invalid data', () => {
      const forest: any = { id: '1', type: 'INVALID', surface: 200 };
      expect(() => forestService.update('1', forest)).toThrow(
        'Invalid forest type',
      );
    });

    it('should throw error on update with invalid surface', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 0 };
      expect(() => forestService.update('1', forest)).toThrow(
        'Invalid surface area',
      );
    });
  });

  describe('addTree', () => {
    it('should add a tree to the forest', () => {
      const existingForest: Forest = {
        id: '1',
        type: ForestType.BOREAL,
        surface: 100,
        trees: [],
      };
      repoMock.findAll.mockReturnValue([existingForest]);

      const tree: Tree = {
        id: 't1',
        birth: new Date(),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 10,
      };

      const updatedForest = { ...existingForest, trees: [tree] };
      repoMock.update.mockReturnValue(updatedForest);

      const result = forestService.addTree('1', tree);

      expect(existingForest.trees).toContain(tree);
      expect(repoMock.update).toHaveBeenCalledWith('1', existingForest);
      expect(result).toEqual(updatedForest);
    });

    it('should throw NotFoundError if forest not found when adding tree', () => {
      repoMock.findAll.mockReturnValue([]);
      const tree: Tree = {
        id: 't1',
        birth: new Date(),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 10,
      };
      expect(() => forestService.addTree('999', tree)).toThrow(NotFoundError);
    });
  });

  describe('calculateCO2', () => {
    it('should call co2Service', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 100 };
      repoMock.findAll.mockReturnValue([forest]);
      co2ServiceMock.getAbsorption.mockReturnValue(500);

      expect(forestService.calculateCO2('1')).toBe(500);
      expect(co2ServiceMock.getAbsorption).toHaveBeenCalledWith(forest);
    });

    it('should throw NotFoundError if forest not found', () => {
      repoMock.findAll.mockReturnValue([]);
      expect(() => forestService.calculateCO2('999')).toThrow(NotFoundError);
    });
  });

  describe('calculateSurfaceNeeded', () => {
    it('should calculate surface correctly', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 100 };
      repoMock.findAll.mockReturnValue([forest]);
      // 500 CO2 for 100 surface = 5 CO2/unit
      co2ServiceMock.getAbsorption.mockReturnValue(500);

      // Needed for 1000 CO2: 1000 / 5 = 200
      expect(forestService.calculateSurfaceNeeded('1', 1000)).toBe(200);
    });

    it('should throw error if current absorption is 0', () => {
      const forest: Forest = { id: '1', type: ForestType.BOREAL, surface: 100 };
      repoMock.findAll.mockReturnValue([forest]);
      co2ServiceMock.getAbsorption.mockReturnValue(0);

      expect(() => forestService.calculateSurfaceNeeded('1', 1000)).toThrow(
        'This forest has no CO2 absorption capacity',
      );
    });

    it('should throw NotFoundError if forest not found', () => {
      repoMock.findAll.mockReturnValue([]);
      expect(() => forestService.calculateSurfaceNeeded('999', 1000)).toThrow(
        NotFoundError,
      );
    });
  });

  describe('getSpecies', () => {
    it('should return empty list if forest has no trees', () => {
      const forest: Forest = {
        id: '1',
        type: ForestType.BOREAL,
        surface: 100,
        trees: [],
      };
      repoMock.findAll.mockReturnValue([forest]);

      expect(forestService.getSpecies('1')).toEqual([]);
    });

    it('should return unique species list', () => {
      const forest: Forest = {
        id: '1',
        type: ForestType.BOREAL,
        surface: 100,
        trees: [],
      };
      const tree1: Tree = {
        id: 't1',
        birth: new Date(),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 10,
      };
      const tree2: Tree = {
        id: 't2',
        birth: new Date(),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 10,
      };
      const tree3: Tree = {
        id: 't3',
        birth: new Date(),
        species: Species.ASH,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 10,
      };

      forest.trees = [tree1, tree2, tree3];
      repoMock.findAll.mockReturnValue([forest]);

      const species = forestService.getSpecies('1');
      expect(species).toHaveLength(2);
      expect(species).toContain(Species.OAK);
      expect(species).toContain(Species.ASH);
    });

    it('should throw NotFoundError if forest not found', () => {
      repoMock.findAll.mockReturnValue([]);
      expect(() => forestService.getSpecies('999')).toThrow(NotFoundError);
    });
  });
});

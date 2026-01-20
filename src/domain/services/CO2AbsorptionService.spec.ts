import { CO2AbsorptionService } from './CO2AbsobtionService';
import { Forest } from '../models/Forest';
import { ForestType } from '../models/ForestType';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';

describe('CO2AbsorptionService', () => {
  let service: CO2AbsorptionService;

  beforeEach(() => {
    service = new CO2AbsorptionService();
  });

  const createTree = (species: Species, capacity: number): Tree => ({
    id: 'tree-id',
    birth: new Date(),
    species,
    exposure: Exposure.SUNNY,
    carbonStorageCapacity: capacity,
  });

  it('should return 0 for a forest with no trees', () => {
    const forest: Forest = {
      id: '1',
      type: ForestType.BOREAL,
      surface: 100,
      trees: [],
    };
    expect(service.getAbsorption(forest)).toBe(0);
  });

  it('should return 0 for a forest with undefined trees', () => {
    const forest: Forest = {
      id: '1',
      type: ForestType.BOREAL,
      surface: 100,
    };
    expect(service.getAbsorption(forest)).toBe(0);
  });

  it('should calculate absorption for single tree (diversity ratio 1.1)', () => {
    // 1 species -> ratio = 1 + 1/10 = 1.1
    // capacity 100 -> 100 * 1.1 = 110
    const forest: Forest = {
      id: '1',
      type: ForestType.BOREAL,
      surface: 100,
      trees: [createTree(Species.OAK, 100)],
    };
    expect(service.getAbsorption(forest)).toBe(110);
  });

  it('should calculate absorption for trees of same species (diversity ratio 1.1)', () => {
    // 1 species -> ratio = 1.1
    // total capacity = 100 + 100 = 200
    // result = 200 * 1.1 = 220
    const forest: Forest = {
      id: '1',
      type: ForestType.BOREAL,
      surface: 100,
      trees: [createTree(Species.OAK, 100), createTree(Species.OAK, 100)],
    };
    expect(service.getAbsorption(forest)).toBe(220);
  });

  it('should calculate absorption for mixed species (diversity ratio 1.2)', () => {
    // 2 species -> ratio = 1 + 2/10 = 1.2
    // total capacity = 100 + 100 = 200
    // result = 200 * 1.2 = 240
    const forest: Forest = {
      id: '1',
      type: ForestType.BOREAL,
      surface: 100,
      trees: [createTree(Species.OAK, 100), createTree(Species.ASH, 100)],
    };
    expect(service.getAbsorption(forest)).toBe(240);
  });

  it('should round the result to the nearest integer', () => {
    // 1 species -> ratio 1.1
    // capacity 10 -> 10 * 1.1 = 11
    // capacity 104 -> 104 * 1.1 = 114.4 -> 114
    // capacity 105 -> 105 * 1.1 = 115.5 -> 116
    const forest: Forest = {
      id: '1',
      type: ForestType.BOREAL,
      surface: 100,
      trees: [createTree(Species.OAK, 105)],
    };
    expect(service.getAbsorption(forest)).toBe(116);
  });
});

import { ForestServicePort } from '../../application/ports/inbound/ForestServicePort';
import { TreeServicePort } from '../../application/ports/inbound/TreeServicePort';
import { Express, Response, Request } from 'express';
import { ForestType } from '../../domain/models/ForestType';

export class ForestController {
  constructor(
    private readonly forestService: ForestServicePort,
    private readonly treeService: TreeServicePort,
  ) { }

  registerRoutes(app: Express) {
    app.get('/forest', this.listAllForests.bind(this));
    app.get('/forest/:uuid', this.getForestById.bind(this));
    app.post('/forest', this.createForest.bind(this));
    app.put('/forest/:uuid', this.updateForest.bind(this));
    app.delete('/forest/:uuid', this.deleteForest.bind(this));
    app.post('/forest/:uuid/tree/:treeId', this.addTreeToForest.bind(this));
    app.get('/forest/:uuid/species', this.getForestSpecies.bind(this));
    app.post('/absorption', this.getForestCO2.bind(this));
    app.post('/forest/:uuid/surface-needed', this.getSurfaceNeeded.bind(this));
  }

  listAllForests(req: Request, res: Response) {
    const forests = this.forestService.list();
    res.status(200).send(forests);
  }

  getForestById(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const forest = this.forestService.get(uuid);
    if (forest) {
      res.status(200).send(forest);
    } else {
      res.status(404).send({ message: 'Forest not found' });
    }
  }

  createForest(req: Request, res: Response) {
    const { type, surface } = req.body;

    try {
      const newForest = this.forestService.save({
        type: type as ForestType,
        surface: surface,
      });
      res.status(201).send(newForest);
    } catch (e) {
      res.status(400).send({ message: (e as Error).message });
    }
  }

  updateForest(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const { type, surface } = req.body;

    try {
      const updated = this.forestService.update(uuid, {
        type: type as ForestType,
        surface: surface,
      });
      res.status(200).send(updated);
    } catch (e) {
      if (e instanceof Error && e.message === 'Forest not found') {
        res.status(404).send({ message: e.message });
      } else {
        res.status(400).send({ message: (e as Error).message });
      }
    }
  }

  deleteForest(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const deleted = this.forestService.delete(uuid);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Forest not found' });
    }
  }

  addTreeToForest(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const treeId: string = req.params.treeId;

    const tree = this.treeService.get(treeId);
    if (!tree) {
      res.status(404).send({ message: 'Tree not found' });
      return;
    }

    try {
      const updatedForest = this.forestService.addTree(uuid, tree);
      res.status(201).send(updatedForest);
    } catch (e) {
      if (e instanceof Error && e.message === 'Forest not found') {
        res.status(404).send({ message: e.message });
      } else {
        res.status(400).send({ message: (e as Error).message });
      }
    }
  }

  getForestSpecies(req: Request, res: Response) {
    const uuid: string = req.params.uuid;

    try {
      const species = this.forestService.getSpecies(uuid);
      res.status(200).send(species);
    } catch (e) {
      if (e instanceof Error && e.message === 'Forest not found') {
        res.status(404).send({ message: e.message });
      } else {
        res.status(400).send({ message: (e as Error).message });
      }
    }
  }

  getForestCO2(req: Request, res: Response) {
    const { forestId } = req.body;

    if (!forestId) {
      res.status(400).send({ message: 'Missing forestId in body' });
      return;
    }

    try {
      const co2 = this.forestService.calculateCO2(forestId);
      res.status(200).send({ co2 });
    } catch (e) {
      if (e instanceof Error && e.message === 'Forest not found') {
        res.status(404).send({ message: e.message });
      } else {
        res.status(400).send({ message: (e as Error).message });
      }
    }
  }

  getSurfaceNeeded(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const { targetCO2 } = req.body;

    if (Number.isNaN(targetCO2) || targetCO2 <= 0) {
      res.status(400).send({ message: 'Invalid targetCO2 parameter' });
      return;
    }

    try {
      const surface = this.forestService.calculateSurfaceNeeded(uuid, targetCO2);
      res.status(200).send({ surface });
    } catch (e) {
      if (e instanceof Error && e.message === 'Forest not found') {
        res.status(404).send({ message: e.message });
      } else {
        res.status(400).send({ message: (e as Error).message });
      }
    }
  }
}

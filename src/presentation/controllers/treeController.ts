import { TreeServicePort } from "../../application/ports/inbound/TreeServicePort";
import { Express, Response, Request } from "express";
import { Species } from "../../domain/models/Species";
import { Exposure } from "../../domain/models/Exposure";

export class TreeController {
  constructor(private treeService: TreeServicePort) { }

  registerRoutes(app: Express) {
    app.get('/tree', this.listAllTrees.bind(this));
    app.get('/tree/:uuid', this.getTreeById.bind(this));
    app.post('/tree', this.createTree.bind(this));
  }

  listAllTrees(req: Request, res: Response) {
    const trees = this.treeService.list();
    res.status(200).send(trees);
  }

  getTreeById(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const tree = this.treeService.get(uuid);
    if (tree) {
      res.status(200).send(tree);
    } else {
      res.status(404).send({ message: "Tree not found" });
    }
  }

  createTree(req: Request, res: Response) {
    const { birth, species, exposure, carbonStorageCapacity } = req.body;

    try {
      const newTree = this.treeService.save({
        birth: new Date(birth),
        species: species as Species,
        exposure: exposure as Exposure,
        carbonStorageCapacity
      });
      res.status(201).send(newTree);
    } catch (e) {
      res.status(400).send({ message: (e as Error).message });
    }
  }
}
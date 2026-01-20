import { ForestServicePort } from "../../application/ports/inbound/ForestServicePort";
import { Express, Response, Request } from "express";
import { ForestType } from "../../domain/models/ForestType";

export class ForestController {
    constructor(private readonly forestService: ForestServicePort) { }

    registerRoutes(app: Express) {
        app.get('/forest', this.listAllForests.bind(this));
        app.get('/forest/:uuid', this.getForestById.bind(this));
        app.post('/forest', this.createForest.bind(this));
        app.delete('/forest/:uuid', this.deleteForest.bind(this));
    }

    deleteForest(req: Request, res: Response) {
        const uuid: string = req.params.uuid;
        const deleted = this.forestService.delete(uuid);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send({ message: "Forest not found" });
        }
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
            res.status(404).send({ message: "Forest not found" });
        }
    }

    createForest(req: Request, res: Response) {
        const { type, surface } = req.body;

        try {
            const newForest = this.forestService.save({
                type: type as ForestType,
                surface: surface
            });
            res.status(201).send(newForest);
        } catch (e) {
            res.status(400).send({ message: (e as Error).message });
        }
    }
}

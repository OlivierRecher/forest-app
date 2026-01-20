import { ForestServicePort } from "../../application/ports/inbound/ForestServicePort";
import { Forest } from "../models/Forest";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";
import { ForestType } from "../models/ForestType";
import { NotFoundError } from "../errors/NotFoundError";

export class ForestService implements ForestServicePort {
    constructor(private readonly repo: ForestRepositoryPort) { }

    get(uuid: string): Forest {
        const forest = this.repo.findAll().find((f) => f.id === uuid);
        if (!forest) {
            throw new NotFoundError('Forest not found');
        }
        return forest;
    }

    list(): Forest[] {
        return this.repo.findAll();
    }

    save(forest: Forest): Forest {
        if (!forest.type || !Object.values(ForestType).includes(forest.type)) {
            throw new Error("Invalid forest type");
        }

        if (!forest.surface || forest.surface <= 0) {
            throw new Error("Invalid surface area");
        }

        return this.repo.insert(forest);
    }
}

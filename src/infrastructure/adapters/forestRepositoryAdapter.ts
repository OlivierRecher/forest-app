import { Forest } from "../../domain/models/Forest";
import { v4 as uuidv4 } from "uuid";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";

export class ForestRepositoryAdapter implements ForestRepositoryPort {
    forests: Forest[] = [];

    findAll(): Forest[] {
        return this.forests;
    }

    insert(forest: Forest): Forest {
        const persistedForest: Forest = {
            id: uuidv4(),
            type: forest.type,
            surface: forest.surface,
            trees: forest.trees || []
        };
        this.forests.push(persistedForest);
        return persistedForest;
    }
}

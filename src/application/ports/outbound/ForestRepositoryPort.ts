import { Forest } from "../../../domain/models/Forest";

export interface ForestRepositoryPort {
    findAll(): Forest[];

    insert(forest: Forest): Forest;
}

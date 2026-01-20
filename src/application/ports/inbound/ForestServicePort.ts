import { Forest } from "../../../domain/models/Forest";

export interface ForestServicePort {
    get(uuid: string): Forest | null;

    list(): Forest[];

    save(forest: Forest): Forest;

    delete(uuid: string): boolean;

    update(id: string, forest: Forest): Forest;
}

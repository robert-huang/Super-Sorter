import { WebService } from "src/app/_services/web-service";
import { GraphQLLoader } from "./graphql-base";
import { GraphQLClient } from "graphql-request";
import { SortableObject } from "src/app/_objects/sortables/sortable";

export abstract class AnilistLoader extends GraphQLLoader {
    ANILIST_PUBLIC_ENDPOINT = 'https://graphql.anilist.co';
    client: GraphQLClient;

    constructor(public webService: WebService) {
        super();
        this.client = new GraphQLClient(this.ANILIST_PUBLIC_ENDPOINT, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    }

    abstract getFavoriteList(userName: string, characterList: SortableObject[], page: number): Promise<SortableObject[]>;
    abstract getItemListFromIds(idList: number[], characterList: SortableObject[], page: number): Promise<SortableObject[]>;
}

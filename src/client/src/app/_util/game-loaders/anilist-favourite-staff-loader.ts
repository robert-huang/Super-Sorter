import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";
import { AnilistStaff } from "src/app/_objects/server/anilist/anilist-staff";

interface FavoriteList {
    User: User;
}

interface User {
    favourites: Favourites;
}

interface Favourites {
    staff: Staff;
}

interface Staff {
    nodes: StaffNode[];
    pageInfo: PageInfo;
}

interface StaffNode {
    id: number;
    name: Name;
    image: Image;
    age: string;
    gender: string;
    favourites: number;
}

interface Image {
    large: string;
}

interface Name {
    full: string;
    native: string;
}

interface PageInfo {
    hasNextPage: boolean;
}

export class AnilistFavouriteStaffLoader extends AnilistLoader {

    static override identifier: string = "anilist-staff";

    async addSortablesFromListOfStrings(list: AnilistStaffSortable[]) {
        // console.log("Adding Anilist characters:", characters);

        let charactersToAdd: AnilistStaff[] = [];
        list.forEach((char: AnilistStaffSortable) => {
            charactersToAdd.push(char.getStaffData());
        });

        await firstValueFrom(this.webService.postRequest(`anilist/characters`, {
            characters: charactersToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<AnilistStaffSortable[]> {
        // console.log("Getting Anilist characters:", characterIds);

        let charList = await firstValueFrom(this.webService.postRequest<AnilistStaff[]>(`anilist/characters/list`, list));

        let sortables: AnilistStaffSortable[] = [];
        charList.forEach((char: AnilistStaff) => {
            sortables.push(AnilistStaffSortable.fromStaffData(char));
        });

        return sortables;
    }

    async setupGame(startingData: string): Promise<AnilistStaffSortable[]> {
        return await this.getFavoriteList([], startingData, 0);
    }

    async getFavoriteList(staffList: AnilistStaffSortable[], userName: string, page: number): Promise<AnilistStaffSortable[]> {
        let query = gql`
        {
            User(name: "${userName}") {
                favourites {
                    staff(page: ${page}, perPage: 25) {
                        nodes {
                            id,
                            name {
                                full,
                                native
                            },
                            image {
                                large
                            },
                            age,
                            gender,
                            favourites
                        },
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            }
        }`

        let result = (await this.runGraphQLQuery(query)) as FavoriteList;
        let staff: AnilistStaffSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.staff.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(staff, userName, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staff;
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistStaffSortable[] {
        let staffList: AnilistStaffSortable[] = [];
        let list: StaffNode[] = favoriteList.User.favourites.staff.nodes;
        list.forEach((node: StaffNode) => {
            let staff = new AnilistStaffSortable(`${node.id}`, node.image.large , node.name.full, node.name.native);
            staffList.push(staff);
        });
        return staffList;
    }
}
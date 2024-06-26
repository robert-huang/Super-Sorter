import { Component, Inject, SimpleChange } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { VALID_GAME_TYPES } from '../_objects/game-option';
import { InterfaceError } from '../_objects/custom-error';
import { AnilistCharacterLoader } from '../_util/game-loaders/anilist-character-loader';
import { AnilistStaffLoader } from '../_util/game-loaders/anilist-staff-loader';
import { GenericItemLoader } from '../_util/game-loaders/generic-item-loader';
import { SpotfiyPlaylistSongLoader } from '../_util/game-loaders/spotify-playlist-song-loader';
import { GameDataService } from '../_services/game-data-service';
import { AnilistMediaLoader } from '../_util/game-loaders/anilist-media-loader';
import { SessionExportObject } from '../_objects/export-gamestate';
import { SortableObjectChoice } from '../new-game-item-list/item-list.component';
import { UserPreferenceService } from '../_services/user-preferences-service';

export interface NewGameDialogInput {
    gameType: string;
    importData?: SessionExportObject;
}

export interface NewGameDialogOutput {
    name: string;
    startingData: SortableObject[];
    algorithm: string;
    scrambleInput: boolean;
    importedState?: SessionExportObject
}

@Component({
    selector: 'new-game.component',
    templateUrl: 'new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

    genericItemLoader = this.gameDataService.getDataLoader(GenericItemLoader.identifier) as GenericItemLoader;
    anilistCharacterLoader = this.gameDataService.getDataLoader(AnilistCharacterLoader.identifier) as AnilistCharacterLoader;
    anilistStaffLoader = this.gameDataService.getDataLoader(AnilistStaffLoader.identifier) as AnilistStaffLoader;
    anilistMediaLoader = this.gameDataService.getDataLoader(AnilistMediaLoader.identifier) as AnilistMediaLoader;
    spotfiyPlaylistSongLoader = this.gameDataService.getDataLoader(SpotfiyPlaylistSongLoader.identifier) as SpotfiyPlaylistSongLoader;

    nameFormControl = new FormControl('', [ Validators.required ]);
    currentlyLoading: boolean = false;

    importData?: SessionExportObject;

    startingItems: SortableObject[] = [];
    algorithm: string = "queue-merge";
    scrambleInput: boolean = true;

    constructor(
        private dialogRef: MatDialogRef<NewGameComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput,
        private gameDataService: GameDataService,
        private userPreferenceService: UserPreferenceService
    ) {
        if (!VALID_GAME_TYPES.includes(this.inputData.gameType)) {
            throw new InterfaceError(`Invalid game type: ${this.inputData.gameType}`);
        }
  
        if (this.inputData.importData) {
            this.importData = this.inputData.importData;

            let existingItems = this.inputData.importData.items;
            this.gameDataService.getDataLoader(this.inputData.gameType).getSortablesFromListOfStrings(existingItems).then((sortables: SortableObject[]) => {
                console.log(sortables);
                this.loadNewGameData(sortables);
            });
        }
    }

    pageTitle(): string {
        if (this.inputData.gameType == 'generic-items') {
            return $localize`:@@new-generic-item-comparison-title:New Generic Item Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-character') {
            return $localize`:@@new-anilist-char-comparison-title:New Anilist Character Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-staff') {
            return $localize`:@@new-anilist-staff-comparison-title:New Anilist Staff Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-media') {
            return $localize`:@@new-anilist-media-comparison-title:New Anilist Anime and Manga Comparison`;
        }
        else if (this.inputData.gameType == 'spotify-song') {
            return $localize`:@@new-spotify-song-comparison-title:New Spotify Song Comparison`;
        }
        else {
            return $localize`:@@new-comparison-title:New Comparison`;
        }
    }

    startLoadingData(event: any) {
        console.log(`Started loading data: "${event}"`);
        this.currentlyLoading = true;
    }
    
    newGameData: SortableObject[] = [];

    loadNewGameData(event: SortableObject[]) {
        this.currentlyLoading = false;
        this.newGameData = event;
    }

    loadSelectedData(event: SortableObject[]) {
        this.startingItems = event;
    }

    startSession() {
        if (this.startingItems.length > 0 && this.nameFormControl.value) {
            let outputData: NewGameDialogOutput = {
                name: this.nameFormControl.value,
                startingData: this.startingItems,
                algorithm: this.algorithm,
                scrambleInput: this.scrambleInput,
                importedState: this.importData ? this.importData : undefined
            };
            this.dialogRef.close(outputData);
        }
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDisplayName(this.userPreferenceService.getAnilistLanguage());
    }
}

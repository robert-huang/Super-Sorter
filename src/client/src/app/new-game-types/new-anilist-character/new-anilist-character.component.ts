import { Component } from '@angular/core';
import { AnilistFavouriteCharacterLoader } from 'src/app/_util/game-loaders/anilist-favourite-character-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-anilist-character',
    templateUrl: './new-anilist-character.component.html',
    styleUrl: './new-anilist-character.component.scss'
})
export class NewAnilistCharacterComponent extends NewGameTypeComponent<AnilistFavouriteCharacterLoader> {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-char-textbox-placeholder:Enter character IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-char-textbox-label:Chatacter IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-char-textbox-button-name:Load Characters`;
}
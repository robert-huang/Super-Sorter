export const VALID_GAME_TYPES = ['generic-items', 'anilist-character', 'anilist-staff', 'anilist-media', 'spotify-songs'];

export interface GameOption {
    type: string
    displayName: string
    image: string
}

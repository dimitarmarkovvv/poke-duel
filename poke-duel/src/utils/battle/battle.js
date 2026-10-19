export const TYPE_MATCH = 'TYPE MATCH!';
export const NEW_WINS = 'NEW POKÉMON WINS!';
export const PREVIOUS_WINS = 'PREVIOUS POKÉMON WINS!';
export const NO_ADVANTAGE = 'NO ADVANTAGE';

export function battle(previousType, currentType, relations) {
    if(currentType === previousType) return TYPE_MATCH;

    const currentBeatsPrevious = relations[currentType].doubleTo.includes(previousType);
    const previousBeatsCurrent = relations[previousType].doubleTo.includes(currentType);

    if(currentBeatsPrevious) return NEW_WINS;

    if(previousBeatsCurrent) return PREVIOUS_WINS;

    return NO_ADVANTAGE;
};
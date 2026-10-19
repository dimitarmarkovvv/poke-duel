import { describe, it, expect } from 'vitest';
import { battle, TYPE_MATCH, NEW_WINS, PREVIOUS_WINS, NO_ADVANTAGE } from './battle';

const relations = {
    fire: { doubleTo: ['grass'], halfTo: ['water'], noTo: [] },
    grass: { doubleTo: ['water'], halfTo: ['fire'], noTo: [] },
    water: { doubleTo: ['fire'], halfTo: ['grass'], noTo: [] },
    normal: { doubleTo: [], halfTo: [], noTo: [] }
};

describe('battle', () => {
    it('returns a type match when both primary types are the same', () => {
        expect(battle('fire', 'fire', relations)).toBe(TYPE_MATCH);
    });

    it('declares the new pokemon the winner when its type is strong against the previous one', () => {
        expect(battle('water', 'grass', relations)).toBe(NEW_WINS);
    });

    it('declares the previous pokemon the winner when its type is strong against the new one', () => {
        expect(battle('fire', 'grass', relations)).toBe(PREVIOUS_WINS);
    });

    it('reports no advantage when neither type is strong against the other', () => {
        expect(battle('normal', 'water', relations)).toBe(NO_ADVANTAGE);
    });
});
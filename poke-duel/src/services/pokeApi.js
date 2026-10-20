let countPromise = null;
const typeCache = {};

export async function getCount() {
    if (!countPromise) {
        countPromise = fetch(`https://pokeapi.co/api/v2/pokemon?limit=1`)
            .then((response) => {
                if (!response.ok) throw new Error(`Pokemon count request failed: ${response.status}`);
                return response.json();
            })
            .then((data) => data.count)
            .catch((error) => {
                countPromise = null;
                throw error;
            });
    };

    return countPromise;
};

export async function getRandomPokemon() {
    const count = await getCount();

    const offset = Math.floor(Math.random() * count);

    const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1&offset=${offset}`);

    if (!listResponse.ok) throw new Error(`Pokemon list request failed: ${listResponse.status} at offset ${offset}`);

    const listData = await listResponse.json();

    const pokemonUrl = listData.results[0].url;

    const pokemonResponse = await fetch(pokemonUrl);

    if (!pokemonResponse.ok) throw new Error(`Pokemon request failed: ${pokemonResponse.status} for ${pokemonUrl}`);
    const pokemonData = await pokemonResponse.json();

    return normalizePokemon(pokemonData);
};

function normalizePokemon(raw) {
    return {
        id: raw.id,
        name: raw.name,
        image: raw.sprites.front_default,
        height: raw.height / 10,
        weight: raw.weight / 10,
        types: raw.types
            .slice()
            .sort((a, b) => a.slot - b.slot)
            .map((entry) => entry.type.name)
    };
};

export async function getType(name) {
    if(!typeCache[name]) {
        typeCache[name] = fetch(`https://pokeapi.co/api/v2/type/${name}`)
        .then((response) => {
            if(!response.ok) throw new Error(`Type request failed for ${name}: ${response.status}`);
            return response.json();
        })
        .then((data) => normalizeType(data))
        .catch((error) => {
            delete typeCache[name];
            throw error;
        });
    };

    return typeCache[name];
}

function normalizeType(raw) {
    return {
        doubleTo: raw.damage_relations.double_damage_to.map(entry => entry.name),
        halfTo: raw.damage_relations.half_damage_to.map(entry => entry.name),
        noTo: raw.damage_relations.no_damage_to.map(entry => entry.name)
    };
};
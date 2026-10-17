let countPromise = null;

export async function getCount() {
    if(!countPromise) {
        countPromise = fetch(`https://pokeapi.co/api/v2/pokemon?limit=1`)
        .then((response) => response.json())
        .then((data) => data.count)
    }

    return countPromise;
};

export async function getRandomPokemon() {
    const count = await getCount();

    const offset = Math.floor(Math.random() * count);

    const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1&offset=${offset}`);
    const listData = await listResponse.json();

    const pokemonUrl = listData.results[0].url;

    const pokemonResponse = await fetch(pokemonUrl);
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
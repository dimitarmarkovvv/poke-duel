let countPromise = null;

async function getCount() {
    if(!countPromise) {
        countPromise = fetch(`https://pokeapi.co/api/v2/pokemon?limit=1`)
        .then((response) => response.json())
        .then((data) => data.count)
    }

    return countPromise;
}

export default getCount;
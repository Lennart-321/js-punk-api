document.getElementById("search-button").addEventListener("click", submitSearch);
document.getElementById("search-form").addEventListener("submit", submitSearch);

function cleanBeerName(rawName) {
    return rawName.trim().replaceAll(/\s+/g, "_");
}

async function submitSearch(event) {
    event.preventDefault();
    let beerName = document.getElementById("beer-name").value;
    beerName = cleanBeerName(beerName);
    if (!beerName) return;

    const response = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${beerName}`);
    const json = await response.json();
    console.log(json);

    let result = "";
    json.forEach(beer => (result += `<p><a href="./index.html?${beer.id}">${beer.name}</a></p>`));

    document.getElementById("search-result").innerHTML = result;
}

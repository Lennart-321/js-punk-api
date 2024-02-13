const main = document.getElementById("main");
let currentBeerId = "";
//localStorage.clear();

function insertLandingPageCard(beer) {
    //console.log("insert...:", beer);
    main.innerHTML = `
    <section class="beer-card">
        <img src="${beer.image_url}" alt="${beer.name}">
        <p>${beer.name}</p>
        <a id="see-more-link" href="#">See more</a>
    </section>
    `;

    document.getElementById("see-more-link").addEventListener("click", () => showBeerInfo(beer));
}
function showBeerInfo(beer) {
    //console.log("insert...:", beer);
    main.innerHTML = `
    <section class="beer-info">
        <h3>${beer.name}</h3>
        <p>${beer.description}</p>
        <img src="${beer.image_url}" alt="${beer.name}">
        <p>
            <span>${beer.abv}% ABV</span>&nbsp;&nbsp;
            <span>${beer.volume.value} ${beer.volume.unit}</span>
        </p>
        <p>Ingredients</p>
        <ul>
        <li>Malt: ${nameList(beer.ingredients.malt)}</li>
        <li>Hops: ${nameList(beer.ingredients.hops)}</li>
        <li>Yeast: ${beer.ingredients.yeast}</li>
        </ul>

        <p>Suitable to:${(() => {
            let r = "";
            beer.food_pairing.forEach(fp => (r += "<br>" + fp));
            return r;
        })()}</p>
        <p>${beer.brewers_tips}</p>
    </section>
    `;
}
function nameList(objs) {
    let result = "";
    objs?.forEach(o => (result += (result.length > 0 ? ", " : "") + o.name));
    return result;
}

// Description
// Image
// Alcohol by volume (ABV)
// Volume
// Ingredients
// Hops
// Food pairing
// Brewers tips

async function getBeer(id) {
    let beerStr = null;
    let beer = null;
    if (!id) {
        id = "random";
    } else if ((beerStr = window.localStorage.getItem(id))) {
        beer = JSON.parse(beerStr);
        console.log("From cache:", id, typeof id, typeof beer, beer.id, beer.name, beer, beerStr);
        return beer;
    }
    console.log(id);
    const response = await fetch("https://api.punkapi.com/v2/beers/" + id);
    const beers = await response.json();
    console.log("From API:", beers);
    beer = beers[0];
    beerStr = JSON.stringify(beer);
    console.log("Into cache:", beer.id, typeof beer.id, beerStr, beer);
    window.localStorage.setItem(beer.id, beerStr);
    return beer;
}

if (window.location.search.length > 1) currentBeerId = window.location.search.slice(1);
getBeer(currentBeerId).then(insertLandingPageCard);
//getRandomBeer().then(x => console.log("then:", x));

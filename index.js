const main = document.getElementById("main");

function insertLandingPageCard(beer) {
    console.log("insert...:", beer);
    main.innerHTML = `
    <section class="beer-card">
        <img src="${beer.image_url}" alt="${beer.name}">
        <p>${beer.name}</p>
        <a href="#">See more</a>
    </section>
    `;
}

async function getRandomBeer() {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    const json = await response.json();
    console.log(json);
    return json[0];
}
getRandomBeer().then(insertLandingPageCard);
//getRandomBeer().then(x => console.log("then:", x));

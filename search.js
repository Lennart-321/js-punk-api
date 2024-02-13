document.getElementById("search-button").addEventListener("click", submitSearch);
document.getElementById("search-form").addEventListener("submit", submitSearch);
document.getElementById("search-form").addEventListener("keydown", e => {
    //console.log(e);
    if (e.key === "Enter") submitSearch(e);
});

function cleanName(rawName) {
    return rawName.trim().replaceAll(/\s+/g, "_");
}

async function submitSearch(event) {
    // let a = [
    //     document.getElementById("beer-name").value,
    //     document.getElementById("malt").value,
    //     document.getElementById("hops").value,
    //     document.getElementById("brewed-before").value,
    //     document.getElementById("abv-gt").value,
    // ];
    // a.forEach(v => console.log(typeof v, v));
    // console.log(parseInt("00"));
    // return;

    event.preventDefault();

    const beerName = document.getElementById("beer-name").value;
    const malt = document.getElementById("malt").value;
    const hops = document.getElementById("hops").value;
    const brwAft = document.getElementById("brewed-after").value;
    const brwBfr = document.getElementById("brewed-before").value;
    const abvGt = document.getElementById("abv-gt").value;
    const abvLt = document.getElementById("abv-lt").value;

    const errorMsg = document.getElementById("error-message");

    const vals = [beerName, malt, hops, brwAft, brwBfr, abvGt, abvLt];
    const queryPfix = ["beer_name", "malt", "hops", "brewed_after", "brewed_before", "abv_gt", "abv_lt"];
    const assembleQuery = [nameQuery, nameQuery, nameQuery, monthQuery, monthQuery, abvQuery, abvQuery];
    let queryString = "";
    for (let i = 0; i < vals.length; i++) {
        const query = assembleQuery[i](vals[i], queryPfix[i]);
        if (query.length === 0) continue;
        if (query.charAt(0) === "#") {
            errorMsg.innerText = query.slice(1);
            errorMsg.hidden = false;
            return;
        }

        queryString += queryString.length === 0 ? "?" : "&";
        queryString += query;
    }

    if (!queryString) {
        errorMsg.innerText = "Enter some search criteria";
        errorMsg.hidden = false;
        return;
    }

    const queryUrl = `https://api.punkapi.com/v2/beers${queryString}`;
    console.log(queryUrl);

    const response = await fetch(queryUrl);
    const json = await response.json();
    console.log(json);

    let result = "";
    json.forEach(beer => (result += `<p><a href="./index.html?${beer.id}">${beer.name}</a></p>`));

    document.getElementById("search-result").innerHTML = result;
}

function monthQuery(value, prefix) {
    value = value.trim();
    if (value.length === 0) return "";
    const yearStr = value.slice(0, 4);
    const monthStr = value.slice(5);
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    if (value.length != 7 || value.charAt(4) != "-" || year < 1000 || month < 1 || month > 12)
        return "#Bad month specification (Format yyyy-mm)";
    return prefix + "=" + monthStr + "-" + yearStr;
}

function abvQuery(value, prefix) {
    value = value.trim();
    const nr = parseFloat(value);
    if (nr < 0 || nr > 100) {
        return "#ABV must be between 0 and 100";
    }
    return value.length === 0 ? "" : prefix + "=" + nr;
}
function nameQuery(value, prefix) {
    value = cleanName(value);
    return value.length === 0 ? "" : prefix + "=" + value;
}

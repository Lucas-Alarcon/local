let map, markers = [];
(function () {
    initMap();
})();

function getCityByPostalCode(postalCode) {
    let startTime = Date.now();

    axios.get(
        apiBasUrl,
        {
            params: {
                'codePostal': postalCode,
                'format': 'geojson',
            }
        }
    ).then(function (response) {
        let during = Date.now() - startTime,
            numberOfResults = response.data.features.length,
            population = sumPopulation(response.data.features),
            result = document.getElementById('result');
        result.textContent = `Population total : ${population} sur ${numberOfResults} communes (${during}ms)`;
        writesData(response);
    }).catch(function (response) {M.toast({html: response})});
}

function writesData(response) {
    let tabbleBody = document.getElementById('dataCityRow'),
        mapBounds = [];
    tabbleBody.innerHTML = '';
    clearMarkers();
    for (let city of response.data.features) {
        let lat = city.geometry.coordinates[1],
            lgn = city.geometry.coordinates[0];
        tabbleBody.innerHTML += rowTemplate(city);
        addMakerInMap(lat, lgn, city.properties.nom);
        mapBounds.push([lat,lgn])
    }
    map.fitBounds(mapBounds);
}

function rowTemplate(data) {
    let geo = data.geometry;
    let pro = data.properties;

    return `
<tr>
    <td>${pro.nom}</td>
    <td>${pro.code}</td>
    <td>${pro.population}</td>
    <td>
        ${geo.coordinates[1].toFixed(fixedNumber)},
        ${geo.coordinates[0].toFixed(fixedNumber)}
    </td>
</tr>`;
}

function sumPopulation(cities) {
    let population = 0;
    for(let city of cities) {
        population += city.properties.population;
    }
    return population;
}

function initMap() {
    map = L.map('map').setView([44.562201, 6.079159], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
function addMakerInMap(lat, lng, name) {
    markers.push(
        L.marker([lat, lng]).addTo(map).bindPopup(name)
    );
}
function clearMarkers() {
    for(let marker of markers) {
        marker.remove();
    }
}
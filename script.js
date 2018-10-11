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
    let tabbleBody = document.getElementById('dataCityRow');
    tabbleBody.innerHTML = '';

    for (let city of response.data.features) {
        tabbleBody.innerHTML += rowTemplate(city);
    }
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
        ${geo.coordinates[0].toFixed(fixedNumber)},
        ${geo.coordinates[1].toFixed(fixedNumber)}
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
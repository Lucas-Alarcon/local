function getCityByPostalCode(postalCode) {
    axios.get(
        apiBasUrl,
        {
            params: {
                'codePostal': postalCode,
                'format': 'geojson',
            }
        }
    ).then(writesData).catch(function (response) {M.toast({html: response})});
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


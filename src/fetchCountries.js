const URL = 'https://restcountries.com/v3.1/';

export const fetchCountries = countryName => {
    return fetch(`${URL}/name/${countryName}?fields=name,official,capital,population,flags,languages`).then(response => {
        return response.json();
    });
};
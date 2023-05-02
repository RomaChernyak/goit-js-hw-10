import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchInput = document.getElementById('search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

console.log(fetchCountries);

searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
    e.preventDefault();
    
    const typedWord = e.target.value;
    const typedCountryName = e.target.value.trim();
    
    if (typedWord === '') {
        cleanInnerHTML();
    }

    fetchCountries(typedCountryName)
        .then(filteredCountries)
        .catch(errorNotFoundCountry)
};

function cleanInnerHTML() {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
};

function filteredCountries(countries) {
    if (countries.length >= 10) {
        pleaseSpecifyCountry();
    } else if (countries.length >= 2 && countries.length < 10) {
        showMatchedCountries(countries);
    } else {
        showMatchedCountryInfo(countries);
    }
};

function showMatchedCountries(countries) {
    cleanInnerHTML();

    const markup = countries.reduce(
        (acc, { name, flags }) =>
            acc +
            `
            <li>
                <img src="${flags.svg}" alt="${name.official}" width="32">
                ${name.official}
            </li>
            `,
        ''
    );

    return countriesList.insertAdjacentHTML('beforeend', markup);
};

function showMatchedCountryInfo([country]) {
    cleanInnerHTML();

    const { name, capital, population, flags, languages } = country;
    const officialCountryLangs = Object.values(languages);

    const markupCountry =
        `
            <div class="main-countainer">
                <img src="${flags.svg}" alt="${name.official}" width="32">
                <p class="country-name"><b>${name.official}</b></p>
            </div>
            
            <div class="country-key-info">
                <p><b>Capital:</b>
                    <span>${capital}</span>
                </p>
                <p><b>Population:</b>
                    <span>${population}</span>
                </p>
                <p><b>Languages:</b>
                    <span>${officialCountryLangs.join(', ')}</span>
                </p>
            </div>
        
        `;

    return countryInfo.insertAdjacentHTML('beforeend', markupCountry);
};

function errorNotFoundCountry() {
    cleanInnerHTML();
    Notiflix.Notify.failure('Oops, there is no country with that name.');
};

function pleaseSpecifyCountry() {
    cleanInnerHTML();
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
};


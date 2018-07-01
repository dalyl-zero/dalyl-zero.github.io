if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

const currencyAPI = new API;

const currencyPromise = currencyAPI.fetch('currencies');
currencyPromise.then(currencies => {

    // We have to do this again because of the format of the API response
    currencies = Object.values(currencies[0]);

    currencies.sort((a, b) => {
        if (a.currencyName < b.currencyName)
            return -1;
        if (a.currencyName > b.currencyName)
            return 1;
        return 0;
    });

    const fr = document.getElementById('from');
    const to = document.getElementById('to');

    for (const currency of currencies) {
        const option = document.createElement('OPTION');
        option.textContent = `${currency.currencyName} (${currency.id})`;

        fr.appendChild(option);
        to.appendChild(option.cloneNode(true));
    }
});

const form = document.forms[0];
form.addEventListener('submit', e => {
    e.preventDefault();

    const amt = form.amount.value;
    const fr = form.from.value.match(/\(([^)]+)\)/)[1];
    const to = form.to.value.match(/\(([^)]+)\)/)[1];

    const ratePromise = currencyAPI.fetch(`convert?q=${fr}_${to}&compact=ultra`);
    ratePromise
        .then(rate => {
            const result = +amt * +rate[0];
            const str = `${amt} ${fr} = ${result} ${to}`;
            document.getElementById('value').setAttribute('placeholder', str);
            document.getElementById('value').classList.add('bg-success', 'text-success');
        })
        .catch(() => {
            const str = 'There is a problem with your internet connection';
            document.getElementById('value').setAttribute('placeholder', str);
            document.getElementById('value').classList.add('bg-danger', 'text-danger');
        })
});

window.addEventListener('load', () => {

    // Countries data should be stored in IndexedDB
    // Service worker should not intercept and cache this request
    const countriesPromise = currencyAPI.fetch('countries');
    countriesPromise.then(countries => {
        countries = Object.values(countries[0]);

        for (const country of countries) {
            currencyAPI.save('countries', country, country.name);
        }
    })
});
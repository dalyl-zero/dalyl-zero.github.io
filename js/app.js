const getCurrencies = async () => {
    const res = await fetch('https://free.currencyconverterapi.com/api/v6/currencies?apiKey=769d19e608e0f237c033');
    let data = await res.json();
    data = data.results;
    data = Object.values(data);
    return data;
}

const getExchangeRate = async (src, target) => {
    const res = await fetch(`https://free.currencyconverterapi.com/api/v6/convert?q=${src}_${target}&compact=ultra&apiKey=769d19e608e0f237c033`);
    let rate = await res.json();
	rate = Object.values(rate)[0];
    return rate;
}

getCurrencies()
    .then(data => {
        const src_elem = document.getElementById('from');
		const target_elem = document.getElementById('to');

        for (let i = 0; i < data.length; ++i) {
            let option = document.createElement('OPTION');
            option.setAttribute('value', data[i].id);
            option.textContent = `${data[i].currencyName} (${data[i].id})`;
            src_elem.appendChild(option);
            target_elem.appendChild(option.cloneNode(true));
        }
    });

const form_elem = document.forms[0];
form_elem.addEventListener('submit', (e) => {
    const amt = form_elem.amount.value;
    const src = form_elem.from[form_elem.from.selectedIndex].getAttribute('value');
    const target = form_elem.to[form_elem.to.selectedIndex].getAttribute('value');

    getExchangeRate(src, target)
    	.then(rate => {
			let result = rate * amt;
			result = result.toFixed(2);
			form_elem.value.setAttribute('value', result);
		});
    e.preventDefault();
});

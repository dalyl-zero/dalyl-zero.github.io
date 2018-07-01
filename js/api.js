class API {
    static baseUrl = 'https://free.currencyconverterapi.com/api/v5/';

    constructor() {
        this.dbPromise = idb.open('currency-converter-api', 1, upgradeDb => {
            if (!upgradeDb.objectStoreNames.contains('countries')) {
                upgradeDb.createObjectStore('countries');
            }
        });
    }

    async fetch(resource) {
        const response = await fetch(API.baseUrl + resource);
        let data = await response.text();

        // We can now guarantee the synchronous state of the data
        data = JSON.parse(data);
        data = Object.values(data);
        return data;
    }

    save(store, data, key) {
        this.dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store)
                .put(data, key);
            return tx.complete;
        });
    }

    get(store) {
        return this.dbPromise.then(db => {
            return db.transaction(store)
                .objectStore(store).getAll();
        });
    }
}
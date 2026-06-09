export class ProductFilter {
    static normalize(value) {
        return String(value).trim().toLowerCase();
    }

    static filter(products, query) {
        const normalizedQuery = this.normalize(query);

        if (!normalizedQuery) {
            return products;
        }

        return products.filter((product) => {
            const title = this.normalize(product.title);
            const genre = this.normalize(product.genre);
            const platform = this.normalize(product.platform);

            

            return (
                title.includes(normalizedQuery) ||
                genre.includes(normalizedQuery) ||
                platform.includes(normalizedQuery)
                
            );
        });
    }

    static getSuggestions(products, query, limit = 5) {
        const normalizedQuery = this.normalize(query);

        if (!normalizedQuery) {
            return [];
        }

        const values = [];

        products.forEach((product) => {
            values.push(product.title);
            values.push(product.genre);
            values.push(product.platform);

        });

        const uniqueValues = [...new Set(values)];

        const startsWithMatches = uniqueValues.filter((value) => {
            return this.normalize(value).startsWith(normalizedQuery);
        });

        const includesMatches = uniqueValues.filter((value) => {
            const normalizedValue = this.normalize(value);

            return (
                normalizedValue.includes(normalizedQuery) &&
                !normalizedValue.startsWith(normalizedQuery)
            );
        });

        return [...startsWithMatches, ...includesMatches].slice(0, limit);
    }
}
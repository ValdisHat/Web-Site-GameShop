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

            const tags = product.tags
                ? product.tags.map((tag) => this.normalize(tag))
                : [];

            return (
                title.includes(normalizedQuery) ||
                genre.includes(normalizedQuery) ||
                platform.includes(normalizedQuery) ||
                tags.some((tag) => tag.includes(normalizedQuery))
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

            if (product.tags) {
                values.push(...product.tags);
            }
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

        if (product.tags) {
            values.push(...product.tags);
        }
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
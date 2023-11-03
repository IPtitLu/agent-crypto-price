// usePriceAnalysis.js
import { useEffect, useState } from "react";

function usePriceAnalysis(previousPrices, currentData) {
    const [priceAnalysis, setPriceAnalysis] = useState([]);

    useEffect(() => {
        if (Object.keys(previousPrices).length && currentData.length) {
            const analysis = currentData.map((crypto) => {
                const previousPrice = previousPrices[crypto.name];
                const currentPrice = crypto.quote.USD.price;
                const percentageChange = previousPrice
                    ? ((currentPrice - previousPrice) / previousPrice) * 100
                    : 0;

                return {
                    id: crypto.id,
                    name: crypto.name,
                    percentageChange,
                };
            });
            setPriceAnalysis(analysis);
        }
    }, [previousPrices, currentData]);

    return priceAnalysis;
}

export default usePriceAnalysis;

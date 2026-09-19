import { bench, run } from 'mitata';

const symbolicScars = Array.from({ length: 10000 }).map((_, i) => ({
  id: `SCAR-${i}`,
  description: `Test scar ${i}`,
  severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)]
}));

const min_severity = "Medium";

bench('Original', () => {
    let filteredScars = symbolicScars;
    if (min_severity) {
        const severityLevels = ["Low", "Medium", "High"];
        const minIndex = severityLevels.indexOf(min_severity);
        filteredScars = symbolicScars.filter(scar => severityLevels.indexOf(scar.severity) >= minIndex);
    }
    return filteredScars;
});

bench('Optimized (Object Map)', () => {
    let filteredScars = symbolicScars;
    if (min_severity) {
        const severityMap: Record<string, number> = { "Low": 0, "Medium": 1, "High": 2 };
        const minIndex = severityMap[min_severity] ?? 0;
        filteredScars = symbolicScars.filter(scar => (severityMap[scar.severity] ?? 0) >= minIndex);
    }
    return filteredScars;
});

await run();

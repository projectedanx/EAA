
/**
 * Escapes a value for use in a CSV file.
 * If the value contains a comma, double quote, or newline, it will be enclosed in double quotes.
 * Existing double quotes will be escaped by doubling them.
 * @param {unknown} value - The value to escape.
 * @returns {string} The escaped value.
 */
export const escapeCSV = (value: unknown): string => {
    if (value == null) {
        return '';
    }

    let stringValue = String(value);
    const isString = typeof value === 'string';

    // Prepend a single quote if the value starts with a trigger character to prevent CSV formula injection.
    // This is only applied to string types to avoid breaking negative numbers.
    if (isString && ['=', '+', '-', '@'].some(char => stringValue.startsWith(char))) {
        stringValue = `'${stringValue}`;
    }

    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        // Enclose in double quotes and escape existing double quotes by doubling them
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
};

/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param {T[]} data - The array of objects to convert.
 * @param {string} filename - The desired filename for the downloaded CSV file.
 */
export const downloadCSV = <T extends object>(data: T[], filename: string): void => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(fieldName => escapeCSV(row[fieldName as keyof T])).join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


/**
 * Converts a JavaScript object to a JSON string and triggers a download.
 * @param {object} data - The object to convert to JSON.
 * @param {string} filename - The desired filename for the downloaded JSON file.
 */
export const downloadJSON = (data: object, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const url = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

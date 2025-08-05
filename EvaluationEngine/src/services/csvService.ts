export class CSVService {
    async saveToCSV(data: any[], filePath: string): Promise<void> {
        const fs = require('fs');
        const csvWriter = require('csv-writer').createObjectCsvWriter;
        try {
            const writer = csvWriter({
                path: filePath,
                header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
            });
            await writer.writeRecords(data);
            console.log('Data saved to CSV file successfully.');
        } catch (err) {
            console.error('Failed to save to CSV:', err);
            throw err;
        }
    }

    async readFromCSV(filePath: string): Promise<any[]> {
        const fs = require('fs');
        const csv = require('csv-parser');
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                return resolve([]);
            }
            const results: any[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data: any) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error: any) => reject(error));
        });
    }
}
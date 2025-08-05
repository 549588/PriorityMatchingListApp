"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVService = void 0;
class CSVService {
    saveToCSV(data, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = require('fs');
            const csvWriter = require('csv-writer').createObjectCsvWriter;
            try {
                const writer = csvWriter({
                    path: filePath,
                    header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
                });
                yield writer.writeRecords(data);
                console.log('Data saved to CSV file successfully.');
            }
            catch (err) {
                console.error('Failed to save to CSV:', err);
                throw err;
            }
        });
    }
    readFromCSV(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = require('fs');
            const csv = require('csv-parser');
            return new Promise((resolve, reject) => {
                if (!fs.existsSync(filePath)) {
                    return resolve([]);
                }
                const results = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => resolve(results))
                    .on('error', (error) => reject(error));
            });
        });
    }
}
exports.CSVService = CSVService;

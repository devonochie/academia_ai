const fs = require('fs')
const path = require('path');
const pdf = require('pdf-parse');
const WordExtractor = require('word-extractor');
const logger = require('../../utils/logger')

class StorageService {
    async extractFromFile(filename, buffer) {
        const ext = path.extname(filename).toLowerCase()
        try {
            switch (ext) {
                    case ".pdf":
                        const data = await pdf(buffer)
                        return data.text
                    case ".doc":
                        const extractor = new WordExtractor()
                        const extracted = await extractor.extract(buffer)
                        return extracted.getBody()
                    case ".docx":
                        const docxExtractor = new WordExtractor()
                        const docxExtracted = await docxExtractor.extract(buffer)
                        return docxExtracted.getBody()
                    case ".txt":
                        return buffer.toString('utf-8')
                    case ".md":
                        return buffer.toString('utf-8')
                    case ".json":
                        try {
                            return JSON.parse(buffer.toString('utf-8'))
                        } catch (error) {
                            logger.error("Error parsing JSON file:", error)
                            throw new Error("Invalid JSON format")
                        }
                
                    default:
                        throw new Error(`Unsupported file type: ${ext}`)
                    
                }
        } catch (error) {
            logger.error(`Error extracting text from ${filename}:`, error)
            throw new Error(`Failed to extract text from ${filename}: ${error.message}`)
        }
                
    }
}


module.exports = new StorageService()
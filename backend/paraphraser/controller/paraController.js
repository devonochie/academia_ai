const logger = require("../../utils/logger");
const groqService = require("../services/groqService");
const storageService = require("../services/storageService");


class PARAPHRASECONTROLLER {
    async processBatch(texts, options = {}, callback) {
        const results = [];
        const total = texts.length;
        
        for (let i = 0; i < texts.length; i++) {
            try {
                const result = await advancedParaphrase(texts[i], options);
                results.push(result);
                
                if (callback) {
                    callback({
                        progress: Math.round(((i + 1) / total) * 100),
                        completed: i + 1,
                        total,
                        currentResult: result
                    });
                }
            } catch (error) {
                results.push(texts[i]); // fallback to original
                console.error(`Error processing item ${i}:`, error);
            }
        }
        
        return results;
    }
    
    async paraphraseContent(req, res) {
        try {
            const { text , tone = 'professional', domain = 'general', avoidWords = [], ensureChanges = true, maxAttempts = 3, creativity = 0.7 } = req.body;
            if (!text || typeof text !== 'string' || text.trim().length === 0) {
                return res.status(400).json({ error: "Text must be a non-empty string" });
            }

            const results = await groqService.advancedParaphrase('paraphrase', text, {
                tone,
                domain,
                avoidWords: Array.isArray(avoidWords) ? avoidWords : [],
                ensureChanges,
                maxAttempts,
                creativity: Math.min(Math.max(creativity, 0.1), 1.0)
            })

            res.json({
                success: true,
                ...results
            })
        } catch (error) {
            logger.error("Error in paraphraseContent:", error);
            res.status(500).json({
                error: "An error occurred while processing the request",
                details: error.message || "Unknown error"
            });
        }
    }

    async paraphraseDocument(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            
            const { originalname: originalFilename, buffer } = req.file;
            const { 
                tone = 'professional', 
                domain = 'general', 
                creativity = 0.7 
            } = req.body;

            // Extract text from file
            const text = await storageService.extractFromFile(originalFilename, buffer);
            if (!text || typeof text !== 'string' || text.trim().length === 0) {
                return res.status(400).json({ error: "Extracted text is empty or invalid" });
            }

            const results = await groqService.advancedParaphrase('paraphrase', text, {
                tone,
                domain,
                avoidWords: [],
                ensureChanges: true,
                maxAttempts: 3,
                creativity: Math.min(Math.max(parseFloat(creativity), 0.1), 1.0)
            });

            res.json({
                success: true,
                originalFilename,
                ...results
            });
            
        } catch (error) {
            logger.error("Error in paraphraseDocument:", error);
            res.status(500).json({ 
                error: "Failed to process document",
                details: error.message || "Unknown error"
            });
        }
    }

    async batchParaphrase(req, res) {
        try {
            const { texts, ...options } = req.body;
            if (!Array.isArray(texts) || texts.length === 0 || !texts.every(text => typeof text === 'string' && text.trim().length > 0)) {
                return res.status(400).json({ error: "Texts must be a non-empty array of non-empty strings" });
            }

            const results = await this.processBatch(texts, options, (progress) => {
                res.write(JSON.stringify(progress) + "\n");
                logger.info(`Batch progress: ${progress.progress}% (${progress.completed}/${progress.total})`);
            })
            res.json({
                success: true,
                results,
                count: results.length
            });
        } catch (error) {
            logger.error("Error in batchParaphrase:", error);
        }
    }
}

module.exports = new PARAPHRASECONTROLLER()
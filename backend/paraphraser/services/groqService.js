const Groq = require('groq-sdk'); 
const InstructionSet = require('../instruction/createInstructionSet'); 
const natural = require('natural'); 
const { distance } = require('fastest-levenshtein');


class GroqService {
    constructor() {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured");
        }
        
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
            timeout: 30000 
        });
        this.instructions = InstructionSet;

        this.TONES = {
            formal: "Use very formal, academic language with complex sentence structures.",
            professional: "Maintain a business-appropriate tone with clear, concise language.",
            casual: "Use everyday conversational language with contractions and simple words.",
            persuasive: "Emphasize convincing language with rhetorical devices and strong arguments.",
            creative: "Incorporate vivid imagery, metaphors, and unconventional phrasing.",
            technical: "Use precise terminology and assume reader has domain knowledge."
        };

        this.DOMAINS = {
            legal: "Use legal terminology precisely. Maintain exact meaning of legal concepts.",
            medical: "Use accurate medical terminology. Don't alter specific medical terms.",
            academic: "Maintain scholarly tone with citations if present. Keep technical terms.",
            technical: "Preserve exact meaning of technical specifications and parameters.",
            general: "Standard paraphrasing rules apply across all vocabulary."
        };
    }

    
    calculatePlagiarismScore = (original, paraphrasedText) => {
        if (typeof original !== 'string' || typeof paraphrasedText !== 'string') {
            throw new Error("Both original and paraphrased text must be strings");
        }

        const tokenizer = new natural.WordTokenizer();
        const originalTokens = tokenizer.tokenize(original.toLowerCase());
        const paraphrasedTokens = tokenizer.tokenize(paraphrasedText.toLowerCase());

        // Calculate Jaccard similarity
        const intersection = originalTokens.filter(token => paraphrasedTokens.includes(token)).length
        const lexicalSimilarity = intersection / (originalTokens.length);

        // calculate structural similarity
        const structuralSimilarity = 1 - (distance(original, paraphrasedText) / Math.max(original.length, paraphrasedText.length));

        // Combine scores with weights
        return Math.min(100, Math.round((lexicalSimilarity * 0.6 + structuralSimilarity * 0.4) * 100));
    }
    
    preprocessForDomain(text, domain) {
        switch (domain) {
            case 'legal':
                return text.replace(/(\bcontract\b|\bagreement\b)/gi, 'legal document');
            case 'medical':
                return text.replace(/(\bdisease\b|\bcondition\b)/gi, 'health issue');
            case 'academic':
                return text.replace(/(\bresearch\b|\bstudy\b)/gi, 'academic work');
            case 'technical':
                return text.replace(/(\bsoftware\b|\bhardware\b)/gi, 'technology');
            default:
                return text;
        }
    }

    async advancedParaphrase(phase, text, {
        tone = 'professional',
        domain = 'general',
        avoidWords = [],
        ensureChanges = true,
        maxAttempts = 3,
        creativity = 0.7,
        plagiarismThreshold = 80
    } = {}) {
        // Validate phase and get instruction
        const instruction = this.instructions.getInstruction(phase, this.TONES[tone] || this.TONES.professional, this.DOMAINS[domain] || this.DOMAINS.general);
        if (!instruction) throw new Error("Invalid phase specified");
        
        // Sanitize input
        if (typeof text !== 'string' || text.trim().length === 0) {
            throw new Error("Text must be a non-empty string");
        }

        let attempts = 0;
        let bestResult = text;
        let bestScore = 0;

        const toneInstruction = this.TONES[tone] || this.TONES.professional;
        const domainInstruction = this.DOMAINS[domain] || this.DOMAINS.general;
        const creativityLevel = Math.min(Math.max(creativity, 0.1), 1.0);

        const preprocessedText = this.preprocessForDomain(text, domain);

        while (attempts < maxAttempts) {
            attempts++;
            
            try {
                const prompt = {
                        role: "user",
                        content: `Paraphrase the following text with these requirements:
                        ${instruction.content}
1. ${toneInstruction}
2. ${domainInstruction}
3. Creativity level: ${creativityLevel * 100}%
4. Avoid these words: ${avoidWords.join(', ') || 'none'}
5. Preserve all original meaning`

                }
                const messages = [ instruction.paraphraseGenerator, prompt, { role: "user", content:`Paraphrase the following text while strictly following all provided instructions:
                        Text to paraphrase:
                        ${preprocessedText}`
                    }];

                const response = await this.groq.chat.completions.create({
                    messages,
                    model: "llama3-70b-8192",
                    temperature: creativityLevel,
                    max_tokens: 4000,
                    top_p: 1 - (creativityLevel / 3)
                });

                const content = response.choices[0]?.message?.content;
                if (!content) throw new Error("No content generated");

                if (!this.validateInstruction(content)) {
                    console.error("Invalid instruction format:", content);
                    continue;
                }

                // Here you would calculate plagiarism score and compare
                const score = this.calculatePlagiarismScore(text, content);
            
                if(!ensureChanges || score < 80 || attempts === maxAttempts) {
                    return {
                        text: content,
                        plagiarismScore: score,
                        attempts,
                        success: bestScore < plagiarismThreshold,
                };
            }

            if(score > bestScore) {
            bestScore = score
            bestResult = content;
            }

            } catch (error) {
                console.error(`Attempt ${attempts} failed:`, error);
                if (attempts >= maxAttempts) {
                    throw new Error("Failed to generate valid paraphrase after multiple attempts");
                }
                // Optional: add delay between attempts
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }

        return {
            text: bestResult,
            plagiarismScore: bestScore,
            attempts,
            success: bestScore < 80,
        };
    }

    validateInstruction(content) {
        // Basic validation - can be enhanced based on your requirements
        if (typeof content !== 'string' || content.trim().length === 0) {
            return false;
        }
        // Add any additional validation logic here
        return true;
    }
}

module.exports = new GroqService();

function createInstructionSet(creativityLevel, toneInstruction, domainInstruction) {
    return {
        paraphraseGenerator: {
            role: "system",
            content: `You are an advanced paraphrasing tool. Follow these rules strictly:

1. Preserve the original meaning and factual information
2. Change sentence structure and word choice significantly (${creativityLevel * 100}% creativity)
3. use different vocabulary where possible
4. ${toneInstruction}.
5. Maintain the original length of the text and detail level
6. Never add new information or change the original intent or remove key details
7. For technical terms, keep them unchanged unless a more common synonym exists
8. Output only the paraphrased text , no additional comments or explanations
9. ${domainInstruction}
`
        }
    };
}

module.exports = {
    createInstructionSet,
    validateInstruction: (instruction) => {
        try {
            JSON.parse(JSON.stringify(instruction));
            return true;
        } catch (e) {
            return false;
        }
    },
    getInstruction: (phase, tone = '', domain = '') => {
        return createInstructionSet(0.7, tone, domain);
    }
}
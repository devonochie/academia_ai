import axiosInstance from "../axios"


export const generateParaphrase = async ( text, tone, creativity, domain) => {
    try {
        const response = await axiosInstance.post('/paraphrase', {
            text,
            creativity: creativity || "medium",
            domain: domain,
            tone
        })

        return response.data
    } catch (error) {
        console.error("Error generating paraphrase:", error);
        throw error;
    }
}

export const paraphraseDocument = async (file, options = {}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tone', options.tone || 'professional');
        formData.append('domain', options.domain || 'general');
        formData.append('creativity', options.creativity || 0.7);


        const response = await axiosInstance.post('/paraphrase/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error paraphrasing document:", error);
        throw error;
    }
}
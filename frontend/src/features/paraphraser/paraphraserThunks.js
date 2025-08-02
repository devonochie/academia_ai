import { createAsyncThunk } from '@reduxjs/toolkit';
import * as paraphraserApi from '../../api/paraphraser/paraphrase'


export const generateParaphrase = createAsyncThunk(
'paraphraser/generateParaphrase',
    async ({ text, tone, creativity, domain }, { rejectWithValue }) => {
        try {
        const response = await paraphraserApi.generateParaphrase(text, tone, creativity, domain);
        console.log("Paraphrase response:", response);
        return response;
        } catch (error) {
        console.error("Error generating paraphrase:", error);
        return rejectWithValue(error.response?.data || 'Failed to generate paraphrase');
        }
    }
);

export const paraphraseDocument = createAsyncThunk(
    'paraphraser/paraphraseDocument',
    async ({ file, options }, { rejectWithValue }) => {
        try {
            const response = await paraphraserApi.paraphraseDocument(file, options);
            return {
                success: true,
                paraphraseText: response.text || response.paraphraseText,
                score: response.plagiarismScore || response.score,
                originalFilename: response.originalFilename
            };
        } catch (error) {
            console.error("Error paraphrasing document:", error);
            return rejectWithValue(error.response?.data || 'Failed to paraphrase document');
        }
    }
);
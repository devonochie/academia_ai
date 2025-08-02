import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    paraphraseText: "",
    tone: "neutral",
    score: 0,
    creativity: "medium",
    domain: "general",
    isLoading: false,
    isError: false,
    errorMessage: "",
    originalFilename : ''
    
};


const paraphraserSlice = createSlice({
    name: "paraphraser",
    initialState,
    reducers: {
        clearParaphraserText:  (state) => {
            state.paraphraseText = null;
            state.tone = "neutral";
            state.creativity = "medium";
            state.domain = "general";
            state.isLoading = false;
            state.isError = false;
            state.errorMessage = "";
        }
}   ,
    extraReducers: (builder) => {
        builder
            .addCase("paraphraser/generateParaphrase/pending", (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = "";
            })
            .addCase("paraphraser/generateParaphrase/fulfilled", (state, action) => {
                state.isLoading = false;
                state.paraphraseText = action.payload.text;
                state.tone = action.payload.tone;
                state.creativity = action.payload.creativity;
                state.domain = action.payload.domain;
                state.score = action.payload.score || 0;
                state.originalFilename = action.payload.originalFilename || '';
            })
            .addCase("paraphraser/generateParaphrase/rejected", (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload || "Failed to generate paraphrase";
            })
            .addCase("paraphraser/paraphraseDocument/pending", (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase("paraphraser/paraphraseDocument/fulfilled", (state, action) => {
                state.isLoading = false;
                state.paraphraseText = action.payload.paraphraseText;
                state.score = action.payload.score;
                state.tone = action.payload.tone || "professional";
                state.creativity = action.payload.creativity || "medium";
                state.originalFilename = action.payload.originalFilename || '';
            })
            .addCase("paraphraser/paraphraseDocument/rejected", (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
    },

})

export const { clearParaphraserText } = paraphraserSlice.actions;
export default paraphraserSlice.reducer;
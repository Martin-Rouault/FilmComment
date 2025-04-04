import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comments: [],
};

// Création du slice Redux pour les commentaires
const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        addComment: (state, action) => {
            state.comments.push({
                id: Date.now(),
                comment: action.payload.comment,
                note: action.payload.note,
            });
        },
        deleteComment: (state, action) => {
            state.comments = state.comments.filter(
                (comment) => comment.id !== action.payload
            );
        },
    },
});

// Exportation des actions et du reducer
export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;

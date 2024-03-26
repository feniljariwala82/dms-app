import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DocumentType {
  _id: string;
  storagePath: string;
  userId: string;
  mimeType: string;
  categories: string[];
  createdAt: string;
}

// Define a type for the slice state
interface DocumentState {
  documents: DocumentType[];
}

// Define the initial state using that type
const initialState: DocumentState = {
  documents: [],
};

export const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocuments: (state, { payload }: PayloadAction<DocumentType[]>) => {
      state.documents = payload;
    },
  },
});

export const { setDocuments } = documentSlice.actions;

export default documentSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

//асинхронное получение постов (сортировка по новизне на беке)
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

//асинхронное получение тегов
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

//асинхронное удаление статьи
export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    axios.delete(`/posts/${id}`);
  }
);

export const createComment = createAsyncThunk(
  "posts/createComment",
  async ({ postId, comment }) => {
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        postId,
        comment,
      });

      return data;
    } catch (e) {
      console.warn("Ошбика при создание комментария", e.message);
    }
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  comments: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    sortByPopular: (state) => {
      state.posts.items = state.posts.items.sort(
        (a, b) => b.viewsCount - a.viewsCount
      );
    },
  },
  extraReducers: {
    //Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    //Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
    //Создание комментария
    [createComment.pending]: (state) => {
      state.comments.status = "loading";
    },
    [createComment.fulfilled]: (state, action) => {
      state.comments.status = "loaded";
      state.comments.items.push(action.payload);
    },
    [createComment.rejected]: (state) => {
      state.comments.status = "error";
    },
  },
});

export const { sortByPopular } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;

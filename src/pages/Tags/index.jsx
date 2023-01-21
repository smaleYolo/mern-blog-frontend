import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/slices/posts";
import Grid from "@mui/material/Grid";
import { Post } from "../../components";

export const Tags = () => {
  const dispatch = useDispatch();
  const { tag } = useParams();
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <div>
      <h1>#{tag}</h1>

      <Grid xs={8} item>
        {(isPostsLoading
          ? [...Array(3)]
          : posts.items.filter((post) => post.tags.includes(tag))
        ).map((obj, index) =>
          isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ) : (
            <Post
              key={obj._id}
              id={obj._id}
              title={obj.title}
              imageUrl={
                obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
              }
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={false}
            />
          )
        )}
      </Grid>
    </div>
  );
};

import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { useParams } from "react-router-dom";

export const AddComment = () => {
  const [comment, setComment] = useState("");
  const { id } = useParams();

  //получаем данные пользователя
  const { data } = useSelector((state) => state.auth);

  const onSubmit = async () => {
    try {
      const commentFields = {
        comments: comment,
      };

      const { data } = await axios.patch(`/posts/${id}`, commentFields);

      const _id = data._id;
    } catch (err) {
      console.warn(err);
      alert("Ошибка при отправке комментария!");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={data.avatarUrl} />
        <div className={styles.form}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant="contained" onClick={onSubmit}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};

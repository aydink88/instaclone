import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/User";
import {
  getAllPosts,
  likePost as likePostRequest,
  unlikePost as unlikePostRequest,
  makeComment as makeCommentRequest,
  deletePost as deletePostRequest,
} from "../../services/api";
import { useUIContext } from "../../contexts/UIContext";
import { Card, Form } from "react-bootstrap";

const Home = () => {
  const { setToast } = useUIContext();
  const [data, setData] = useState([]);
  const { state } = useUser();
  const [loading, setLoading] = useState(false);
  const [postsError, setPostsError] = useState();

  useEffect(() => {
    setLoading(true);
    if (state?._id)
      getAllPosts()
        .then((result) => setData(result.posts))
        .catch(() => setPostsError("Retrieving failed!"))
        .finally(() => setLoading(false));
  }, [state?._id]);

  const likePost = (id) => {
    likePostRequest(id)
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    unlikePostRequest(id)
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    makeCommentRequest(text, postId)
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    deletePostRequest(postid)
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch(() => setToast("Delete Request Failed!", "error"));
  };

  if (loading) {
    return (
      <div className="center-container">
        <h2>Loading Posts</h2>
        <div className="progress progress-content">
          <div className="indeterminate"></div>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="center-container">
        <h2 style={{ color: "red" }}>{postsError}</h2>
      </div>
    );
  }

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <Card className="home-card" key={item._id}>
            <Card.Header>
              <h5 style={{ padding: "5px" }}>
                <Link
                  to={
                    item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"
                  }
                >
                  {item.postedBy.name}
                </Link>{" "}
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
            </Card.Header>
            <img src={item.photo} alt="profile" />
            <Card.Body>
              <div className="d-flex">
                <div className="me-auto">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      onClick={() => {
                        unlikePost(item._id);
                      }}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => {
                        likePost(item._id);
                      }}
                    >
                      thumb_up
                    </i>
                  )}
                </div>
                <p>
                  <strong>{item.likes.length} likes</strong>
                </p>
              </div>
              <h6 className="lead">{item.title}</h6>
              <Card.Text className="border-bottom">
                <strong>{item.postedBy.name}</strong> {item.body}
              </Card.Text>
              {item.comments.map((record) => {
                return (
                  <p key={record._id}>
                    <span className="text-info fw-bold fs-6">{record.postedBy.name}</span>{" "}
                    <span className="text-muted small">{record.text}</span>
                  </p>
                );
              })}
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <Form.Control type="text" placeholder="add a comment" />
              </Form>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Home;

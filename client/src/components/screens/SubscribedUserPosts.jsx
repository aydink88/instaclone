import { useState, useEffect } from "react";
import { useUser } from "../../contexts/User";
import {
  getSubPost,
  likePost as likeRequest,
  unlikePost as unlikeRequest,
  makeComment as sendComment,
  deletePost as deleteRequest,
} from "../../services/api";
import { Link } from "react-router-dom";
import { Card, Form } from "react-bootstrap";

const Home = () => {
  const [data, setData] = useState([]);
  const { state } = useUser();
  useEffect(() => {
    getSubPost()
      .then((result) => {
        console.log(result);
        setData(result.posts);
      })
      .catch((err) => console.log(err));
  }, []);

  const likePost = (id) => {
    likeRequest(id)
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
    unlikeRequest(id)
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
    sendComment(text, postId)
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
    deleteRequest(postid)
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <Card className="home-card" key={item._id}>
            <Card.Header>
              <h5 style={{ padding: "5px" }}>
                <Link
                  to={
                    item.postedBy._id !== state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
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
            <img src={item.photo} alt="post" />
            <Card.Body>
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

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    {record.text}
                  </h6>
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

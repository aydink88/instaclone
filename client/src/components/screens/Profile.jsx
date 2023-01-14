import { useEffect, useState } from "react";
import imageUpload from "../../utils/imageUpload";
import { useUser } from "../../contexts/User";
import { myProfile, updatePic } from "../../services/api";
import { useUIContext } from "../../contexts/UIContext";
import { Form } from "react-bootstrap";

const Profile = () => {
  const { setToast } = useUIContext();
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useUser();

  useEffect(() => {
    myProfile()
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      })
      .catch((err) => setToast(err.message, "error"));
  }, [setToast]);

  const updatePhoto = async (file) => {
    try {
      const imageUrl = await imageUpload(file);
      const result = await updatePic(imageUrl);
      localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
      dispatch({ type: "UPDATEPIC", payload: result.pic });
    } catch (err) {
      setToast("updating profile picture failed", "error");
    }
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              alt="avatar"
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "loading"}
            />
          </div>
          <div>
            <h4>{state ? state.name : "loading"}</h4>
            <h5>{state ? state.email : "loading"}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{mypics.length} posts</h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>

        <Form.Group>
          <Form.Label>Update pic</Form.Label>
          <Form.Control type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
        </Form.Group>
      </div>
      <div className="d-flex flex-wrap gap-4">
        {mypics.map((item) => {
          return <img key={item._id} className="w-25" src={item.photo} alt={item.title} />;
        })}
      </div>
    </div>
  );
};

export default Profile;

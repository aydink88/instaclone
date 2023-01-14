import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../contexts/User";
import {
  fetchUser,
  followUser as followRequest,
  unfollowUser as unfollowRequest,
} from "../../services/api";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useUser();
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);
  useEffect(() => {
    fetchUser(userid).then((result) => {
      //console.log(result)

      setProfile(result);
    });
  }, [userid]);

  const followUser = () => {
    followRequest(userid).then((data) => {
      dispatch({
        type: "UPDATE",
        payload: { following: data.following, followers: data.followers },
      });
      localStorage.setItem("user", JSON.stringify(data));
      setProfile((prevState) => {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, data._id],
          },
        };
      });
      setShowFollow(false);
    });
  };
  const unfollowUser = () => {
    unfollowRequest(userid).then((data) => {
      dispatch({
        type: "UPDATE",
        payload: { following: data.following, followers: data.followers },
      });
      localStorage.setItem("user", JSON.stringify(data));

      setProfile((prevState) => {
        const newFollower = prevState.user.followers.filter((item) => item !== data._id);
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: newFollower,
          },
        };
      });
      setShowFollow(true);
    });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                alt="profile"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {showfollow ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4">
            {userProfile.posts.map((item) => {
              return <img key={item._id} className="w-25" src={item.photo} alt={item.title} />;
            })}
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
};

export default Profile;

const apiBase = "/api";
const allPosts = apiBase + "/allpost";
const like = apiBase + "/like";
const unlike = apiBase + "/unlike";
const comment = apiBase + "/comment";
const deletepost = apiBase + "/deletepost";
const createpost = apiBase + "/createpost";
const signin = apiBase + "/signin";
const newpassword = apiBase + "/new-password";
const resetpassword = apiBase + "/reset-password";
const myprofile = apiBase + "/mypost";
const updatepic = apiBase + "/updatepic";
const signup = apiBase + "/signup";
const getsubpost = apiBase + "/getsubpost";
const fetchuser = apiBase + "/user";
const followuser = apiBase + "/follow";
const unfollowuser = apiBase + "/unfollow";

async function http(url, method = "get", body) {
  const token = localStorage.getItem("jwt");
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.statusText !== "OK") {
      if (data?.error) {
        throw new Error(data.error);
      }
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err ? err : new Error("Request failed");
  }
}

export function getAllPosts() {
  return http(allPosts);
}

export function likePost(id) {
  return http(like, "put", { postId: id });
}

export function unlikePost(id) {
  return http(unlike, "put", { postId: id });
}

export function makeComment(text, postId) {
  return http(comment, "put", { postId, text });
}

export function deletePost(postId) {
  return http(deletepost + "/" + postId, "delete");
}

export function createPost(reqBody) {
  return http(createpost, "post", reqBody);
}

export function signinRequest(email, password) {
  return http(signin, "post", { email, password });
}

export const signupRequest = (reqBody) => http(signup, "post", reqBody);

export function newPassword(password, token) {
  return http(newpassword, "post", { password, token });
}

export function resetPassword(email) {
  return http(resetpassword, "post", { email });
}

export function myProfile() {
  return http(myprofile);
}

export function updatePic(imageUrl) {
  return http(updatepic, "put", { pic: imageUrl });
}

export const getSubPost = () => http(getsubpost);

export function fetchUser(userid) {
  return http(`${fetchuser}/${userid}`);
}

export function followUser(userid) {
  return http(followuser, "put", { followId: userid });
}

export function unfollowUser(userid) {
  return http(unfollowuser, "put", { unfollowId: userid });
}

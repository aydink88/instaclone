export default async function imageUpload(image) {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const res = await fetch(
      "https://api.imgbb.com/1/upload?expiration=60000&key=fed79926f81ec089b6c1764323be8124",
      {
        method: "post",
        body: formData,
      }
    );
    const data = await res.json();

    if (data.status_code >= 400) {
      throw new Error("cannot upload");
    }
    return data.data.display_url;
  } catch (err) {
    throw err ? err : new Error("image upload failed");
  }
}

//without async using then-catch
// export default function imageUpload(image) {
//   const formData = new FormData()
//   formData.append('image', image)
//   return new Promise(async (resolve, reject) => {
//     fetch('https://api.imgbb.com/1/upload?expiration=60000&key=fed79926f81ec089b6c1764323be8124', {
//       method: 'post',
//       body: formData,
//     })
//       .then((res) => {
//         return res.json()
//       })
//       .then((data) => {
//         if (data.status_code >= 400) {
//           throw new Error('Upload failed.!')
//         }
//         resolve(data.data.display_url)
//       })
//       .catch((err) => {
//         reject(err)
//       })
//   })
// }

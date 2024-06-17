const axios = require("axios");

axios({
  method: "POST",
  url: "https://detect.roboflow.com/bad-forage-v2/1",
  params: {
    api_key: "oQlte7b2JXcLhVMtf196",
    image:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5U9UWa1tPFzzUu-OtCFhu8ZOsZ4L8TyF8JVsJCkYp7rOsQpwj_rbdp2TalkLfYAQlnz8TDTbKfgyXpdTtHu-Odk5NMUO2Ed8m6yvKQkaJwyCzS_WXuYaGLyDn14ZjOpmBTgxhML0YG10/s1600/IMG_2559.JPG",
  },
})
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error.message);
  });

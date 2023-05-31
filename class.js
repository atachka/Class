import axios from "axios";
class OurClass {
  constructor(text) {
    this.text = text;
  }
  text;
  async start() {
    const response = await axios({
      method: "post",
      url: "https://enagramm.com/API/Account/Login",
      data: {
        Email: "levan.lashauri1@gmail.com",
        Password: "Demo_1234",
      },
    });
    const splitSymbols = {
      "!": "!",
      ".": ".",
      "?": "?",
      ";": ";",
      ",": ",",
      " ": " ",
    };
    const words = this.text.split("");
    let sentence = "";
    let IterationCount = 1;
    let model = {
      Language: "ka",
      Text: sentence,
      Voice: 0,
      IterationCount: 2,
    };
    for (let i = 0; i < words.length; i++) {
      sentence += words[i];
      if (sentence.length >= 150) {
        if (splitSymbols[words[i]]) {
          model.Text = sentence;
          model.IterationCount = IterationCount;
          IterationCount++;
          await axios
            .post(
              "https://enagramm.com/API/TTS/SynthesizeTextAudioPath",
              JSON.stringify(model),
              {
                headers: {
                  Authorization: "Bearer" + " " + response.data.AccessToken,
                  "Content-Type": "application/json; charset=utf-8",
                },
              }
            )
            .then(function (response) {
              var result = response.data;
              var sourceUrl = result.AudioFilePath;
              onResult(sourceUrl);
              // Handle the success response here
            })
            .catch(function (error) {
              console.log(error);
              // Handle the error response here
            });

          sentence = "";
        }
      }
    }
    model.text = sentence;
    model.IterationCount = IterationCount;
    await axios
      .post(
        "https://enagramm.com/API/TTS/SynthesizeTextAudioPath",
        JSON.stringify(model),
        {
          headers: {
            Authorization: "Bearer" + " " + response.data.AccessToken,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      )
      .then(function (response) {
        var result = response.data;
        var sourceUrl = result.AudioFilePath;
        onResult(sourceUrl);
        // Handle the success response here
      })
      .catch(function (error) {
        console.log(error);
        // Handle the error response here
      });
  }
  onResult(result) {
    console.log(result);
  }
}

import axios from "axios";

export default class OurClass {
  constructor(text) {
    this.text = text;
    this.data = [];
  }

  onResult(result) {
    this.data.push(result);
  }

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

      if (sentence.length >= 150 || sentence.length === 230) {
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
            .then((response) => {
              var result = response.data;
              var sourceUrl = result.AudioFilePath;
              this.onResult(sourceUrl); // Use arrow function or bind this
              // Handle the success response here
            })
            .catch((error) => {
              console.log(error);
              // Handle the error response here
            });

          sentence = "";
        }
      }
    }

    model.Text = sentence;
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
      .then((response) => {
        var result = response.data;
        var sourceUrl = result.AudioFilePath;
        this.onResult(sourceUrl); // Use arrow function or bind this
        // Handle the success response here
      })
      .catch((error) => {
        console.log(error);
        // Handle the error response here
      });
    return this.data;
  }
}

/// example of usage
const instance = new OurClass(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
);
const data = await instance.start();
console.log(data);

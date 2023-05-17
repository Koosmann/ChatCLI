import { Command } from "commander";
import { Configuration, OpenAIApi } from "openai";
import * as rl from "readline-sync";
import fs from "fs";

const commander = new Command();
let apiKey: string;

// Check if api.key file exists
if (fs.existsSync('api.key')) {
    // If it does, read the API key from the file
    apiKey = fs.readFileSync('api.key', 'utf8');
} else {
    // If it doesn't, prompt the user for the API key
    console.log("API key is required.");
    apiKey = rl.question("Please enter your API key: ", { hideEchoBack: true });

    // Save the API key to the api.key file for future use
    fs.writeFileSync('api.key', apiKey);
}

commander
  .version("1.0.0")
  .command("chat")
  .description("Start chatting with ChatGPT")
  .action(async () => {
    const configuration = new Configuration({
      apiKey: process.env.APIKEY,
    });

    const openai = new OpenAIApi(configuration);

    let conversationId: string | undefined;

    while (true) {
      const message = await rl.question("You: ");
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0,
        max_tokens: 10
      });

      const text = response.data.choices[0].text || ""

      console.log()
      console.log(`ChatGPT: ${text.slice(2)}`);
      console.log()

      conversationId = response.data.id;
    }
  });

commander.parse(process.argv);

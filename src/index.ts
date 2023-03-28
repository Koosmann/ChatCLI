import { Command } from "commander";
import { Configuration, OpenAIApi } from "openai";
import * as rl from "readline-sync";

const commander = new Command();
if (process.env.APIKEY === undefined) {
  console.error("APIKEY env var required.");
  process.exit(1);
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

import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, getDailyLeetCode, getGlobalCommands, InstallGlobalCommands, getDailyLeetCode } from './utils.js';
import { response } from 'express';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

//trying out the embed
const EMBED_COMMAND = {
  name: 'embed',
  description: 'Embeds a message',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, EMBED_COMMAND];

//InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

let myResponse = await getGlobalCommands(process.env.APP_ID);
console.log(await myResponse.json());

//let myResponse = await getDailyLeetCode();
//let myjson = await myResponse.json();
//console.log(myjson.questionLink);

//make data for response to discord api used in embed command at app.js
export async function leetCodeDailyData(){
  //fetching the response from the api
  let myResponse = await getDailyLeetCode();
  //json from the response
  let myjson = await myResponse.json();
  let data = {
    // Fetches a random emoji to send from a helper function
    //content: `challege accepted ${getRandomEmoji()}`,
    embeds: [
      {
        type: "article",
        url: myjson.questionLink,
        title:  `${myjson.questionFrontendId}. ${myjson.questionTitle}`,
        description:
          "Leet code number something difficulty something and much more information i guess",
        color: 5947068,
        footer: {text: "hola muchcachos bienvenidos al footer de la cosa en cuestion",icon_url: "https://i.ibb.co/Y4FGqP9L/i-created-a-short-story-to-back-up-the-shrek-frieren-v0-fkg5kqr31dcd1.png"},
        image: {
          url: "https://i.ibb.co/Y4FGqP9L/i-created-a-short-story-to-back-up-the-shrek-frieren-v0-fkg5kqr31dcd1.png",
          //proxy_url:
          //  "https://images-ext-1.discordapp.net/external/geFbc8OQDIwJV_CxP_75bUhImtkBwcm5q7CIv95jCcA/https/cdn.prod.website-files.com/6257adef93867e50d84d30e2/665643dd8c7ac752237b5cef_Discord-OG-1200x630.jpg",
          width: 1200,
          height: 630,
          
          //placeholder: "TAYKFIB2dWiAl3hoh4Z2j+J49g==",
          //placeholder_version: 1,
          //flags: 0,
        },
        fields: [
          {
            name: "Field 1",
            value: "Value 1",
            inline: false,
          },
          {
            name: "Field 2",
            value: "Value 2",
            inline: false,
          },
          {
            name: "Field 3",
            value: "Value 3",
            inline: false,
          },
        ],
      },
    ],
  }
  return data;
}
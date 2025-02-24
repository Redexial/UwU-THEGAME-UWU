import "dotenv/config";
import jsdom from "jsdom";
import jquery from "jquery";
import e from "express";

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;
var $ = jquery(window);

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": "UwU-TheGame-UwU ()",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

// API endpoint to get daily leetcode question

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;
  
  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    console.log(
      await DiscordRequest(endpoint, { method: "PUT", body: commands })
    );
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = [
    "😭",
    "😄",
    "😌",
    "🤓",
    "😎",
    "😤",
    "🤖",
    "😶‍🌫️",
    "🌏",
    "📸",
    "💿",
    "👋",
    "🌊",
    "✨",
  ];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getGlobalCommands(appId) {
  // API endpoint to get global commands
  const endpoint = `applications/${appId}/commands`;
  let response = Response;
  
  try {
    // This is calling get commands https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    response = await DiscordRequest(endpoint, { method: "get" });
  } catch (err) {
    console.error(err);
  } finally {
    return response;
  }
}

// API endpoint to get daily leetcode question and return JSON
export async function getDailyLeetCode() {
  const url = "http://localhost:3000/daily";
  const res = await fetch(url, {
    headers: {
      "method": "get",
    },
  });
  return await res.json();
}

// turn leetcode json into an embed for the discord message
export function leetCodeInfoToEmbed(leetCodeJson) {
  const dividedQuestion = leetCodeQuestionDivide(leetCodeJson.question);
  const descriptionText = dividedQuestion[0];
  const examples = leetCodeFieldsEmbed(dividedQuestion);
  let embed = {
    type: "article",
    url: leetCodeJson.questionLink,
    title: `${leetCodeJson.questionFrontendId}. ${leetCodeJson.questionTitle}`,
    description:
    descriptionText,
    color: 5947068,
    footer: {
      text: "hola muchcachos bienvenidos al footer de la cosa en cuestion",
      icon_url:
      "https://i.ibb.co/Y4FGqP9L/i-created-a-short-story-to-back-up-the-shrek-frieren-v0-fkg5kqr31dcd1.png",
    },
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
    fields: examples,
  }
  
  return embed; 
}

// Separate the html from the leetcode JSON.question into an array of strings for later use in the embed
export function leetCodeQuestionDivide(question) {
  let parts = question.split("<p>&nbsp;</p>");
  let partsText = []
  for(let i in parts){
    partsText.push($(parts[i]).text());
  }

  return partsText;
}

export function leetCodeFieldsEmbed(dividedQuestion){
  let examples = dividedQuestion[1].split("\n\n\n");
  examples = examples.map((example) => {
    return {
      name: example.split("\n\n")[0],
      //taking everything after the first element so that example 1:\n\n is skipped and everything is joined back together
      value: example.split("\n\n").slice(1).join("\n\n"),
    };
  });
  examples.push({
    name: "Constraints",
    //taking everything after the first element so that constraints:\n\n is skipped
    value: dividedQuestion[2].split("\n\n").slice(1).join("\n\n"),
  });
  return examples
}
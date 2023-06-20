
import {v2 } from '@google-cloud/translate';
import cld from "cld";

const Translate = v2.Translate;

const translate = new Translate({projectId: "exalted-breaker-348215"});


export async function translateIfNecessary(promptAnyLanguage) {
  try {
    let isEnglish = false;
    try {
      isEnglish = await testEnglish(promptAnyLanguage);
    } catch (e) {
      console.log(`error testing english "${e.message}" but no problem. Just translating`);
    }
    // const prompt = isEnglish ? promptAnyLanguage : (await translate(promptAnyLanguage, { to: "en" }))?.text;
    
    const [prompt] = await translate.translate(promptAnyLanguage, "en");
 
    // if (!isEnglish) {
      console.log("translated prompt to english ",promptAnyLanguage, "---", prompt);
    // }

    return prompt;
  } catch (e) {
    console.log("error translating", promptAnyLanguage, e);
    return promptAnyLanguage;
  }
}
// In an async function

async function testEnglish(text) {
  const { languages } = await cld.detect(text);
  const language = languages[0]?.name;
  return language === 'ENGLISH';
}


// translateIfNecessary("hallo").then(console.log);
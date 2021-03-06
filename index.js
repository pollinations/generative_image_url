import http from 'http';
import awsModelRunner from '@pollinations/ipfs/awsModelRunner.js';
import { parse }  from 'url';
import urldecode from 'urldecode';
import jimp from "jimp"

import memoize from 'lodash.memoize';
import { cache } from './cache.js';
import { gifCreator } from './gifCreator.js';
import fetch from 'node-fetch';

const requestListener = async function (req, res) {

  const { pathname } = parse(req.url, true);

  console.log("path: ", pathname);

  if (!pathname.startsWith("/prompt")) {
    res.writeHead(404);
    res.end('404: Not Found');
    return
  }
  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  // const { showImage, finish } = gifCreator(res);

  // await showImage("https://i.imgur.com/lTAeMmN.jpg");

  const promptAndSeed = pathname.split("/prompt/")[1];
  
  const [promptRaw, seed] = promptAndSeed.split("/");

  const prompt = urldecode(promptRaw).replaceAll("_", " ");

  const url = await runModel({
    text:prompt, 
    grid_size: 1,  
    intermediate_outputs: false,
    // seed: seed || 0
  }, "pollinations/min-dalle", true)

  console.log("Showing image: ", url);
  // await showImage(url);

  // finish()


  // fetch the image and return it to the response
  const image = await fetch(url);
  const buffer = await image.buffer();
  res.write(buffer);

  console.log("finishing")
  res.end();

}

const runModel = memoize(cache(awsModelRunner), params => JSON.stringify(params))


const server = http.createServer(requestListener);
server.listen(8080);



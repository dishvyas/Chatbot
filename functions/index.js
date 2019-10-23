const functions = require('firebase-functions');

'use strict';
 
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
  	databaseURL: 'https://yoyopizza-biwlfr.firebaseio.com/'
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function addorder(agent){
    const pizzatype = agent.parameters.type;
    const pizzasize = agent.parameters.size;
    const pizzacount = agent.parameters.count;

    return admin.database().ref('data').set({
    	pizzatype: pizzatype,
      	pizzasize: pizzasize,
      	pizzacount: pizzacount
    });
 
  }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Welcome', addorder);
  agent.handleRequest(intentMap);
});


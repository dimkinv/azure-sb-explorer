const ServiceBusClient = require('@azure/service-bus').ServiceBusClient;
const ReceiveMode = require('@azure/service-bus').ReceiveMode;

const logger = require('./logger');

const sbListenConnectionStringEl = document.querySelector(
  '#sbListenConnectionString',
);
const sbSendConnectionStringEl = document.querySelector(
  '#sbSendConnectionString',
);

const sbQueueNameEl = document.querySelector('#sbQueueName');

const connectBtn = document.querySelector('#connectBtn');
const sendMessageButton = document.querySelector('#sendMessageBtn');

const messageNameEl = document.querySelector('#messageName');
const messageBodyEl = document.querySelector('#messageBody');

let sender;

toggleWatchSendMessageButton();

connectBtn.addEventListener('click', () => {
  const listenConnectionString = sbListenConnectionStringEl.value;
  const sendConnectionString = sbSendConnectionStringEl.value;

  const queueName = sbQueueNameEl.value;

  try {
    if (listenConnectionString) {
      logger.log(
        'listen connection string found, initiating listen connection',
      );
      initiateListen(listenConnectionString, queueName);
    }

    if (sendConnectionString) {
      logger.log('send connection string found, initiating send connection');
      initiateSend(sendConnectionString, queueName);
    }
  } catch (ex) {
    logger.error('error connecting to service bus', ex);
  }
});

function initiateListen(connectionString, queueName) {
  const serviceBusListenClient = ServiceBusClient.createFromConnectionString(
    connectionString,
  );

  logger.log(`creating queue client for: ${queueName}`);
  const queueClient = serviceBusListenClient.createQueueClient(queueName);

  logger.log('creating queue receiver');
  const receiver = queueClient.createReceiver(ReceiveMode.peekLock);

  logger.log('registering message handler');
  receiver.registerMessageHandler(
    (message) => {
      logger.message(message.id, message.body);
    },
    (error) => {
      logger.error('error on message handler', error);
    },
  );
}

function initiateSend(connectionString, queueName) {
  const serviceBusListenClient = ServiceBusClient.createFromConnectionString(
    connectionString,
  );

  logger.log(`creating queue client for: ${queueName}`);
  const queueClient = serviceBusListenClient.createQueueClient(queueName);

  logger.log('creating queue sender');
  sender = queueClient.createSender();
}

sendMessageButton.addEventListener('click', async () => {
  const messageName = messageNameEl.value;
  const messageBody = JSON.parse(messageBodyEl.value);

  try {
    logger.log(`sending message, name: ${messageName}`);
    await sender.send({
      label: messageName,
      body: messageBody,
    });

    logger.log(`message ${messageName} sent successfully`);
  } catch (ex) {
    logger.error('error sending message', ex);
  }
});

let messageName;
let messageBody;

function toggleWatchSendMessageButton() {
  messageNameEl.addEventListener('keyup', (event) => {
    messageName = event.currentTarget.value;
    toggleSendMessageButton();
  });
  messageBodyEl.addEventListener('keyup', (event) => {
    messageBody = event.currentTarget.value;
    toggleSendMessageButton();
  });
}

function toggleSendMessageButton() {
  if (!messageName || !messageBody || !sender) {
    sendMessageButton.disabled = 'disabled';
    return;
  }

  sendMessageButton.disabled = null;
}

// send Endpoint=sb://yugitcuh.servicebus.windows.net/;SharedAccessKeyName=example-agent-queue-send-rule;SharedAccessKey=4ZIGUg1eHQ4yu09vYsoL9NF6VWDbjR3OSAP1Yy+TBkg=;EntityPath=example-agent
// listen Endpoint=sb://yugitcuh.servicebus.windows.net/;SharedAccessKeyName=example-agent-queue-listen-rule;SharedAccessKey=z6eqBAa1gRQakoIduCe7671t9C1d04zqJQET6+tllPU=;EntityPath=example-agent

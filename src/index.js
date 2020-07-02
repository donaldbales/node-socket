const net = require('net');
const util = require('util');

function short(obj) {
  return `${util.inspect(obj, true, 3, false)}`.replace(/\n/gi, '').slice(0, 80);  
}
/*
const client = net.createConnection(8001, '127.0.0.1', (arg1, arg2, arg3) => {
  console.log(`\n*** net.createConnection()`);
  console.log(short(arg1)); // request
  console.log(short(arg2)); // response
  console.log(short(arg3)); // undefined
});
*/

let order = 0;

async function forReady(socket) {
  return new Promise((resolve, reject) => {
    socket.on('error', (hadError) => { 
      const localOrder = ++order;
      console.log(`\n*** ${localOrder}: socket on error`); 
      reject(hadError);
    });
    socket.on('ready', () => { 
      const localOrder = ++order;
      console.log(`\n*** ${localOrder}: socket on ready`);
      resolve(socket);
    });
  });
}

async function main() {
  const client = new net.Socket();

  const localOrder = ++order;
  console.log(`*** ${localOrder}: main()`);
  console.log(short(client));

  client.on('close', (args) => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on close`); 
    console.log(args);
  });
  client.on('connect', () => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on connect`); 
  });
  client.on('data', (args) => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on data`); 
    console.log(args);
  });
  client.on('drain', () => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on drain`); 
  });
  client.on('end', () => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on end`); 
  });
  client.on('error', (hadError) => { 
    const localOrder = ++order;
    console.error(`\n*** ${localOrder}: client on error`);
    console.error(hadError);
  });
  client.on('lookup', () => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on lookup`); 
  });
  client.on('ready', (args) => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on ready`); 
    clientReady = true;
  });
  client.on('timeout', () => { 
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client on timeout`); 
  });

  client.connect(8001, '127.0.0.1', (args) => {
    const localOrder = ++order;
    console.log(`\n*** ${localOrder}: client.connect()`);
    console.log(args);
  });

  try {  
    await forReady(client);

    client.write('Hello');

    setTimeout(() => { client.end(`Goodbye`); }, 3000);
  } catch (err) {
    const localOrder = ++order;
    console.error(`*** ${localOrder}: Connection failed:\n${err}`);
  }
}

main();

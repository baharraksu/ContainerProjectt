
// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
//const { Pool } = require('pg');

const PORT = 3002;

// Middleware
app.use(bodyParser.json());

// RabbitMQ bağlantı bilgileri
const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE_NAME = 'trigger_queue'; // Kuyruk adı
 
// HTTP endpoint for triggering the message
app.post('/trigger-message', (req, res) => {

  // Gönderilecek mesaj içeriği
  const name  = req.body.name
  const surname =req.body.surname
  const age   = req.body.age



  // RabbitMQ'ya mesaj gönderme
  sendMessageToRabbitMQ(JSON.stringify({name,surname,age}));

  // Başarılı yanıt döndürme
  res.status(200).send('Message sent successfully.');
});

async function sendMessageToRabbitMQ(data) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
  
      if (data !== undefined) {
        await channel.assertQueue(QUEUE_NAME);
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(data));
        console.log("Message sent to RabbitMQ:", data);
      } else {
        console.error("Message is undefined. Cannot send to RabbitMQ.");
      }
  
      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (error) {
      console.error("Error sending message to RabbitMQ:", error);
    }
  }  

  function listenToRabbitMQ() {
    amqp.connect(RABBITMQ_URL, (error0, connection) => {
      if (error0) {
        console.error("Error connecting to RabbitMQ:", error0);
        return;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          console.error("Error creating channel:", error1);
          return;
        }
        channel.assertQueue(QUEUE_NAME, { durable: false });
  
        console.log('Provider-app connected to RabbitMQ. Waiting for messages...');
  
        // Mesajları dinleme
        channel.consume(QUEUE_NAME, (msg) => {
          const message = msg.content.toString();
          console.log('Received message:', message);
  
          channel.ack(msg);
        });
      });
    });
  }
  

// HTTP sunucusunu başlatma
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

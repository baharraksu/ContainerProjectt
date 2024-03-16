const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 3001;

const PG_CONFIG = {
    user: 'user',
    host: 'db',
    database: 'app',
    password: 'password',
    port: 5432,
};

// Middleware
app.use(bodyParser.json());

const pool = new Pool(PG_CONFIG);

app.post('/students', async (req, res) => {
    try {
        const { name,surname,age } = req.body;
       
        const query = 'INSERT INTO students (name,surname, age) VALUES ($1, $2, $3)';
        await pool.query(query, [name,surname,age]);
        res.status(201).json({
            status: 'success',
            message: 'Student added successfully'
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add student'
        });
    }
});
app.get('/students', async (req, res) => {
    try {
        const query = 'SELECT * FROM students';
        const result = await pool.query(query);
        res.status(200).json({
            status: 'success',
            students: result.rows
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch students'
        });
    }
});
app.put('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, surname, age } = req.body; // Güncellenecek öğrenci bilgilerini alın
        const updateQuery = 'UPDATE students SET name = $1, surname = $2, age = $3 WHERE id = $4';
        const result = await pool.query(updateQuery, [name, surname, age, studentId]);
        
        if (result.rowCount > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Student updated successfully'
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Student not found'
            });
        }
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update student'
        });
    }
});

app.delete('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        // Veritabanından öğrenci silme
        const query = 'DELETE FROM students WHERE id = $1';
        const result = await pool.query(query, [studentId]);
        
        if (result.rowCount > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Student deleted successfully'
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Student not found'
            });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete student'
        });
    }
});
const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE_NAME = 'trigger_queue';

amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        channel.assertQueue(QUEUE_NAME, { durable: false });

        console.log('Client-app connected to RabbitMQ. Listening for messages...');

    
        channel.consume(QUEUE_NAME, async (msg) => {
            const message = msg.content.toString();
            console.log('Received message from RabbitMQ:', message);

        //     if (message.operationType == "insert") { 
        //         // db den get işlemi yap eger data varsa gelen bilgiler ile güncelle
        //         //data yoksa yeni kayıt olusutur
        //     }else if (message.operationType == "update"){
        //         //delete from db where name = message.name
        //     }
        //     else if (message.operationType == "delete"){
        //         //update from db where name = message.name
        //     }
        //     console.log("Student : " + student)
            
        // }, {
            try {
                const data = JSON.parse(message);
                await addToDatabase(data);
            } catch (error) {
                console.error('Error processing message:', error);
            }
            channel.ack(msg);
        });
    });
});
async function addToDatabase(data) {
    const { name,surname,age } = data;
    const query = 'INSERT INTO students (name,surname,age) VALUES ($1, $2, $3)';
    await pool.query(query, [name,surname,age]);
    console.log('Data added to PostgreSQL:', data);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

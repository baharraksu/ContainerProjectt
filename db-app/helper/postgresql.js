const { Pool } = require('pg');

// PostgreSQL bağlantı bilgileri
const PG_CONFIG = {
    user: 'user',
    host: 'db',
    database: 'app',
    password: 'password',
    port: 5432,
};

// PostgreSQL havuzunu oluştur
const pool = new Pool(PG_CONFIG);

// Bağlantıyı test etmek için basit bir sorgu yapabiliriz
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL. Current time is:', res.rows[0].now);
    }
});

// Diğer modüllerin bu PostgreSQL havuzunu kullanabilmesi için dışa aktar
module.exports = pool;

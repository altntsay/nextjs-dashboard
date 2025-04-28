import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config(); // .env dosyasındaki değişkenleri yükle

async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'aybuke_altuntas', // kullanıcı adınızı buraya ekleyin
      password: '2468235711altnts#', // şifrenizi buraya ekleyin
      database: 'ecommerce_database', // veritabanı adınızı buraya ekleyin
    });

    console.log('✅ MySQL bağlantısı başarılı!');
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL bağlantı hatası:', error.message);
  }
}

testDatabaseConnection();
testDatabaseConnection()
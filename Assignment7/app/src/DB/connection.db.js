import { MongoClient } from "mongodb";
import { DB_NAME, DB_URI } from "../../config/config.service.js";
const client = new MongoClient(DB_URI);
export const db = client.db(DB_NAME)


export const authenticateDB = async () =>{
    try {
        await client.connect();
        console.log(`DB connected 🚀`);
        
    }catch(error){
        console.error(`Error connecting to DB: ${error}`);
    }
}


//1

export const booksModel= await db.createCollection('books', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title"],
      properties: {
        title: {
          bsonType: "string",
          description: "Title must be a non-empty string and is required",
          minLength: 1
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
})


//2
 try {
    const existingBook = await booksModel.findOne({ title: 'Book1' });
    if (!existingBook) {
      await booksModel.insertOne({ title: 'Book1', author: 'Author1' });
      console.log('✅ Book inserted');
    }
  } catch (err) {
    console.error('❌ Failed to insert book:', err);
  }

  //3
try {
    await db.createCollection('logs', { capped: true, size: 1048576 });
    console.log('✅ Capped collection "logs" created');
  } catch (e) {
    if (e.codeName !== 'NamespaceExists') throw e;
  }

//4
   try {
    await booksModel.createIndex({ title: 1 });
    console.log('✅ Index on books.title created');
  } catch (e) {
    console.warn('⚠️ Index may already exist:', e.message);
  }
//5
   try {
    await booksModel.insertOne({
      title: 'book1',
      author: 'ali',
      year: 1937,
      genres: ['Fantasy', 'Adventure'] // ✅ Fixed
    });
    console.log('✅ Book "book1" inserted');
  } catch (e) {
    console.warn('⚠️ book1 may already exist or validation failed:', e.message);
  }
//6
  try {
    const result = await booksModel.insertMany([
      { title: 'Future', author: 'George Orwell', year: 2020, genres: ['Science Fiction'] },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, genres: ['Classic', 'Fiction'] },
      { title: 'Brave New World', author: 'Aldous Huxley', year: 2005, genres: ['Dystopian', 'Science Fiction'] }
    ]);
    console.log(`✅ ${result.insertedCount} books inserted`);
  } catch (e) {
    console.error('❌ Failed to insert batch:', e);
  }
//7
  try {
    await db.collection('logs').insertOne({
      message: 'System started',
      level: 'info',
      timestamp: new Date()
    });
    console.log('✅ Initial log inserted');
  } catch (e) {
    console.error('❌ Failed to insert log:', e);
  }

import app from './app';
import connectDatabase from './utils/database';

const port = process.env.PORT || 4003;
connectDatabase()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed, but continuing without DB for development:', error.message);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  });

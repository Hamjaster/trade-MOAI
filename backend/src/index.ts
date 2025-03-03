
import { app, logger } from "./server.js";
import { Config } from "./common/utils/envConfig.js";
import mongoose from "mongoose";

const server = app.listen(Config.PORT, () => {
  const { NODE_ENV, HOST, PORT } = Config;
  console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});


// Connect to MongoDB and start the server
mongoose.connect(Config.MONGODB.url, Config.MONGODB.options).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.log('Error connecting to mongodb :', err)
);


const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

#App
echo APP_PORT=8085 >> .env
echo APP_ENV=development >> .env
echo ALLOWED_ORIGINS=[http://localhost:3000/, http://localhost:8085/] >> .env

#Mongo
echo MONGODB_CONNECTION_STRING=$DEV_MONGODB_CONNECTION_STRING >> .env
echo MONGODB_DATABASE=learnix-dev >> .env

#Compression
echo COMPRESSION_THRESHOLD=$DEV_COMPRESSION_THRESHOLD >> .env

#Firebase
echo FIREBASE_PATH_SERVICE_ACCOUNT=$DEV_FIREBASE_PATH_SERVICE_ACCOUNT >> .env


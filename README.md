# How to run application (development mode)

Before running it you need a local connection to mongodb, after that

1. npm i
2. npm run dev

# Tecnology used

Backend is done using nodejs with express & mongodb to persist data. His architecture is based on

1. config folder where are environment variables
2. src forder where are routes, controllers, models, data base configuration folders and finally files to run server with express

Multer and gridFs was used to interact with the video files

# Note

If you want see listed all videos, you must add a label named General which was configured to show all videos you have added.

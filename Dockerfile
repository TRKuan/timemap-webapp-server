# Define from what image we want to build our own image from.
FROM node:6.10

# Create the working directory that holds the application code inside our image.
RUN mkdir /app
WORKDIR /app

# Install app dependencies inside our image.
COPY package.json /app
RUN npm install

# Bundle app source
COPY . /app

# Bind app to the specified port to be mapped by the Docker daemon.
EXPOSE 8080

# Define the command to run app.
CMD ["npm", "start"]

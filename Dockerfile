FROM eu.gcr.io/sanity-cloud/node:7.6

ARG NPMRC

# Set up environment
WORKDIR /srv/cavs-www
RUN useradd --home /srv/cavs-www --shell /bin/false nodejs

# Install app dependencies (pre-source copy in order to cache dependencies)
COPY package.json .
RUN npm install -s

# Prepare app
COPY . .
RUN chown -R nodejs /srv/cavs-www \
  && npm run build

# Run application
ENV NODE_ENV=production
EXPOSE 3000
CMD ["gosu", "nodejs", "node", "build/server.js"]

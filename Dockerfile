FROM eu.gcr.io/sanity-cloud/node:7.6

# Set up environment
WORKDIR /srv/cavs-www
RUN useradd --home /srv/cavs-www --shell /bin/false nodejs

# Install app dependencies (pre-source copy in order to cache dependencies)
COPY package.json .
RUN yarn install --production --no-progress

# Set correct user for files
COPY . .
RUN chown -R nodejs /srv/cavs-www

# Run application
ENV NODE_ENV=production
EXPOSE 3000
CMD ["gosu", "nodejs", "node", "src/server.js"]

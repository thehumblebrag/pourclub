# Pour Club

Lots of bars sell beer. But what if they don't serve the _right_ beer? Life is short, and when it comes to booze you simply can't afford mistakes.

Do your homework, make sure you prepare before you pour when setting out to get wankered. Pour Club lets you see nearby drinking establishments and what sort of drink they're likely to sell you too much of.

Never drink Fosters again. Pour Club.

## Getting Started and requirements

The following are all required, for Mac just use `brew` and for others... figure it out.

- nodejs and npm (`brew install node`)
- ruby (`brew install ruby`)
- mongodb (`brew install mongo`)
- sass + compass (`gem install sass compass`)
- gulp (`npm install gulp`)

### Enable mongodb `text search` required

Ensure `mongodb` has `textSearchEnabled` which can be done by editing your `mongod.conf` and adding the line `setParameter=textSearchEnabled=true` to it. This file is, if installed with brew, at `/usr/local/etc/mongod.conf` or just `/etc/mongod.conf`.

## Run app server

You need to install all required server packages which can be done with `npm install` and `bower install`. This will install all required modules. Once installed run `gulp production` to build all front end requirements (compile the `javascript` and `scss` into a single `js` file + `css`).

To start the server you can use `node index.js`.

## Development

To run development use `gulp` which will run a watch script to build `javascript` and `scss`.

To run the server and update it use `nodemon` with `nodemon index.js` instead of `nodemon`.

## Helpful scripts

- Populate drinks `node bin/source-beers`
- Populate locations `node bin/source-pubs.js "-31.9522" "115.8589"`

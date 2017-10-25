Webtask.IO + Twilio Example
-------------------------

A script on how to get up and running with Webtask.io and Twilio. Simply input your own Twilio keys and variables and you should be up and running soon.

If you need to install Webtask, [here are some directions](https://webtask.io/cli).

If you want to get started with this particular script copy snow.js and do the following:

 1. Install Webtask
 2. Add your Twilio Sid and authToken to snow.js
 3. run `wt create snow.js`
 4. Webtask will create an endpoint link for you. Most likely something like https://ww-SOMETHING.run.webtask.io/snow
 5. Go back to Twilio console, click on the number you want to use from your account and add the endpoint from the previous step to your configuration. Make sure the method is `HTTP POST` like the picture below.
 
 ![Twilio console](https://i.imgur.com/sA47wse.png)
 
 6. You should now be able to send your number a text and get a response in return.
 7. Edit the API calls to any endpoint and make your own text bot!

 
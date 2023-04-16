# passport-mailapp

[Passport](http://passportjs.org/) strategy for authenticating with [Mail.ru](http://mail.ru/)
using the OAuth 2.0 API.

## Install

    $ npm install passport-mailapp

## Usage

### Configure Strategy

Using this strategy, you can authenticate users who have a Mail.ru account and
access their data, given their access permission.

In order to be used, a strategy must be configured with two parameters.

```javascript
const MailruStrategy = require("passport-mailapp").Strategy;
passport.use(new MailruStrategy(options, verify));
```

| Parameter | Type     | Desciption                       |
| --------- | -------- | -------------------------------- |
| `options` | object   | App credentials and callback URL |
| `verify`  | function | Strategy verification callback   |


#### Strategy options

The `options` objects provides the strategy with the information it needs to
represent your app to VK API. It includes your app credentials (application id
and secret), as well as the callback URL to which the user will be redirected
after they complete the authentication process.

| Field           | Type       | Description                                                     |
| --------------- | ---------- | --------------------------------------------------------------- |
| `clientID`      | **string** | Your app's client id                                            |
| `clientSecret`  | **string** | Your app's secret                                               |
| `callbackURL`   | **string** | The full URL to your authentication completion handler          |

#### Strategy `verify` callback

A `verify` callback function is called after resource owner (the user) has
accepted or declined the authorization request. 

It can have one of four signatures:

```javascript
function(accessToken, refreshToken, profile, done) {}
function(accessToken, refreshToken, params, profile, done) {}
function(req, accessToken, refreshToken, params, profile, done) {}
```

| Parameter      | Type     | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `req`          | object   |                                              |
| `accessToken`  | string   | OAuth2 access token                          |
| `refreshToken` | string   | OAuth2 refresh token                         |
| `params`       | object   |                                              |
| `profile`      | object   | User profile                                 |
| `done`         | function | "Done" callback                              |

The `verify` function can use the `profile` and `params` fields to find, create
or update any kind of information that corresponds to now authenticated user.

After the user has been successfully authenticated, the `done` function should
be called, to supply Passport with the `user` data as seen by the application.

```javascript
return done(null, user);
```

In case of authentication error, `false` should be supplied instead.

```javascript
return done(null, false);
```

Additional `info` object can be provided to indicate the reason for failure.

```javascript
return done(null, false, { message: "User account is suspended" });
```

For transient errors, pass the error object as the first parameter.

```javascript
return done(new Error("User database is not available, try later"));
```

```javascript
const MailruStrategy = require("passport-mailapp").Strategy;

passport.use(
    new MailruStrategy(
        {
            clientID: MAILRU_APP_ID,
            clientSecret: MAILRU_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/mailru/callback",
        },
        function verify(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            // Now that we have user's `profile` as seen by Mail.ru, we can
            // use it to find corresponding database records on our side.
            // Here, we have a hypothetical `User` class which does what it says.
            User.findOrCreate({ mailId: profile.id })
                .then(function (user) {
                    done(null, user);
                })
                .catch(done);
        }
    )
);
```


#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'mailapp'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
//This function will pass callback, scope and request new token
app.get("/auth/mailru", passport.authenticate("mailapp"));

app.get(
    "/auth/mailru/callback",
    passport.authenticate("mailapp", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);
```


## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Copyright (c) 2023 Ilya Maltsev

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

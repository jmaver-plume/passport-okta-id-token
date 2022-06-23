# passport-okta-id-token

## Install

```shell
npm install passport-okta-id-token
```

## Usage

Strategy uses [@okta/jwt-verifier](https://www.npmjs.com/package/@okta/jwt-verifier/v/latest) under the hood.

### Configure Strategy

The strategy requires verifier options and verify callback. Both arguments are required.

```javascript
const { Strategy } = require("passport-okta-id-token");

passport.use(
  new Strategy({ issuer: "https://{yourOktaDomain}/oauth2/default" }, function (
    jwt,
    sub,
    done
  ) {
    User.findOrCreate({ oktaId: sub }, function (err, user) {
      return done(err, user);
    });
  })
);
```

### Authenticate Requests

```javascript
app.post(
  "/auth/okta",
  passport.authenticate("okta-id-token", {
    expectedClientId: "0oa5h93ocjgurRFu05d7",
    expectedNonce:
      "8V7Okhr8WqMGsXPQJaGy1Nu4GT5W05BfIbYlagBd587tryHKW6wWvQQiYvKFoZfJ",
    getIdTokenFromRequest: (req) => req.body.id_token,
    session: false,
  }),
  function (req, res) {
    // do something with req.user
    res.sendStatus(req.user ? 200 : 401);
  }
);
```

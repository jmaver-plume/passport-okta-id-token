import { Strategy as PassportStrategy } from "passport-strategy";
import OktaJwtVerifier, { VerifierOptions } from "@okta/jwt-verifier";
import { Request } from "express";

type VerifyFunction = (
  jwt: OktaJwtVerifier.Jwt,
  sub: string,
  done: (err: Error, user: any, info: any) => void
) => void;

type AuthenticateOptions = {
  expectedClientId: string;
  expectedNonce: string;
  getIdTokenFromReq: (req: Request) => string;
};

export class Strategy extends PassportStrategy {
  private readonly name = "okta-id-token";
  private readonly verify: VerifyFunction;
  private readonly oktaJwtVerifier: OktaJwtVerifier;

  constructor(options: VerifierOptions, verify: VerifyFunction) {
    super();

    this.verify = verify;
    this.oktaJwtVerifier = new OktaJwtVerifier(options);
  }

  authenticate(req: Request, options: AuthenticateOptions) {
    const token = options.getIdTokenFromReq(req);
    if (!token) {
      return this.fail({ message: "No ID token provided." }, 401);
    }

    const { expectedClientId, expectedNonce } = options;
    this.oktaJwtVerifier
      .verifyIdToken(token, expectedClientId, expectedNonce)
      .then((jwt) => {
        this.verify(jwt, jwt.claims.sub, (err, user, info) => {
          if (err) {
            return this.error(err);
          }
          if (!user) {
            return this.fail(info);
          }
          return this.success(user, info);
        });
      })
      .catch((err) => {
        this.fail({ message: err.message }, 401);
      });
  }
}

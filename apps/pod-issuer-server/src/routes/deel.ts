import Chance from "chance";
import express, { Request, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import jwt from "jsonwebtoken";
import { POD, PODEntries } from "@pcd/pod";
import { getUserByEmail } from "../util/persistence";

const deel = express.Router();

deel.post("/login", (req: Request, res: Response) => {
  const inputs: { email: string; password: string } = req.body;
  if (!inputs.email || !inputs.password) {
    res.status(400).send("Missing query parameter");
    return;
  }

  // In practice, get user information from database by email,
  // Here for demo purposes, we'll allow any email with @zoo.com domain
  if (!inputs.email.endsWith("@zoo.com")) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // In practice, check if the encrypted password match
  // This is just for demo purposes
  if (!inputs.password.startsWith("zoo")) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // Signing JWT, valid for 1 hour
  const token = jwt.sign(
    { email: inputs.email },
    process.env.DEEL_EDDSA_PRIVATE_KEY!,
    { algorithm: "HS512", expiresIn: "1h" }
  );
  res.send(token);
});

deel.post(
  "/issue",
  expressjwt({
    secret: process.env.DEEL_EDDSA_PRIVATE_KEY!,
    algorithms: ["HS512"]
  }),
  (req: JWTRequest, res: Response) => {
    const email = req.auth?.email;
    if (!email) {
      res.status(401).send("Unauthorized");
    }

    const inputs: {
      semaphoreCommitment: string;
    } = req.body;

    if (!inputs.semaphoreCommitment) {
      res.status(400).send("Missing query parameter");
      return;
    }

    // TODO: look up email, if already exist, return

    const user = getUserByEmail(email);
    if (user === null) {
      res.status(404).send("User not found");
      return;
    }

    // radomly generate these fields
    // In paractice, we can look them up in the database
    const chance = new Chance();
    const startDate = chance.birthday({
      string: true,
      type: "child"
    }) as string;
    const annualSalary = chance.integer({ min: 20000, max: 1000000 });

    try {
      // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
      const pod = POD.sign(
        {
          firstName: { type: "string", value: user.firstName },
          lastName: { type: "string", value: user.lastName },
          currentEmployer: { type: "string", value: "ZooPark" },
          startDate: { type: "string", value: startDate },
          annualSalary: { type: "int", value: BigInt(annualSalary) },
          owner: {
            type: "cryptographic",
            value: BigInt(inputs.semaphoreCommitment)
          }
        } satisfies PODEntries,
        process.env.DEEL_EDDSA_PRIVATE_KEY!
      );
      const serializedPOD = pod.serialize();
      res.status(200).json({ pod: serializedPOD });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error issue ID POD");
    }
  }
);

export default deel;

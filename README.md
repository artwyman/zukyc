# Zukyc

This is an example app using POD & GPC.
For details about POD & GPC, see [this doc](https://zupass.org/pod).

## Example use case

This example app demonstrates an end to end use case for POD & GPC. The story goes, Gerry the giraffe would like to borrow some money, so he goes to [ZooLender](https://zukyc-gpc-verifier.vercel.app). ZooLender wants him to prove that he has a valid ID, and has annual income over $20,000 amount among other things. Gerry doesn't know ZooLender well. He doesn't feel comfortable to send him his ID and paystubs. So they decide to use [ZooKyc](https://zukyc-gpc-prover-client.vercel.app) (KYC stands for [Know Your Customer](https://en.wikipedia.org/wiki/Know_your_customer)).

ZooKyc manages the user's identity (e.g. [Semaphore identity](https://docs.semaphore.pse.dev/V3/guides/identities)), PODs, and generate proofs upon requests.

To use ZooKyc, Gerry first goes to [ZooGov](https://zukyc-issuer-client.vercel.app/gov) (a govenment website), and ZooGov issues him a govenment ID POD signed by ZooGov. Gerry then goes to [ZooDeel](https://zukyc-issuer-client.vercel.app/deel) (a payroll service provider website), and ZooDeel issues him a paystub POD signed by ZooDeel. All the PODs have a owner field with Gerry's Semaphore public identity.

ZooLender provides Gerry a proof request which specifics what he wants Gerry to prove about the govenment ID POD and the paystub POD.

Gerry then goes to ZooKyc with his ID POD, Paystub POD, and the proof request from ZooLender. ZooKyc creates a zero knowledge proof that Gerry has a valid ID, and has annual income over $20,000 amount without leaking other information. ZooKyc is a browser only app. In fact, Gerry can take the code from ZooKyc and run it himself.

Now with the proof generated by ZooKyc, Gerry goes back to ZooLender. ZooLender verifies the proof, and lends Gerry the money.

You can walk through Gerry's experience using the deployed app links below.

## Deployed app

- [ZooLender](https://zukyc-gpc-verifier.vercel.app): a lending website. To apply for a loan, the user can use ZooKyc to generate a proof with the proof request ZooLender provides. ZooLender will verify the proof, and decide whether to lend the user the money.
- [ZooKyc](https://zukyc-gpc-prover-client.vercel.app): manages the user's identity, PODs, and generate proofs upon requests.
- [ZooGov](https://zukyc-issuer-client.vercel.app/gov): a govenment website. It can issue govenment ID POD.
- [ZooDeel](https://zukyc-issuer-client.vercel.app/deel): a payroll service provider website. It can issue paystub POD.
- [ZooAdmin](https://zukyc-issuer-client.vercel.app/debug): for debugging purposes. It allows you to generate govenment ID POD and paystub POD with the information you provide.

## Example code

- How to issue PODs: [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/pod-issuer-server/src/routes/debug.ts#L92-L114)
- Proof request (what you want to prove, including proof configuration, and optionally membership lists, external nullifier and watermark): [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/gpc-verifier/app/hooks/useProofRequest.ts)
- How to create GPC proofs (based on the proof request): [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/gpc-prover-client/app/util/generateProof.ts)
- How to verify GPC proofs: [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/gpc-verifier/app/util/verifyProof.ts)

## What's inside?

This Turborepo includes the following apps (inside the `apps/` folder):

### POD issuers (ZooGov, ZooDeel, ZooAdmin)

#### `pod-issuer-client`

- http://localhost:3000, deployed at https://zukyc-issuer-client.vercel.app.
- This is the frontend of POD issuers (ZooGov, ZooDeel and ZooAdmin).
- It includes:
  - `app/gov`: ZooGov
  - `app/deel`: ZooDeel
  - `app/debug`: ZooAdmin
- In real world, those would be three independent websites.

#### `pod-issuer-server`

- http://localhost:8080, deployed at https://zukyc-issuer-server.vercel.app.
- This is the server for pod-issuer-client. It provides the server-side APIs to issues PODs to the user.
- It includes:
  - `routes/gov.ts`: server-side APIs for ZooGov
  - `routes/deel.ts`: server-side APIs for ZooDeel
  - `routes/debug.ts`: server-side APIs for ZooAdmin
- Similarly, in real world, those would be three independent server-side applications issuing PODs independently.
- A server is needed because in real world, the server would have a user database; and the server would hold a signing key for issuing PODs.

### ZooKyc

#### `gpc-prover-client`

- http://localhost:3002, deployed at https://zukyc-gpc-prover-client.vercel.app.
- This is a frontend app which manages Semaphore identity, PODs, and uses the GPC library to generate ZK proofs based on proof requests.

### ZooLender

#### `gpc-verifier`

- http://localhost:3001, deployed at https://zukyc-gpc-verifier.vercel.app.
- This is a frontend app which provides the proof request, and uses the GPC library to verify ZK proofs.
- In this demo, the server side code is not included, because the proof verification code would be similar. But in real world, the proof needs to be verified on the server side too.

## Local development

#### Environment Variables

In order to develop locally, you will need to set some environment variables. We have included an example environment variable file .env.example
In order to make the application use these environment variables, you will need to copy the contents of the example file into an adjacent file called .env.

### Running the project

In the root of this project, execute the following commands locally.

```
# installs dependencies for all apps and packages in this repository
yarn

# starts all the applications contained in the `/apps` folder of the repository
yarn dev
```

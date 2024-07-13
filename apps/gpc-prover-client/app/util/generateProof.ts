import { Dispatch } from "react";
import { POD } from "@pcd/pod";
import {
  GPCProofInputs,
  deserializeGPCProofConfig,
  gpcArtifactDownloadURL,
  gpcProve,
  serializeGPCBoundConfig,
  serializeGPCRevealedClaims
} from "@pcd/gpc";
import { Identity } from "@semaphore-protocol/identity";

export type ProofResult = {
  config: string;
  proof: string;
  claims: string;
};

export const generateProof = async (
  identity: Identity,
  serializedIDPOD: string,
  serializedPaystubPOD: string,
  serializedConfig: string,
  setProofResult: Dispatch<ProofResult>
) => {
  try {
    if (!identity) {
      throw new Error("Identity field cannot be empty!");
    }

    if (!serializedIDPOD) {
      throw new Error("ID POD field cannot be empty!");
    }

    if (!serializedPaystubPOD) {
      throw new Error("Paystub POD field cannot be empty!");
    }

    if (!serializedConfig) {
      throw new Error("Proof configuration field cannot be empty!");
    }

    const idPOD = POD.deserialize(serializedIDPOD);
    const paytsubPOD = POD.deserialize(serializedPaystubPOD);

    const config = JSON.parse(serializedConfig);
    // https://docs.pcd.team/functions/_pcd_gpc.deserializeGPCProofConfig.html
    const proofConfig = deserializeGPCProofConfig(config.proofConfig);
    const membershipLists = config.membershipLists;

    // https://docs.pcd.team/types/_pcd_gpc.GPCProofInputs.html
    // To generate a proof we need to pair the config with a set of inputs, including
    // the PODs to prove about. Inputs can also enable extra security features of the proof.
    const proofInputs: GPCProofInputs = {
      pods: {
        // The name "govID" here matches this POD with the config.
        govID: idPOD,
        // The name "paystub" here matches this POD with the config.
        paystub: paytsubPOD
      },
      owner: {
        // The user's private identity info. It's never revealed in the
        // proof, but used to prove the correctness of the `owner` entry as
        // specified in the config.
        // Note: we have to use semaphoreV3, e.g. "@semaphore-protocol/identity": "^3.15.2",
        // the most recent version V4 changed the semphoreIdentity definition.
        semaphoreV3: identity,
        // We can optionally ask to generate a nullifier, which is tied to the user's
        // identity and to the external nullifier value here. This can be used
        // to identify duplicate proofs without de-anonymizing.
        // Here, We don't want the same user to get more than one loan.
        externalNullifier: { type: "string", value: "ZooLender loan" }
      },
      membershipLists,
      // Watermark gets carried in the proof and can be used to ensure the same
      // proof isn't reused outside of its intended context.  A timestamp is
      // one possible way to do that.
      watermark: { type: "int", value: BigInt(Date.now()) }
    };

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const { proof, boundConfig, revealedClaims } = await gpcProve(
      proofConfig,
      proofInputs,
      artifactsURL
    );

    const serializedProof = {
      config: serializeGPCBoundConfig(boundConfig),
      proof: JSON.stringify(proof),
      claims: serializeGPCRevealedClaims(revealedClaims)
    };
    setProofResult(serializedProof);
  } catch (e) {
    alert("Error generate proof");
    console.log(e);
  }
};

export default generateProof;

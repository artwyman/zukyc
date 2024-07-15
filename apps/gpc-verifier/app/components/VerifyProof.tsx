import { useCallback, useState } from "react";
import { useProofRequest } from "@/hooks/useProofRequest";
import verifyProof from "@/util/verifyProof";

const VerifyProof = () => {
  const [proofStr, setProofStr] = useState("");
  const [verified, setVerified] = useState(false);

  const { boundConfig, membershipLists, externalNullifier, watermark } =
    useProofRequest();

  const verify = useCallback(() => {
    verifyProof(
      boundConfig,
      membershipLists,
      externalNullifier,
      watermark,
      proofStr,
      setVerified
    );
  }, [boundConfig, membershipLists, externalNullifier, watermark, proofStr]);

  return (
    <>
      <div className="flex flex-col">
        <span>Proof</span>
        <textarea
          rows={16}
          value={proofStr}
          placeholder="Past your proof here!"
          onChange={(e) => setProofStr(e.target.value.trim())}
        />
      </div>

      <button onClick={verify}>Verify Proof</button>
      {verified && (
        <div className="text-lg font-bold">
          🎉 Congrats! Your loan has been approved! 🐸
        </div>
      )}
    </>
  );
};

export default VerifyProof;

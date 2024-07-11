import { useCallback, useState } from "react";
import verifyProof from "@/util/verifyProof";

const VerifyProof = () => {
  const [proofStr, setProofStr] = useState("");
  const [verified, setVerified] = useState(false);

  const verify = useCallback(() => {
    verifyProof(proofStr, setVerified);
  }, [proofStr, setVerified]);

  return (
    <>
      <div className="flex flex-col">
        <span>Proof</span>
        <textarea
          rows={20}
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

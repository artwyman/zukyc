import { useMutation } from "@tanstack/react-query";

const issueDebugPaystubPOD = async (args: IIssueDebugPaystubPODArgs) => {
  if (!process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL)
    throw new Error("NEXT_PUBLIC_POD_ISSUER_SERVER_URL not set");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL}/debug/paystub/issue`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...args })
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.pod;
};

export const useIssueDebugPaystubPOD = () => {
  return useMutation({
    mutationKey: ["issueDebugIDPOD"],
    mutationFn: async (args: IIssueDebugPaystubPODArgs) => {
      return issueDebugPaystubPOD(args);
    }
  });
};

export interface IIssueDebugPaystubPODArgs {
  firstName: string;
  lastName: string;
  currentEmployer: string;
  startDate: number;
  annualSalary: number;
  socialSecurityNumber: string;
  semaphorePublicKey: string;
}

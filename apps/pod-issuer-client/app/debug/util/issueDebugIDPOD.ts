import { Dispatch } from "react";

export async function issueDebugIDPOD(
  args: IIssueDebugIDPODArgs,
  setResponse: Dispatch<IIssueDebugIDPODResponse>
) {
  try {
    if (!process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL)
      throw new Error("NEXT_PUBLIC_POD_ISSUER_SERVER_URL not set");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL}/debug/id/issue`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...args })
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    setResponse({
      success: true,
      serializedPOD: data.pod
    });
  } catch (e) {
    setResponse({
      success: false,
      error: (e as Error).message
    });
  }
}

export interface IIssueDebugIDPODArgs {
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  semaphoreCommitment: string;
}

export type IIssueDebugIDPODResponse =
  | {
      success: true;
      error?: never;
      serializedPOD: string;
    }
  | { success: false; error: string; serializedPOD?: never };

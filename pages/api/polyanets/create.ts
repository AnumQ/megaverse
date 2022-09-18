// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL_LOCAL = "https://challenge.crossmint.io/api";
const POLYANET = "polyanets";
const CANDIDATE_ID = "ffdba451-a8a7-43eb-a3fd-0231efd01071";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(`${BASE_URL_LOCAL}/${POLYANET}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: req.body,
    });

    const json = await response.json();
    res.status(response.status).json(json);
  } catch (error) {
    res.status(400).json(error);
  }
}

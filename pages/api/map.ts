// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://challenge.crossmint.io/api";
const MAP = "map";
const CANDIDATE_ID = "ffdba451-a8a7-43eb-a3fd-0231efd01071";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(`${BASE_URL}/${MAP}/${CANDIDATE_ID}/goal`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    res.status(response.status).json(json);
  } catch (error) {
    res.status(400).json(error);
  }
}

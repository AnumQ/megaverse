// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL, POLYANET } from "../../constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(`${BASE_URL}/${POLYANET}`, {
      method: "DELETE",
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

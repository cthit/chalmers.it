import { NextRequest } from "next/server";
import { NextApiResponse } from "next";

export default function handler(_: NextRequest, res: NextApiResponse) {
  res.status(200).json({ status: "ok" });
}

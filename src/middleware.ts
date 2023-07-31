import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {}

export const config = {
  api: {
    bodyParser: false,
  },
};

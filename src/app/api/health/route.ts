import { NextResponse } from "next/server";

type HealthStatus = {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    app: boolean;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET(): NextResponse<HealthStatus> {
  const memoryUsage = process.memoryUsage();
  const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);

  const healthStatus: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: process.env.npm_package_version ?? "1.0.0",
    checks: {
      app: true,
      memory: {
        used: heapUsed,
        total: heapTotal,
        percentage: Math.round((heapUsed / heapTotal) * 100),
      },
    },
  };

  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

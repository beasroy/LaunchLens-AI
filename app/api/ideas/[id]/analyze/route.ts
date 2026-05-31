import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  streamAnalysis,
  toAnalysisRunResult,
} from "@/lib/analysis/run-analysis";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT_MINUTES = 3;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function encodeSse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: ideaId } = await context.params;
  const userId = session.user.id;

  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId },
  });

  if (!idea) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  const recentAnalysis = await prisma.analysis.findFirst({
    where: {
      ideaId,
      createdAt: {
        gte: new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentAnalysis) {
    return NextResponse.json(
      {
        error: `Please wait ${RATE_LIMIT_MINUTES} minutes before running another analysis.`,
      },
      { status: 429 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(encodeSse(event, data)));
      };

      try {
        for await (const chunk of streamAnalysis(idea)) {
          if (chunk.type === "status") {
            send("status", { phase: chunk.phase });
          } else if (chunk.type === "delta") {
            send("delta", { text: chunk.text });
          } else if (chunk.type === "sources") {
            send("sources", {
              queries: chunk.queries,
              titles: chunk.titles,
            });
          } else if (chunk.type === "complete") {
            const run = toAnalysisRunResult(chunk.result, chunk.sources);

            const analysis = await prisma.analysis.create({
              data: {
                ...run.prismaData,
                ideaId,
              },
            });

            revalidatePath("/ideas");
            revalidatePath(`/ideas/${ideaId}`);

            send("complete", {
              analysisId: analysis.id,
              sources: chunk.sources,
            });
          } else if (chunk.type === "error") {
            send("error", { message: chunk.message });
          }
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Analysis failed unexpectedly.";
        send("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

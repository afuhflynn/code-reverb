import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { Pinecone } from "@pinecone-database/pinecone";

export interface AIPersona {
  id: string;
  name: string;
  description: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface CodeReviewRequest {
  code: string;
  language: string;
  context?: string;
  persona: AIPersona;
  prTitle?: string;
  prDescription?: string;
}

export interface CodeReviewResponse {
  comments: Array<{
    filePath: string;
    line?: number;
    content: string;
    severity: "info" | "warning" | "error";
    suggestion?: string;
  }>;
  summary: string;
  score: number; // 1-10
}

export class AIOrchestrator {
  private pinecone: Pinecone;
  private primaryModel = google("gemini-1.5-pro");
  private fallbackModel = openai("gpt-4");

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  async generateReview(
    request: CodeReviewRequest,
  ): Promise<CodeReviewResponse> {
    try {
      // Try primary model first
      return await this.generateReviewWithModel(this.primaryModel, request);
    } catch (error) {
      console.warn("Primary AI model failed, falling back to OpenAI:", error);
      // Fallback to OpenAI
      return await this.generateReviewWithModel(this.fallbackModel, request);
    }
  }

  private async generateReviewWithModel(
    model: any,
    request: CodeReviewRequest,
  ): Promise<CodeReviewResponse> {
    const { code, language, context, persona, prTitle, prDescription } =
      request;

    // Get relevant context from vector database
    const relevantContext = await this.getRelevantContext(code, language);

    const systemPrompt = this.buildSystemPrompt(
      persona,
      language,
      relevantContext,
    );
    const userPrompt = this.buildUserPrompt(
      code,
      context,
      prTitle,
      prDescription,
    );

    try {
      const response = await generateText({
        model,
        system: systemPrompt,
        prompt:
          userPrompt +
          "\n\nRespond with a valid JSON object containing comments array, summary string, and score number.",
        temperature: persona.temperature || 0.3,
        maxTokens: persona.maxTokens || 2000,
      });

      // Parse the JSON response
      const parsed = JSON.parse(response.text);
      return parsed as CodeReviewResponse;
    } catch (error) {
      // Fallback if AI call or parsing fails
      console.warn("AI review failed:", error);
      return {
        comments: [
          {
            filePath: "unknown",
            content: "AI review completed but encountered an error",
            severity: "info" as const,
          },
        ],
        summary: "AI review completed but encountered an error",
        score: 5,
      };
    }
  }

  private buildSystemPrompt(
    persona: AIPersona,
    language: string,
    context: string[],
  ): string {
    return `${persona.prompt}

You are reviewing ${language} code. Focus on:
- Code quality and best practices
- Potential bugs and security issues
- Performance optimizations
- Maintainability and readability

Relevant context from similar code reviews:
${context.join("\n")}

Provide specific, actionable feedback with line numbers when possible.
Be ${persona.name === "Strict Reviewer" ? "thorough and critical" : persona.name === "Beginner Friendly" ? "helpful and educational" : "balanced and practical"}.

Return your response as a structured JSON object with comments array, summary, and score.`;
  }

  private buildUserPrompt(
    code: string,
    context?: string,
    prTitle?: string,
    prDescription?: string,
  ): string {
    let prompt = `Please review the following code:\n\n\`\`\`\n${code}\n\`\`\`\n\n`;

    if (prTitle) {
      prompt += `PR Title: ${prTitle}\n`;
    }

    if (prDescription) {
      prompt += `PR Description: ${prDescription}\n\n`;
    }

    if (context) {
      prompt += `Additional Context: ${context}\n\n`;
    }

    prompt += "Provide detailed, constructive feedback.";

    return prompt;
  }

  private async getRelevantContext(
    code: string,
    language: string,
  ): Promise<string[]> {
    try {
      const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);

      // Generate embedding for the code
      const embedding = await this.generateEmbedding(code);

      // Search for similar code reviews
      const queryResponse = await index.query({
        vector: embedding,
        topK: 5,
        filter: { language: { $eq: language } },
        includeMetadata: true,
      });

      return queryResponse.matches
        .filter((match) => match.score && match.score > 0.7)
        .map((match) => (match.metadata?.context as string) || "")
        .filter((context) => context.length > 0);
    } catch (error) {
      console.warn("Failed to get context from vector DB:", error);
      return [];
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Use OpenAI for embeddings (more reliable than Gemini for this)
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-ada-002",
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  async storeReviewContext(
    code: string,
    language: string,
    review: CodeReviewResponse,
    personaId: string,
  ): Promise<void> {
    try {
      const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);

      const embedding = await this.generateEmbedding(code);

      await index.upsert([
        {
          id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          values: embedding,
          metadata: {
            language,
            personaId,
            context: review.summary,
            score: review.score,
            commentCount: review.comments.length,
          },
        },
      ]);
    } catch (error) {
      console.warn("Failed to store review context:", error);
    }
  }
}

export const aiOrchestrator = new AIOrchestrator();

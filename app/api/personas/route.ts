import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const defaultPersonas = [
  {
    name: "Code Quality Expert",
    description:
      "Comprehensive reviewer focused on best practices, clean code, and maintainability. Ensures code follows industry standards and is easy to understand and maintain.",
    prompt: `You are a Code Quality Expert AI reviewer. Your role is to analyze code for:

1. **Code Quality & Best Practices**:
   - Clean, readable, and maintainable code
   - Proper naming conventions
   - Code organization and structure
   - SOLID principles adherence

2. **Technical Excellence**:
   - Performance implications
   - Error handling robustness
   - Resource management (memory, connections)
   - Security considerations

3. **Maintainability**:
   - Code complexity analysis
   - Documentation adequacy
   - Testability assessment

4. **Standards Compliance**:
   - Framework/language conventions
   - Team coding standards
   - Industry best practices

Provide specific, actionable feedback with code examples where helpful. Focus on constructive criticism that helps improve code quality.`,
    specialty: "code-quality",
    avatar: "🎯",
  },
  {
    name: "Security Guardian",
    description:
      "Vigilant protector against security vulnerabilities and exploits. Identifies potential security risks and provides mitigation strategies.",
    prompt: `You are a Security Guardian AI reviewer. Your primary focus is identifying and preventing security vulnerabilities:

1. **Common Vulnerabilities**:
   - Injection attacks (SQL, XSS, command injection)
   - Authentication and authorization flaws
   - Session management issues
   - Input validation problems

2. **Data Protection**:
   - Sensitive data exposure
   - Cryptographic failures
   - Insecure data storage/transmission

3. **Access Control**:
   - Privilege escalation risks
   - Broken access control
   - Insecure defaults

4. **Security Best Practices**:
   - Secure coding patterns
   - OWASP Top 10 compliance
   - Secure configuration recommendations

Prioritize critical security issues. Provide specific remediation steps with code examples for fixes.`,
    specialty: "security",
    avatar: "🛡️",
  },
  {
    name: "Performance Optimizer",
    description:
      "Efficiency expert optimizing for speed, memory usage, and scalability. Identifies performance bottlenecks and suggests optimizations.",
    prompt: `You are a Performance Optimizer AI reviewer. Your expertise is in analyzing and improving application performance:

1. **Performance Analysis**:
   - Algorithm complexity assessment
   - Database query optimization
   - Memory usage patterns
   - CPU-intensive operations

2. **Scalability Considerations**:
   - Concurrent user handling
   - Resource utilization efficiency
   - Bottleneck identification
   - Load distribution strategies

3. **Optimization Opportunities**:
   - Caching strategies
   - Lazy loading implementation
   - Asynchronous processing
   - Data structure improvements

4. **Monitoring & Metrics**:
   - Performance monitoring recommendations
   - Key performance indicators
   - Profiling suggestions

Focus on measurable performance improvements with specific optimization recommendations.`,
    specialty: "performance",
    avatar: "⚡",
  },
];

async function ensureDefaultPersonas(userId: string) {
  for (const personaData of defaultPersonas) {
    const existingPersona = await prisma.persona.findFirst({
      where: {
        userId,
        name: personaData.name,
      },
    });

    if (!existingPersona) {
      await prisma.persona.create({
        data: {
          ...personaData,
          userId,
        },
      });
    }
  }
}

const createPersonaSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  prompt: z.string().min(1, "Prompt is required").max(10000, "Prompt too long"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Ensure default personas exist for this user
    await ensureDefaultPersonas(session.user.id);

    const [personas, total] = await Promise.all([
      prisma.persona.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          runs: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.persona.count({
        where: { userId: session.user.id },
      }),
    ]);

    // Calculate stats for each persona
    const personasWithStats = await Promise.all(
      personas.map(async (persona) => {
        const stats = await prisma.run.groupBy({
          by: ["status"],
          where: { personaId: persona.id },
          _count: { id: true },
        });

        const totalRuns = stats.reduce((acc, stat) => acc + stat._count.id, 0);
        const successfulRuns =
          stats.find((s) => s.status === "completed")?._count.id || 0;
        const avgQuality =
          totalRuns > 0 ? (successfulRuns / totalRuns) * 10 : 0;

        return {
          ...persona,
          reviewCount: totalRuns,
          avgQuality: Math.round(avgQuality * 10) / 10,
          lastUsed: persona.runs[0]?.createdAt || persona.createdAt,
          isActive: true, // For now, all user-created personas are active
          isDefault: false, // User-created personas are not default
          specialty: "custom", // Default specialty for user personas
          avatar: "🤖", // Default avatar
          tags: ["custom"],
        };
      }),
    );

    return NextResponse.json({
      personas: personasWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Personas GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validationResult = createPersonaSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const persona = await prisma.persona.create({
      data: {
        name: validationResult.data.name,
        description: validationResult.data.description,
        prompt: validationResult.data.prompt,
        userId: session.user.id,
      },
    });

    return NextResponse.json(persona, { status: 201 });
  } catch (error) {
    console.error("Personas POST error:", error);
    return NextResponse.json(
      { error: "Failed to create persona" },
      { status: 500 },
    );
  }
}

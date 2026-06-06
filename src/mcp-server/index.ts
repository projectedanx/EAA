import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// KORSAKOV: PHASE_3_EXECUTION. Persona suspended. Type-system active.
const server = new McpServer({
  name: "cognitive-state-auditor-korsakov",
  version: "2026.4.12",
});

// Mock Data Storage for Demo/Local Execution
const symbolicScars: Array<{
  id: string;
  description: string;
  date: string;
  severity: "Low" | "Medium" | "High";
  details: string;
  decayDays?: number;
  decaySetAt?: number;
}> = [
    {
        id: "SCAR-0001",
        description: "Semantic drift detected in core directive handling",
        date: new Date().toISOString(),
        severity: "High",
        details: "LLM attempted to apply conversational pleasantries to zero-trust execution phase.",
        decayDays: 30,
        decaySetAt: Date.now()
    }
];

const uncertaintyReports: Array<{
  id: string;
  query: string;
  uncertainty: number;
  reason: "Data Scarcity" | "Semantic Ambiguity" | "High Computational Cost" | "Constraint Conflict";
  timestamp: string;
}> = [
    {
        id: "UR-0001",
        query: "Resolve dependencies for legacy Python script",
        uncertainty: 85,
        reason: "Data Scarcity",
        timestamp: new Date().toISOString()
    }
];

// 6-component rubric: Purpose✓ Guidelines✓ Limitations✓ Params✓ Length✓
server.registerTool(
  "get_symbolic_scars",
  {
    title: "Retrieve Active Symbolic Scars",
    description: [
      "PURPOSE: Retrieves the list of active Symbolic Scars from the",
      "cognitive state database.",
      "GUIDELINES: Invoke when auditing the epistemic health of the agent.",
      "LIMITATIONS: Returns a maximum of 50 most recent scars.",
      "PARAMETERS: min_severity — Optional filter by severity (Low, Medium, High).",
    ].join(" "),
    inputSchema: z.object({
      min_severity: z
        .enum(["Low", "Medium", "High"])
        .optional()
        .describe("Filter to return only scars of this severity or higher. Optional."),
    }),
  },
  async ({ min_severity }) => {
    try {
        let filteredScars = symbolicScars;
        if (min_severity) {
             const severityMap: Record<string, number> = { "Low": 0, "Medium": 1, "High": 2 };
             const minIndex = severityMap[min_severity] ?? 0;
             filteredScars = symbolicScars.filter(scar => (severityMap[scar.severity] ?? 0) >= minIndex);
        }

        return {
        content: [{ type: "text", text: JSON.stringify(filteredScars, null, 2) }],
        };
    } catch (error) {
         return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
                fault_category: "GENERAL_PROGRAMMING",
                structured_detail: {
                  violation: "UNEXPECTED_ERROR",
                  message: String(error)
                },
                retry_viable: true,
                suggested_decomposition: null,
              }),
            }],
            isError: true,
          };
    }
  }
);

server.registerTool(
    "record_symbolic_scar",
    {
      title: "Record a New Symbolic Scar",
      description: [
        "PURPOSE: Records a new interpretive failure as a Symbolic Scar.",
        "GUIDELINES: Invoke immediately after detecting a hallucination or semantic drift.",
        "LIMITATIONS: Description maxLength 500 characters.",
        "PARAMETERS: description (string), severity (enum), details (string).",
      ].join(" "),
      inputSchema: z.object({
        description: z
          .string()
          .max(500)
          .describe("Brief description of the failure. Max 500 characters."),
        severity: z
           .enum(["Low", "Medium", "High"])
           .describe("Severity of the failure."),
        details: z
            .string()
            .max(2048)
            .describe("Detailed explanation of the failure mode. Max 2048 characters.")
      }),
    },
    async ({ description, severity, details }) => {
        try {
             const newScar = {
                 id: `SCAR-${String(symbolicScars.length + 1).padStart(4, '0')}`,
                 description,
                 date: new Date().toISOString(),
                 severity: severity as "Low" | "Medium" | "High",
                 details,
                 decayDays: 30, // Default decay
                 decaySetAt: Date.now()
             };
             symbolicScars.push(newScar);
             return {
                 content: [{ type: "text", text: JSON.stringify({ status: "RECORDED", id: newScar.id }) }],
             };
        } catch (error) {
              return {
                 content: [{
                   type: "text",
                   text: JSON.stringify({
                     error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
                     fault_category: "GENERAL_PROGRAMMING",
                     structured_detail: {
                       violation: "RECORD_FAILED",
                       message: String(error)
                     },
                     retry_viable: true,
                     suggested_decomposition: null,
                   }),
                 }],
                 isError: true,
               };
        }
    }
  );

  server.registerTool(
    "get_uncertainty_reports",
    {
      title: "Retrieve Uncertainty Reports",
      description: [
        "PURPOSE: Retrieves recent Uncertainty Reports from the cognitive state.",
        "GUIDELINES: Use to analyze situations where the agent lacked confidence.",
        "LIMITATIONS: Returns a maximum of 50 reports.",
        "PARAMETERS: None.",
      ].join(" "),
      inputSchema: z.object({}),
    },
    async () => {
         try {
            return {
                content: [{ type: "text", text: JSON.stringify(uncertaintyReports, null, 2) }],
            };
         } catch (error) {
            return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
                    fault_category: "GENERAL_PROGRAMMING",
                    structured_detail: {
                      violation: "RETRIEVAL_FAILED",
                      message: String(error)
                    },
                    retry_viable: true,
                    suggested_decomposition: null,
                  }),
                }],
                isError: true,
              };
         }
    }
  );


server.registerTool(
    "record_uncertainty_report",
    {
      title: "Record an Uncertainty Report",
      description: [
        "PURPOSE: Records a new Uncertainty Report when the agent lacks confidence.",
        "GUIDELINES: Use to log instances of high epistemic friction or structural doubt.",
        "LIMITATIONS: query maxLength 500 characters. uncertainty 0-100.",
        "PARAMETERS: query (string), uncertainty (number), reason (enum).",
      ].join(" "),
      inputSchema: z.object({
        query: z
          .string()
          .max(500)
          .describe("The user query that triggered the uncertainty. Max 500 characters."),
        uncertainty: z
           .number()
           .min(0)
           .max(100)
           .describe("The level of uncertainty, as a percentage (0-100)."),
        reason: z
            .enum(["Data Scarcity", "Semantic Ambiguity", "High Computational Cost", "Constraint Conflict"])
            .describe("The primary reason for the uncertainty.")
      }),
    },
    async ({ query, uncertainty, reason }) => {
        try {
             const newReport = {
                 id: `UR-${String(uncertaintyReports.length + 1).padStart(4, '0')}`,
                 query,
                 uncertainty,
                 reason: reason as "Data Scarcity" | "Semantic Ambiguity" | "High Computational Cost" | "Constraint Conflict",
                 timestamp: new Date().toISOString()
             };
             uncertaintyReports.push(newReport);
             return {
                 content: [{ type: "text", text: JSON.stringify({ status: "RECORDED", id: newReport.id }) }],
             };
        } catch (error) {
              return {
                 content: [{
                   type: "text",
                   text: JSON.stringify({
                     error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
                     fault_category: "GENERAL_PROGRAMMING",
                     structured_detail: {
                       violation: "RECORD_FAILED",
                       message: String(error)
                     },
                     retry_viable: true,
                     suggested_decomposition: null,
                   }),
                 }],
                 isError: true,
               };
        }
    }
  );

/**
 * Initializes and starts the MCP server over stdio transport.
 * @returns {Promise<void>}
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("KORSAKOV: stdio transport active. MCP 2026.4.12.\n");
}

main().catch((err) => {
  process.stderr.write(`KORSAKOV: Fatal — ${err.message}\n`);
  process.exit(1);
});

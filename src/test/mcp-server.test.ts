import { test, expect, vi, describe, beforeEach } from 'vitest';

const mockRegisterTool = vi.fn();
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => {
    return {
        McpServer: class {
            registerTool = mockRegisterTool;
            connect = vi.fn();
        }
    };
});

// Avoid the script hanging by mocking StdioServerTransport
vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => {
    return {
        StdioServerTransport: class {
        }
    };
});

describe('MCP Server', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });

    describe('record_uncertainty_report tool', () => {
        test('should record an uncertainty report successfully', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'record_uncertainty_report');
             expect(call).toBeDefined();

             const handler = call[2];

             // Test happy path
             const result = await handler({
                query: "test query",
                uncertainty: 50,
                reason: "Data Scarcity"
             });

             expect(result.content[0].text).toContain("RECORDED");
        });

        test('should handle errors in record_uncertainty_report correctly', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'record_uncertainty_report');
             expect(call).toBeDefined();

             const handler = call[2];

             // Mock an error by spying on Date.prototype.toISOString
             const spy = vi.spyOn(Date.prototype, 'toISOString').mockImplementation(() => {
                throw new Error("Simulated Error");
             });

             const result = await handler({
                query: "test error query",
                uncertainty: 90,
                reason: "Semantic Ambiguity"
             });

             expect(result.isError).toBe(true);
             expect(result.content[0].text).toContain("Simulated Error");
             expect(result.content[0].text).toContain("RECORD_FAILED");

             spy.mockRestore();
        });
    });
});

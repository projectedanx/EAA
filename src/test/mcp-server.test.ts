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

    describe('record_symbolic_scar tool', () => {
        test('should record a symbolic scar successfully', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'record_symbolic_scar');
             expect(call).toBeDefined();

             const handler = call[2];

             // Test happy path
             const result = await handler({
                description: "test failure",
                severity: "High",
                details: "test details"
             });

             expect(result.content[0].text).toContain("RECORDED");
        });

        test('should handle errors in record_symbolic_scar correctly', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'record_symbolic_scar');
             expect(call).toBeDefined();

             const handler = call[2];

             // Mock an error by spying on Date.prototype.toISOString
             const spy = vi.spyOn(Date.prototype, 'toISOString').mockImplementation(() => {
                throw new Error("Simulated Error");
             });

             const result = await handler({
                description: "test error failure",
                severity: "Medium",
                details: "test error details"
             });

             expect(result.isError).toBe(true);
             expect(result.content[0].text).toContain("Simulated Error");
             expect(result.content[0].text).toContain("RECORD_FAILED");

             spy.mockRestore();
        });
    });

    describe('get_symbolic_scars tool', () => {
        test('should return symbolic scars successfully', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'get_symbolic_scars');
             expect(call).toBeDefined();

             const handler = call[2];

             // Test happy path with min_severity
             const result = await handler({
                min_severity: "High"
             });

             expect(result.isError).toBeFalsy();
             expect(result.content[0].text).toContain("High");

             // Test without min_severity
             const resultAll = await handler({});
             expect(resultAll.isError).toBeFalsy();
             expect(resultAll.content[0].text).toContain("SCAR-0001");
        });

        test('should handle errors in get_symbolic_scars correctly', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'get_symbolic_scars');
             expect(call).toBeDefined();

             const handler = call[2];

             // Mock an error by spying on Array.prototype.filter
             const spy = vi.spyOn(Array.prototype, 'filter').mockImplementation(() => {
                throw new Error("Simulated Filter Error");
             });

             const result = await handler({
                min_severity: "High"
             });

             expect(result.isError).toBe(true);
             expect(result.content[0].text).toContain("Simulated Filter Error");
             expect(result.content[0].text).toContain("TOOL_FAULT_GENERAL_PROGRAMMING");

             spy.mockRestore();
        });
    });

    describe('get_uncertainty_reports tool', () => {
        test('should return uncertainty reports successfully', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'get_uncertainty_reports');
             expect(call).toBeDefined();

             const handler = call[2];

             // Test happy path
             const result = await handler({});

             expect(result.isError).toBeFalsy();
             // Just verifying it returns a string output
             expect(typeof result.content[0].text).toBe('string');
        });

        test('should handle errors in get_uncertainty_reports correctly', async () => {
             await import('../mcp-server/index.js');

             const call = mockRegisterTool.mock.calls.find(call => call[0] === 'get_uncertainty_reports');
             expect(call).toBeDefined();

             const handler = call[2];


             // Mock an error by spying on JSON.stringify
             const spy = vi.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
                throw new Error("Simulated Stringify Error");
             });


             const result = await handler({});

             expect(result.isError).toBe(true);
             expect(result.content[0].text).toContain("Simulated Stringify Error");
             expect(result.content[0].text).toContain("RETRIEVAL_FAILED");
             expect(result.content[0].text).toContain("TOOL_FAULT_GENERAL_PROGRAMMING");

             spy.mockRestore();
        });
    });
});

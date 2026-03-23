# Features Specification

1. Chat UI
   - Homepage must show a chat UI that sends user messages to `/api/chat`.
   - Messages display sender and text; new messages appended bottom.

2. API forwarding
   - `/api/chat` should attempt to forward to the MCP tool at `http://localhost:4000/mcp`.
   - If MCP is unreachable, API will fallback to a safe echo response.

3. MCP tool
   - Local HTTP endpoint `/mcp` accepting JSON `{message:string}` and replying `{reply:string}`.
   - Implementation should be replaceable with a real model runtime.

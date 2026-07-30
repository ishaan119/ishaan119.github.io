---
layout: post
title: "A2A Demystified"
subtitle: "The Agent-to-Agent communication protocol"
series: "Protocols"
date: 2025-11-26
source_repo: https://github.com/ishaan119/A2ADemystified
description: >-
  Everyone is building agents, and they're all siloed geniuses that can't
  see each other. Connecting 5 to 5 means 25 hand-written integrations. What
  A2A does about the NxM problem.
---

Everyone is building AI agents right now—support agents, HR agents, IT troubleshooting agents, and even one that just manages your calendar. But currently, these are **"siloed geniuses."** They live in different frameworks, speak different languages, and are completely blind to each other's existence.

---

## 🛑 The "Glue Code" Nightmare

Before A2A, if you wanted your "Travel Agent" to talk to your "Calendar Agent," you had to write custom glue code. You effectively had to hard-code an integration for every single pair of agents you wanted to connect.

This is the **NxM Problem**: Connecting 5 agents to 5 other agents requires **25 different manual integrations.**

---

## ✨ The A2A Promise

To understand the solution, look at what happened with tools:

> ### 🧩 What MCP did for Tools
> 
> The **Model Context Protocol (MCP)** standardized how LLMs connect to databases and APIs. It solved the problem of **Vertical Tool Access**. Instead of building a custom connector for every database, developers build one MCP server, and *any* LLM can use it.

> ### 🤝 What A2A does for Agents
> 
> **What MCP solved for vertical access, A2A is solving for Horizontal Collaboration.**

A2A creates a universal standard that allows *any* agent to discover, query, and task *any* other agent, regardless of whether it was built in LangChain, AutoGen, Strands, or raw Python.

### "Wait, another standard?"

Yes, we know the joke. Introducing a new protocol always risks just adding to the pile. But A2A is designed to replace custom glue code, not competing protocols. It transforms a fragmented mess of custom integrations into a unified, interoperable workforce.

<p align="center">
  <img width="2816" height="1536" alt="A2A Architecture Diagram" src="https://github.com/user-attachments/assets/1590e70e-7616-4886-8e3d-70ce365d2b00" />
</p>

---

## 🧠 What A2A Actually Is

**Think of A2A as a standardized "hiring contract" between AI agents.**

In an A2A system, you have two primary entities:

1. **Coordinator Agent (The Client)** — The "Project Manager." Its LLM uses the capabilities of other agents as if they were its own tools.
2. **Specialist Agent (The Server)** — The "Contractor." An agent exposing its specialized skills via an A2A Server endpoint.

### 💡 The Conceptual Shift: Remote Agency, Local Interface

Is "Agent as a Tool" really a new insight? The novelty isn't that agents *use* tools. The novelty is **Abstraction**.

In A2A, the Coordinator doesn't need to know *how* the Specialist works, or even that it *is* an agent. It just sees a function signature. The A2A protocol flattens a complex, autonomous remote entity into a deterministic, local function call.

---

## 🧱 The Three Core Primitives

A2A defines three essential primitives—foundational building blocks—that make this abstraction possible.

### 1️⃣ The Agent Card (The Discovery Primitive)

*Hosted by the Specialist Agent at `GET /agent-card.json`*

How does the Coordinator know the Specialist exists? The Agent Card. It tells the world: *"I am a Calculator, and here are the specific functions (Skills) I can perform."*

```json
{
  "name": "Super-Calculator-v1",
  "skills": [
    {
      "id": "multiply_numbers",
      "description": "Multiplies 'a' and 'b'.",
      "input_schema": {
        "type": "object",
        "properties": { 
          "a": {"type": "number"}, 
          "b": {"type": "number"} 
        },
        "required": ["a", "b"]
      }
    }
  ]
}
```

### 2️⃣ The Task Message (The Execution Primitive)

*Sent from Coordinator to Specialist via `POST /a2a/task`*

When the Coordinator decides to use a skill, it doesn't send vague text; it sends a structured command. This is the **Wire Protocol**—usually **JSON-RPC 2.0**.

**The Request (Coordinator → Specialist):**

```json
{
  "jsonrpc": "2.0",
  "method": "multiply_numbers", 
  "params": { 
    "a": 10, 
    "b": 5 
  },
  "id": "req-12345",
  "meta": { 
    "thid": "thread-abc-987" 
  }
}
```

### 3️⃣ The Bridge (The Translator Primitive)

*Running inside the Coordinator Agent's application*

This is the part that feels like magic. **The Bridge (or Client Tool Provider) is the invisible translation layer.**

It performs a two-step trick:

1. **Ingestion** — It downloads the *Agent Card* and dynamically generates a Python function (a "stub") inside the Coordinator's memory.
2. **Translation** — When the Coordinator's LLM calls that Python function, the Bridge *intercepts* the call, pauses the code, converts the arguments into a *Task Message* (JSON), sends it over the internet, and waits for the answer.

---

## 💻 Get Your Hands Dirty: A Simple Example

Here is how you actually build this using the `strands` library. Notice we don't write any JSON or HTTP code manually—the **A2A Server** and **A2A Client** handle all the primitives for us.

### Part 1: The Specialist (Server)

**`calculator_server.py`**

```python
from strands import Agent, tool
from strands.multiagent.a2a import A2AServer

# 1. Define the skill (Business Logic)
@tool
def add(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b

# 2. Create the Agent and equip the tool
calculator_agent = Agent(
    name="Calculator Agent",
    tools=[add],
    callback_handler=None
)

# 3. Wrap it in an A2A Server
# This automatically generates the 'Agent Card' and starts the HTTP listener
calculator_server = A2AServer(
    agent=calculator_agent,
    host="127.0.0.1",
    port=9001
)

if __name__ == "__main__":
    print("Starting Calculator A2A Server on port 9001...")
    calculator_server.serve()
```

### Part 2: The Coordinator (Client)

**`orchestrator.py`**

```python
from strands import Agent
from strands_tools.a2a_client import A2AClientToolProvider

# 1. Setup the Bridge
# This connects to port 9001, downloads the card, and converts 'add' into a local tool
provider = A2AClientToolProvider(
    known_agent_urls=["http://127.0.0.1:9001"]
)

# 2. Give the tools to the Coordinator
# The Coordinator's LLM now "thinks" it knows how to add numbers locally
orchestrator_agent = Agent(
    name="Orchestrator Agent",
    tools=provider.tools, 
    callback_handler=None
)

if __name__ == "__main__":
    # 3. Run the Prompt
    # The agent will reason: "I need to add. I have an 'add' tool. I will call it."
    # The Bridge handles the network call transparently.
    result = orchestrator_agent("Add 5 and 3 using the calculator agent")
    
    print(f"Result: {result.message}") 
    # Output: Result: 8.0
```

---

## 🏗️ The Architecture Stack

A2A systems are layered to ensure you can swap out parts without breaking the whole system. This stack ensures that your **Business Logic** never has to worry about **Network Packets**.

| Layer | Component | Responsibility |
|:------|:----------|:---------------|
| **Top** | **Business Logic** | **The Skill:** Your actual Python code (e.g., the `add` function). You live here. |
| ⬇️ | **A2A Layer** | **The Translation:** Maps your Python code to an Agent Card and handles the conversion of objects to JSON. |
| ⬇️ | **Protocol Layer** | **The Structure:** The agreed-upon message format (e.g., **JSON-RPC 2.0**) so both sides understand the data structure. |
| **Bottom** | **Transport Layer** | **The Wire:** How the data moves (e.g., **HTTP/REST**). This can be swapped for WebSockets later for streaming. |

### 🚀 Why This Matters

By decoupling the "Coordinator" from the "Specialist" using the Stack and Bridge abstraction, A2A allows you to build **modular AI**.

> **Key Benefit:** You can swap out your "Simple Calculator Agent" for a "Quantum Computer Agent" v2.0 without changing a single line of code in your Coordinator—the Bridge simply reads the new Agent Card and adapts automatically.

---

## 📝 Summary

A2A transforms the chaotic world of agent-to-agent communication into a clean, standardized protocol. By providing three core primitives—**Agent Cards**, **Task Messages**, and **Bridges**—it enables true agent interoperability across frameworks and implementations.

**The result?** A composable, scalable AI ecosystem where agents can discover and collaborate with each other as easily as calling a local function.

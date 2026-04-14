let currentProject = null;
let currentChat = null;

function createNewProject() {
  const name = prompt("Project Name:");
  if (!name) return;

  createProject(name);
}

// Render message
function renderMessage(text, role) {
  const div = document.createElement("div");
  div.className = "message " + (role === "user" ? "user" : "ai");
  div.innerText = text;

  document.getElementById("chatArea").appendChild(div);

  document.getElementById("chatArea").scrollTop = 999999;
}

// Send message
async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  renderMessage(text, "user");

  saveMessage(currentProject, currentChat, "user", text);

  // Typing animation
  const typing = document.createElement("div");
  typing.className = "message ai";
  typing.innerText = "AI is thinking...";
  document.getElementById("chatArea").appendChild(typing);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "qwen/qwen3-30b-a3b:free",
      messages: [{ role: "user", content: text }]
    })
  });

  const data = await res.json();

  typing.remove();

  const reply = data.choices[0].message.content;

  renderMessage(reply, "ai");

  saveMessage(currentProject, currentChat, "assistant", reply);
}

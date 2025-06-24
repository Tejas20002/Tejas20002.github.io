var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer"); 
var textarea = document.getElementById("texter"); 
var terminal = document.getElementById("terminal");

var git = 0;
var pw = false;
let pwd = false;
let commands;
try {
  commands = JSON.parse(localStorage.getItem("commandHistory")) || [];
} catch (e) {
  commands = [];
}

setTimeout(function() {
  loopLines(banner, "", 80);
  textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

console.log(
  "%cYou hacked my password!😠",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (pw) {
    let et = "*";
    let w = textarea.value.length;
    command.innerHTML = et.repeat(w);
    if (textarea.value === password) {
      pwd = true;
    }
    if (pwd && e.keyCode == 13) {
      loopLines(secret, "color2 margin", 120);
      command.innerHTML = "";
      textarea.value = "";
      pwd = false;
      pw = false;
      liner.classList.remove("password");
    } else if (e.keyCode == 13) {
      addLine("Wrong password", "error", 0);
      command.innerHTML = "";
      textarea.value = "";
      pw = false;
      liner.classList.remove("password");
    }
  } else {
    if (e.keyCode == 13) {
      commands.push(command.innerHTML);
      localStorage.setItem("commandHistory", JSON.stringify(commands));
      git = commands.length;
      addLine('<span style="color: #e6800b">popeye@TJHirani.com:~$ </span>' + command.innerHTML, "no-animation", 0);
      commander(command.innerHTML.toLowerCase());
      command.innerHTML = "";
      textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
      git -= 1;
      textarea.value = commands[git];
      command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
      git += 1;
      if (commands[git] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = commands[git];
      }
      command.innerHTML = textarea.value;
    }
  }
}

async function commander(cmd) {
  const lowerCmd = cmd.toLowerCase();

  if (lowerCmd === "") return;

  if (COMMANDS[lowerCmd]) {
    const result = COMMANDS[lowerCmd]();

    if (result instanceof Promise) {
      try {
        const output = await result;
        if (output) addLine(output, "color2", 80);
      } catch (err) {
        addLine("Error executing command.", "error", 80);
      }
    } else {
      if (result) addLine(result, "color2", 80);
    }
  } else {
    addLine(`<span class="inherit">Command not found. For a list of commands, type <span class="command">'help'</span>.</span>`, "error", 100);
  }
}

function newTab(link) {
  setTimeout(function() {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function() {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function(item, index) {
    addLine(item, style, index * time);
  });
}

function setTheme(theme) {
  document.body.className = `${theme}-theme`;
}

function sshConnect(username, host, password) {
  const socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: "connect",
      username,
      host,
      password
    }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "output") {
      addLine(data.data, "color2", 10);
    }
  };

  socket.onerror = (e) => {
    addLine("SSH connection error.", "error", 0);
  };

  // Optional: Bind enter to stream SSH input to server
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && socket.readyState === 1) {
      socket.send(JSON.stringify({ type: "input", data: textarea.value + "\n" }));
      textarea.value = '';
    }
  });
}
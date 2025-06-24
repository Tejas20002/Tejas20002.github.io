/* commands.js */
const help = [
  "<br>",
  '<span class="command">help</span>          Show available commands',
  '<span class="command">about</span>         About Tejas',
  '<span class="command">skills</span>        Show skills',
  '<span class="command">projects</span>      View coding projects',
  '<span class="command">social</span>        Social networks',
  '<span class="command">contact</span>       Contact via email',
  '<span class="command">time</span>          Show current time',
  '<span class="command">joke</span>          Get a programming joke',
  '<span class="command">quote</span>         Show an inspirational quote',
  '<span class="command">matrix</span>        Matrix-style animation',
  '<span class="command">clear</span>         Clear the terminal',
  '<span class="command">history</span>       View command history',
  "<br>"
];

const COMMANDS = {
  help: () => help.join("<br>"),

  about: () => `Hi! I'm Tejas Hirani 👋<br>
Laravel Developer passionate about building efficient, secure applications.`,

  skills: () => `PHP, Laravel, CodeIgniter, JavaScript, MySQL, MariaDB, Docker, Git, Linux, Python, Jenkins, Postman`,

  projects: () => `Most projects are private, but check GitHub:<br>
<a href="https://github.com/tejas20002" target="_blank">https://github.com/tejas20002</a>`,

  social: () => `📱 Connect with me online:<br>
🔗 <a href="https://linkedin.com/in/tjhirani" target="_blank">LinkedIn</a><br>
💻 <a href="https://github.com/tejas20002" target="_blank">GitHub</a><br>
🐦 <a href="https://twitter.com/tjhirani" target="_blank">Twitter</a>` ,

  contact: () => `Email: tejashirani55@gmail.com`,

  clear: () => {
    document.getElementById("output").innerHTML = "";
    return "";
  },

  time: () => {
    return new Date().toString();
  },

  joke: async () => {
    const res = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single');
    const data = await res.json();
    return data.joke || 'No joke today!';
  },

  quote: async () => {
    const res = await fetch('https://api.quotable.io/random');
    const data = await res.json();
    return `${data.content} — ${data.author}`;
  },

  matrix: () => {
    const output = document.getElementById("output");
    const rain = Array(60).fill("💻").join(" ");
    output.innerHTML += `<div class="output-line" style="color:#0f0;">${rain}</div>`;
    return 'Welcome to the Matrix...';
  },

  skill: () => `🛠️ My Skills:<br>
- PHP / Laravel / CodeIgniter<br>
- JavaScript / Node.js<br>
- MySQL / MariaDB<br>
- Docker / Jenkins / Git / GitHub<br>
- Linux / Ubuntu / Terminal<br>
- APIs / Webhooks / Postman<br>
- DevOps Fundamentals / Nginx`,

};
banner = [
  '<span class="index">TJHirani (TJ) Not A Corporation. All TJ reserved.</span>',
  '██████╗  ██████╗ ██████╗ ███████╗██╗   ██╗███████╗',
  '██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝',
  '██████╔╝██║   ██║██████╔╝█████╗   ╚████╔╝ █████╗  ',
  '██╔═══╝ ██║   ██║██╔═══╝ ██╔══╝    ╚██╔╝  ██╔══╝  ',
  '██║     ╚██████╔╝██║     ███████╗   ██║   ███████╗',
  '╚═╝      ╚═════╝ ╚═╝     ╚══════╝   ╚═╝   ╚══════╝',
  '<span class="color2">Welcome to my interactive web terminal.</span>',
  "<span class=\"color2\">For a list of available commands, type</span> <span class=\"command\">'help'</span><span class=\"color2\">.</span>",
];

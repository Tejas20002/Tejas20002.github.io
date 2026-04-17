<script lang="ts">
  const profile = {
    name: "Tejas Hirani",
    role: "DevOps Engineer",
    email: "tejashirani55@gmail.com",
    github: "tejas20002",
    linkedin: "tjhirani",
    location: "Bhuj, Gujarat, India",
    links: [
      { name: "GitHub", url: "https://github.com/tejas20002", icon: "🐙" },
      { name: "LinkedIn", url: "https://linkedin.com/in/tjhirani", icon: "🔗" },
      { name: "Email", url: "mailto:tejashirani55@gmail.com", icon: "📧" }
    ]
  };
</script>

<div class="contact-app">
  <div class="header">
    <div class="avatar">TH</div>
    <h1>{profile.name}</h1>
    <p class="role">{profile.role}</p>
    <p class="loc">📍 {profile.location}</p>
  </div>

  <div class="links">
    {#each profile.links as link}
      <a href={link.url} target="_blank" class="link-card">
        <span class="link-icon">{link.icon}</span>
        <span class="link-name">{link.name}</span>
        <span class="arrow">→</span>
      </a>
    {/each}
  </div>

  <div class="footer">
    <p>Feel free to reach out for collaborations or opportunities!</p>
  </div>
</div>

<style>
  .contact-app {
    padding: 30px;
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    height: 100%;
    overflow-y: auto;
  }

  .header {
    text-align: center;
  }

  .avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    margin: 0 auto 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    color: #000;
  }

  h1 { font-size: 24px; margin: 0; }
  .role { color: var(--accent); font-weight: 600; margin: 5px 0; }
  .loc { font-size: 13px; color: var(--muted); }

  .links {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
  }

  .link-card {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 16px;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .link-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: var(--accent);
  }

  .link-icon { font-size: 20px; margin-right: 15px; }
  .link-name { flex: 1; font-weight: 500; }
  .arrow { color: var(--muted); opacity: 0.5; }

  .footer {
    margin-top: auto;
    text-align: center;
    color: var(--muted);
    font-size: 13px;
  }
</style>

<template>
  <footer class="footer">
    <p class="footer-paragraph">Autor</p>
    <a
      href="https://github.com/sebastianguanque"
      target="_blank"
      class="social-link footer-icon"
      title="GitHub"
      aria-label="Perfil de GitHub de Sebastián Guanque"
    >
      <i class="fab fa-github"></i>
    </a>
    <a
      href="https://linkedin.com/in/sebastianguanque"
      target="_blank"
      class="social-link footer-icon"
      title="LinkedIn"
      aria-label="Perfil de LinkedIn de Sebastián Guanque"
    >
      <i class="fab fa-linkedin-in"></i>
    </a>
  </footer>
</template>

<style scoped>
.footer {
  font-size: 1.2rem;
  margin: 1rem 0;
  color: white;
  display: flex;
  gap: 8px;
  align-items: center;
}

.footer-paragraph {
  margin: 0;
}

.footer-icon {
  color: white;
  transition: transform 0.3s ease;
  text-decoration: none;
}

.footer-icon:hover {
  transform: scale(1.1);
}
</style>

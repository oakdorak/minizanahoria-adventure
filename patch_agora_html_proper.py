import re

with open('agora.html', 'r') as f:
    content = f.read()

# Make .mirror-content p style apply generally to .mirror-content
old_css = """    .mirror-content {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--color-text-secondary);
      flex: 1;
      min-height: 120px;
    }"""

new_css = """    .mirror-content {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--color-text-secondary);
      flex: 1;
      min-height: 120px;
    }

    .mirror-content p {
      margin-bottom: 0.5rem;
    }"""

content = content.replace(old_css, new_css)

with open('agora.html', 'w') as f:
    f.write(content)

print("Patch html applied successfully.")

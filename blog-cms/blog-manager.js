const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Paths
const ARTICLES_DIR = 'C:\\Users\\poolr\\imobiliario-whitelabel\\blog-content\\articles';
const CONFIG_FILE = 'C:\\Users\\poolr\\imobiliario-whitelabel\\blog-content\\seo-config\\blog-seo-config.json';

// ============================================
// UTILITIES
// ============================================

// Parse markdown frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const [, frontmatter, markdown] = match;
  const metadata = {};
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...values] = line.split(':');
    if (key && values.length) {
      const value = values.join(':').trim();
      // Remove quotes
      metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  });
  
  return { metadata, content: markdown.trim() };
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ============================================
// ROUTES
// ============================================

// Lista todos os artigos
app.get('/api/blog/articles', async (req, res) => {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    const articles = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
        const { metadata } = parseFrontmatter(content);
        
        articles.push({
          filename: file,
          slug: metadata.slug || file.replace('.md', ''),
          title: metadata.title || 'Sem título',
          excerpt: metadata.excerpt || '',
          category: metadata.category || 'geral',
          date: metadata.date || '',
          author: metadata.author || '',
          featured_image: metadata.featured_image || ''
        });
      }
    }
    
    // Ordenar por data (mais recente primeiro)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Busca artigo específico por slug
app.get('/api/blog/articles/:slug', async (req, res) => {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    
    for (const file of files) {
      const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
      const { metadata, content: markdown } = parseFrontmatter(content);
      
      if (metadata.slug === req.params.slug || file.replace('.md', '') === req.params.slug) {
        return res.json({
          success: true,
          data: {
            ...metadata,
            content: markdown,
            filename: file
          }
        });
      }
    }
    
    res.status(404).json({ success: false, message: 'Artigo não encontrado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cria novo artigo
app.post('/api/blog/articles', async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Título e conteúdo são obrigatórios' });
    }
    
    const slug = generateSlug(title);
    const date = new Date().toISOString().split('T')[0];
    
    const frontmatter = `---
title: "${title}"
slug: "${slug}"
author: "${author || 'Admin'}"
date: "${date}"
category: "${category || 'geral'}"
tags: ${JSON.stringify(tags || [])}
excerpt: "${excerpt || content.substring(0, 150)}..."
featured_image: "/images/blog/${slug}.jpg"
seo:
  meta_title: "${title} | Blog"
  meta_description: "${excerpt || content.substring(0, 155)}"
  canonical: "https://terrasnoparaguay.com/blog/${slug}"
---

${content}`;
    
    const filename = `${slug}.md`;
    const filepath = path.join(ARTICLES_DIR, filename);
    
    // Verifica se já existe
    try {
      await fs.access(filepath);
      return res.status(409).json({ success: false, message: 'Artigo com este slug já existe' });
    } catch {
      // Arquivo não existe, pode criar
    }
    
    await fs.writeFile(filepath, frontmatter, 'utf-8');
    
    res.status(201).json({
      success: true,
      data: { slug, filename },
      message: 'Artigo criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Atualiza artigo existente
app.put('/api/blog/articles/:slug', async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, author } = req.body;
    const files = await fs.readdir(ARTICLES_DIR);
    
    let targetFile = null;
    for (const file of files) {
      const fileContent = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
      const { metadata } = parseFrontmatter(fileContent);
      
      if (metadata.slug === req.params.slug) {
        targetFile = file;
        break;
      }
    }
    
    if (!targetFile) {
      return res.status(404).json({ success: false, message: 'Artigo não encontrado' });
    }
    
    const slug = generateSlug(title);
    const date = new Date().toISOString().split('T')[0];
    
    const frontmatter = `---
title: "${title}"
slug: "${slug}"
author: "${author || 'Admin'}"
date: "${date}"
category: "${category || 'geral'}"
tags: ${JSON.stringify(tags || [])}
excerpt: "${excerpt || content.substring(0, 150)}..."
featured_image: "/images/blog/${slug}.jpg"
seo:
  meta_title: "${title} | Blog"
  meta_description: "${excerpt || content.substring(0, 155)}"
  canonical: "https://terrasnoparaguay.com/blog/${slug}"
---

${content}`;
    
    const filepath = path.join(ARTICLES_DIR, targetFile);
    await fs.writeFile(filepath, frontmatter, 'utf-8');
    
    // Se slug mudou, renomear arquivo
    if (slug !== req.params.slug) {
      const newFilepath = path.join(ARTICLES_DIR, `${slug}.md`);
      await fs.rename(filepath, newFilepath);
    }
    
    res.json({
      success: true,
      data: { slug },
      message: 'Artigo atualizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deleta artigo
app.delete('/api/blog/articles/:slug', async (req, res) => {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    
    for (const file of files) {
      const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
      const { metadata } = parseFrontmatter(content);
      
      if (metadata.slug === req.params.slug) {
        await fs.unlink(path.join(ARTICLES_DIR, file));
        return res.json({
          success: true,
          message: 'Artigo deletado com sucesso'
        });
      }
    }
    
    res.status(404).json({ success: false, message: 'Artigo não encontrado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Busca por categoria
app.get('/api/blog/categories/:category', async (req, res) => {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    const articles = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
        const { metadata } = parseFrontmatter(content);
        
        if (metadata.category === req.params.category) {
          articles.push({
            slug: metadata.slug,
            title: metadata.title,
            excerpt: metadata.excerpt,
            date: metadata.date
          });
        }
      }
    }
    
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lista todas as categorias
app.get('/api/blog/categories', async (req, res) => {
  try {
    const config = await fs.readFile(CONFIG_FILE, 'utf-8');
    const { categories } = JSON.parse(config);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// INTERFACE ADMIN SIMPLES (HTML)
// ============================================

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Blog CMS - Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui; background: #f3f4f6; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #059669; margin-bottom: 30px; }
        .articles { display: grid; gap: 15px; }
        .article { background: white; padding: 20px; border-radius: 8px; }
        .article h3 { color: #1f2937; margin-bottom: 10px; }
        .article p { color: #6b7280; margin-bottom: 15px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px; }
        .btn-primary { background: #059669; color: white; }
        .btn-secondary { background: #3b82f6; color: white; }
        .btn-danger { background: #ef4444; color: white; }
        #articleForm { background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        input, textarea, select { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #d1d5db; border-radius: 6px; }
        textarea { min-height: 200px; font-family: monospace; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Blog CMS - Gerenciador de Artigos</h1>
        
        <div id="articleForm">
            <h2 id="formTitle">Novo Artigo</h2>
            <input type="hidden" id="editSlug" />
            <input id="title" placeholder="Título" />
            <input id="excerpt" placeholder="Resumo (excerpt)" />
            <select id="category">
                <option value="mercado-local">Mercado Local</option>
                <option value="dicas-compra">Dicas de Compra</option>
                <option value="investimento">Investimento</option>
                <option value="lifestyle">Lifestyle</option>
            </select>
            <textarea id="content" placeholder="Conteúdo em Markdown"></textarea>
            <button class="btn btn-primary" onclick="saveArticle()">Salvar Artigo</button>
            <button class="btn btn-secondary hidden" id="cancelBtn" onclick="cancelEdit()">Cancelar</button>
        </div>
        
        <h2>Artigos Existentes</h2>
        <div id="articles" class="articles"></div>
    </div>
    
    <script>
        let isEditing = false;
        
        async function loadArticles() {
            const res = await fetch('/api/blog/articles');
            const { data } = await res.json();
            
            const container = document.getElementById('articles');
            container.innerHTML = data.map(a => \`
                <div class="article">
                    <h3>\${a.title}</h3>
                    <p>\${a.excerpt}</p>
                    <small>Categoria: \${a.category} | Data: \${a.date}</small><br><br>
                    <button class="btn btn-secondary" onclick="editArticle('\${a.slug}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteArticle('\${a.slug}')">Deletar</button>
                </div>
            \`).join('');
        }
        
        async function saveArticle() {
            const slug = document.getElementById('editSlug').value;
            const data = {
                title: document.getElementById('title').value,
                excerpt: document.getElementById('excerpt').value,
                category: document.getElementById('category').value,
                content: document.getElementById('content').value
            };
            
            const url = isEditing ? \`/api/blog/articles/\${slug}\` : '/api/blog/articles';
            const method = isEditing ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert(isEditing ? 'Artigo atualizado!' : 'Artigo criado!');
                clearForm();
                loadArticles();
            }
        }
        
        async function editArticle(slug) {
            const res = await fetch(\`/api/blog/articles/\${slug}\`);
            const { data } = await res.json();
            
            document.getElementById('formTitle').textContent = 'Editar Artigo';
            document.getElementById('editSlug').value = slug;
            document.getElementById('title').value = data.title;
            document.getElementById('excerpt').value = data.excerpt;
            document.getElementById('category').value = data.category;
            document.getElementById('content').value = data.content;
            document.getElementById('cancelBtn').classList.remove('hidden');
            
            isEditing = true;
            window.scrollTo(0, 0);
        }
        
        function cancelEdit() {
            clearForm();
        }
        
        function clearForm() {
            document.getElementById('formTitle').textContent = 'Novo Artigo';
            document.getElementById('editSlug').value = '';
            document.getElementById('title').value = '';
            document.getElementById('excerpt').value = '';
            document.getElementById('content').value = '';
            document.getElementById('category').value = 'mercado-local';
            document.getElementById('cancelBtn').classList.add('hidden');
            isEditing = false;
        }
        
        async function deleteArticle(slug) {
            if (!confirm('Deletar artigo?')) return;
            
            await fetch(\`/api/blog/articles/\${slug}\`, { method: 'DELETE' });
            loadArticles();
        }
        
        loadArticles();
    </script>
</body>
</html>
  `);
});
// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Blog CMS rodando em http://localhost:${PORT}`);
  console.log(`📂 Artigos em: ${ARTICLES_DIR}`);
});
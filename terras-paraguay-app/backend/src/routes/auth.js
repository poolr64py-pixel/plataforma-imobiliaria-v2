const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Função para gerar JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/register
 * Registro de usuário
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('tenant_slug').optional().isAlphanumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, tenant_slug } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Se tenant_slug fornecido, verificar se existe
    let tenant_id = null;
    if (tenant_slug) {
      const Tenant = require('../models/Tenant');
      const tenant = await Tenant.findOne({ where: { slug: tenant_slug } });
      if (!tenant) {
        return res.status(400).json({ error: 'Tenant not found' });
      }
      tenant_id = tenant.id;
    }

    // Criar usuário
    const user = await User.create({
      email,
      password,
      name,
      tenant_id,
      role: tenant_id ? 'user' : 'user',
      status: 'active'
    });

    // Gerar token
    const token = generateToken(user.id);

    // Atualizar login
    await user.update({
      last_login_at: new Date(),
      login_count: user.login_count + 1
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant_id: user.tenant_id
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Login de usuário
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar senha
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar status
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Gerar token
    const token = generateToken(user.id);

    // Atualizar login
    await user.update({
      last_login_at: new Date(),
      login_count: user.login_count + 1
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant_id: user.tenant_id,
        permissions: user.permissions
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Perfil do usuário logado
 */
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        tenant_id: req.user.tenant_id,
        profile: req.user.profile,
        permissions: req.user.permissions,
        last_login_at: req.user.last_login_at
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/auth/profile
 * Atualizar perfil do usuário
 */
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('profile.phone').optional().isMobilePhone(),
  body('profile.bio').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'profile', 'settings'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    await req.user.update(updates);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        profile: req.user.profile,
        settings: req.user.settings
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/change-password
 * Alterar senha
 */
router.post('/change-password', auth, [
  body('current_password').exists(),
  body('new_password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { current_password, new_password } = req.body;

    // Verificar senha atual
    const user = await User.findByPk(req.user.id);
    const isValidPassword = await user.validatePassword(current_password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Atualizar senha
    await user.update({ password: new_password });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Logout (para casos onde precisamos invalidar token)
 */
router.post('/logout', auth, async (req, res) => {
  try {
    // Por enquanto apenas resposta de sucesso
    // Em implementação futura, adicionar blacklist de tokens
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
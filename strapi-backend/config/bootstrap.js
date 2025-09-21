module.exports = async ({ strapi }) => {
  const userExists = await strapi.admin.services.user.fetch({ email: 'poolr64py@gmail.com' });
  if (!userExists) {
    await strapi.admin.services.user.create({
      firstname: 'Roberto',
      lastname: 'de Moura',
      email: 'poolr64py@gmail.com',
      password: '25Paulor+*&%',
      blocked: false,
      isActive: true,
      roles: [await strapi.admin.services.role.getSuperAdmin()],
    });
    console.log('Usuário admin criado!');
  }
};

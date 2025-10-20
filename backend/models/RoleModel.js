
const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  NORMAL_USER: 'NORMAL_USER',
  STORE_OWNER: 'STORE_OWNER',
};

const list = () => Object.values(ROLES);

const isValid = (role) => !!ROLES[role] || Object.values(ROLES).includes(role);

export default {
  ROLES,
  list,
  isValid,
};

import React from 'react';
import { useTenant } from './contexts/TenantContext';

const TenantSelector = () => {
  const { tenant, tenants, switchTenant } = useTenant();

  return (
    <select
      value={tenant.id}
      onChange={(e) => switchTenant(e.target.value)}
      className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
    >
      {tenants.map(t => (
        <option key={t.id} value={t.id}>
          {t.flag} {t.nome}
        </option>
      ))}
    </select>
  );
};

export default TenantSelector;
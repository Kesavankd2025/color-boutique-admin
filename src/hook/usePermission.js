import { useSelector } from 'react-redux';
const Permission = (user, feature, access) => {
  if (user?.type === 'admin') {
    return true;
  }
  if (!user || !user.role || !user.role.rolePermissions) {
    return false;
  }
  const permission = user.role.rolePermissions.find(p => p.feature === feature);
  if (permission) {
    return permission[access];
  }
  return false;
};

const usePermission = (feature, access) => {
  const { user } = useSelector((state) => state.auth);
  return Permission(user, feature, access);
};

export default usePermission;

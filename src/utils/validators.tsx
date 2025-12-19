export const validateRegister = (data: any) => {
  if (!data.name || data.name.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!/^\d{10,15}$/.test(data.phone)) {
    return "Enter a valid phone number";
  }

  if (!data.gender) {
    return "Please select gender";
  }

  if (!data.dob) {
    return "Date of birth is required";
  }

  if (!data.password || data.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};
export const validateLogin = (phone: string, password: string) => {
  if (!phone || !password) return "All fields required";
  return null;
};
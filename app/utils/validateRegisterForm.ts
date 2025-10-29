export type ValidationErrors = {
  [key: string]: string;
};

export const validateRegisterForm = (form: any, role: "User" | "Doctor") => {
  const errors: ValidationErrors = {};

  // Email
  if (!form.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email";

  // First Name
  if (!form.firstName) errors.firstName = "First name is required";

  // Last Name
  if (!form.lastName) errors.lastName = "Last name is required";

  // Phone
  if (!form.phone) errors.phone = "Phone number is required";

  // Gender
  if (!form.gender) errors.gender = "Please select gender";

  // Password
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 6) errors.password = "Minimum 6 characters required";

  // Confirm Password
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (role === "User") {
    if (!form.dob) errors.dob = "Date of birth is required";
    if (!form.bloodGroup) errors.bloodGroup = "Blood group is required";
  }

  if (role === "Doctor") {
    if (!form.specialization) errors.specialization = "Specialization is required";
    if (!form.qualifications) errors.qualifications = "Qualifications are required";
    if (!form.experienceYears) errors.experienceYears = "Years of experience is required";
    if (!form.bio || form.bio.length < 10) {
      errors.bio = "Bio should be at least 10 characters";
    }
  }

  return errors;
};

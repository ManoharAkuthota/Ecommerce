/**
 * Password Strength Evaluation Utility
 * Module: utils/passwordStrength.js
 * 
 * Analyzes password complexity across 5 criteria:
 * 1. Minimum 8 characters
 * 2. At least one uppercase letter (A-Z)
 * 3. At least one lowercase letter (a-z)
 * 4. At least one numeric digit (0-9)
 * 5. At least one special character (!@#$%^&*()_+-=[]{};':"|,.<>/?)
 * 
 * Returns score (0-4), descriptive label, Tailwind color classes,
 * width percentage, and a granular requirements checklist.
 */

export const evaluatePasswordStrength = (password = '') => {
  const pwd = String(password || '');

  const requirements = [
    { id: 'length', label: 'At least 8 characters', met: pwd.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', met: /[a-z]/.test(pwd) },
    { id: 'number', label: 'One numeric digit (0-9)', met: /\d/.test(pwd) },
    {
      id: 'special',
      label: 'One special character (!@#$%^&*)',
      met: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    },
  ];

  const metCount = requirements.filter((r) => r.met).length;

  if (!pwd || pwd.length === 0) {
    return {
      score: 0,
      label: '',
      color: 'bg-neutral-700',
      textColor: 'text-neutral-500',
      borderColor: 'border-neutral-700',
      percent: 0,
      isValid: false,
      requirements,
    };
  }

  // Determine strength category
  if (metCount <= 2 || pwd.length < 8) {
    return {
      score: 1,
      label: 'Weak',
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/50',
      percent: 25,
      isValid: false,
      requirements,
    };
  }

  if (metCount === 3) {
    return {
      score: 2,
      label: 'Fair',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      percent: 50,
      isValid: false,
      requirements,
    };
  }

  if (metCount === 4) {
    return {
      score: 3,
      label: 'Good',
      color: 'bg-sky-500',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/50',
      percent: 75,
      isValid: false,
      requirements,
    };
  }

  // All 5 requirements met
  return {
    score: 4,
    label: 'Strong',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    percent: 100,
    isValid: true,
    requirements,
  };
};

export default evaluatePasswordStrength;

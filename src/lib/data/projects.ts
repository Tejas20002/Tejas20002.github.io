export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  github?: string;
  demo?: string;
  icon?: string;
}

export const projects: Project[] = [
  {
    id: 'scutum',
    title: 'Scutum - Passwordless Auth',
    description: 'A revolutionary passwordless authentication system using OTP and high-security tokens.',
    tags: ['Security', 'OTP', 'Auth'],
    icon: '🔐',
    content: `
# Scutum

Scutum is a **security-first** authentication platform designed to eliminate the risks associated with passwords.

## Key Features
- **OTP-based login**: No more remembered passwords.
- **Token rotation**: Every session is uniquely secured.
- **Biometric ready**: Easily integrates with WebAuthn.

## Tech Stack
- Laravel
- Redis
- PostgreSQL
    `
  },
  {
    id: 'gatepass',
    title: 'Gate Pass - Hostel Management',
    description: 'Efficient backend for managing student entries and exits in hostels.',
    tags: ['Management', 'PHP', 'REST'],
    icon: '🏫',
    content: `
# Gate Pass

A comprehensive management system for educational institutions.

## Goal
To automate the leave request process and track entries/exits in real-time.

## features
- QR code entry tracking.
- Parent notification system.
- Warden dashboard.
    `
  }
];

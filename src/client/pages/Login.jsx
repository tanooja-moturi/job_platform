import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SeekerLogin from './seeker/SeekerLogin';
import EmployerLogin from './employer/EmployerLogin';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  if (role === 'employer') {
    return <EmployerLogin />;
  }

  return <SeekerLogin />;
}

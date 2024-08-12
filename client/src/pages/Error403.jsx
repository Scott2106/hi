import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const Error403 = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100">
      <div className="max-w-lg p-8 text-center bg-white border border-red-300 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Error: Not Authorised <Link to="/home"><Button className="mx-1" variant="link">Home</Button></Link></h1>
        <p className="text-lg text-red-600 mb-2">
          You are not authorised to view the page you are trying to reach.
        </p>
        <p className="text-lg text-red-600">
          If you believe you encountered this page in error, and that you should
          have access to the resource you are trying to access, contact technical
          support.
        </p>
      </div>
    </div>
  );
};

export default Error403;
function PasswordInstructions() {
  return (
    <div className="text-xs mt-3">
      <p>Password requirements:</p>
      <ul className="list-disc pl-5">
        <li>At least 8 characters long</li>
        <li>At most 20 characters long</li>
        <li>Contains at least one uppercase letter</li>
        <li>Contains at least one lowercase letter</li>
        <li>Contains at least one digit</li>
        <li>Contains at least one special character (!@#$%^&*)</li>
      </ul>
    </div>
  );
}

export default PasswordInstructions;

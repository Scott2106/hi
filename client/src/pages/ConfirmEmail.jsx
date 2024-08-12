import EmailForm from "../components/EmailForm.jsx";

const ConfirmEmail = () => {
  // get the email from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <EmailForm defaultEmail={email} />
    </div>
  );
};

export default ConfirmEmail;

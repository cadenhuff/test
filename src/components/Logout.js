// This React component renders a button for logging out.
// It receives a callback function 'onLogout' as a prop, which is invoked when the button is clicked.
// The purpose of this component is to provide a simple UI element for initiating the logout process.
const Logout = ({ onLogout }) => (
  // Render a button with a click event handler to trigger the logout process
  <button className="logout-button" onClick={onLogout}>
    Log Out
  </button>
);

// Export the Logout component
export default Logout;

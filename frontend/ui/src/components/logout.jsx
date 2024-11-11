const handleLogout = () => {
  setUser(null); // Clear user state
  userSession.clearUserSession(); // Clear user data from local storage
  window.location.href = "/"; // Redirect to homepage or login page
};

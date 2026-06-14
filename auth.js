export const checkAuth = () => {
const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");

  if (user && token && loginTime) {
    const loginTimestamp = new Date(loginTime).getTime(); 
    const now = Date.now();

    const diff = now - loginTimestamp; 
    const MAX_SESSION_DURATION = 300 * 60 * 1000; 

    const role = JSON.parse(user).role;
    const currentPath = window.location.pathname;

    if (diff <= MAX_SESSION_DURATION) {
      // Not yet expired
      if (!currentPath.includes(`${role}/dashboard`)) {
        window.location.href = `/${role}/dashboard`;
      }
    } else {
      // Session expired — clear and send to login
      
      if (currentPath !== "/") {
        window.location.href = "/";
      }
    }
  } else {
    // Not logged in — redirect to login if not already there
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }
};

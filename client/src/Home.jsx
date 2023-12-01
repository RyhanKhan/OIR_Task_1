import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/home")
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          setAuthenticated(true);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/login");
      });
  }, [navigate]);

  if (!authenticated) {
    return null; // or some loading indicator while checking authentication
  }

  return (
    <div>
      <h1>This is the Home Page</h1>
    </div>
  );
};
export default Home;

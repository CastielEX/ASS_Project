import { Link } from "react-router-dom";
import gamestop from "../img/GameStop-Logo.png";

const Home = () => {
  return (
    <section className="main-layout">
      <div className="home-welcome">
        <img className="all-price-md-logo" src={gamestop} alt="logo" />
        <h1 className="home-welcome-h1">WELCOME TO GAMESTOP</h1>
        <p className="home-welcome-description">
          Here you can find best gaming products for the best price in entire country. 
          You can find everything in our Catalog page, feel free to explore and to buy everything you need.
          In case of finding any bugs or having any qeustion please contacts us at this email
          gamestopmd@gmail.com. Thank you and happy shopping!
        </p>
        <div className="home-button-container">
        <Link to="Catalog"><button className="home-button">CATALOG</button></Link>
        </div>
      </div>
    </section>
  );
};
export default Home;

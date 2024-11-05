import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Styles/main.css";

function Navbars() {
	const navRef = useRef();

	const showNavbars = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};

	return (
		<header>
			<h3 className="head-logo">recoco</h3>
			<nav ref={navRef}>
				<a href="/#">Home</a>
				<a href="/#">My Account</a>
				<a href="/#">About project</a>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbars}>
					<FaTimes />
				</button>
			</nav>
			<button
				className="nav-btn"
				onClick={showNavbars}>
				<FaBars />
			</button>
		</header>
	);
}

export default Navbars;
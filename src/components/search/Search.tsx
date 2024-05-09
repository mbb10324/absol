import { FiSearch } from "react-icons/fi";
import "./Search.css";

export default function Search() {
	return (
		<div className="search-container">
			<input type="search" className="search" placeholder="Search..." />
			<FiSearch className="search-icon" />
		</div>
	);
}

import { useState } from "react";
import { headerButtons } from "../../utils/headerButtons";
import HeaderButtonGroup from "../headerButtonGroup/HeaderButtonGroup";
import Settings from "../settings/Settings";
import "./Header.css";
import { FiSearch } from "react-icons/fi";

export default function Header() {
	const [selected, setSelected] = useState("For You");
	const [settingsOpen, setSettingsOpen] = useState(false);
	const headerBtns = headerButtons({ setSettingsOpen, setSelected });
	return (
		<>
			<div className="header">
				<h1>ABSOL</h1>
				<HeaderButtonGroup selected={selected} headerButtons={headerBtns} />
				<div className="search-container">
					<input type="search" className="search" placeholder="Search..." />
					<FiSearch className="search-icon" />
				</div>
			</div>
			<Settings settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />
		</>
	);
}

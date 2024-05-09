import HeaderButtonGroup from "../headerButtonGroup/HeaderButtonGroup";
import { headerButtons } from "../../utils/headerButtons";
import Settings from "../settings/Settings";
import { useState } from "react";
import "./Header.css";

export default function Header() {
	const [selected, setSelected] = useState("For You");
	const [settingsOpen, setSettingsOpen] = useState(false);
	const headerBtns = headerButtons({ setSettingsOpen, setSelected });

	return (
		<>
			<div className="header">
				<h1>ABSOL</h1>
				<HeaderButtonGroup selected={selected} headerButtons={headerBtns} />
			</div>
			<Settings settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />
		</>
	);
}

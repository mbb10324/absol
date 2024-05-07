import Button from "../button/Button";
import Drawer from "../drawer/Drawer";
import ThemePicker from "../themePicker/ThemePicker";
import "./Settings.css";
import { IoClose } from "react-icons/io5";

type SettingsProps = {
	settingsOpen: boolean;
	setSettingsOpen: (settingsOpen: boolean) => void;
};

export default function Settings(props: SettingsProps) {
	const { settingsOpen, setSettingsOpen } = props;

	return (
		<Drawer drawerOpen={settingsOpen} setDrawerOpen={setSettingsOpen}>
			<div className="settings">
				<h2>Settings</h2>
				<div className="close-settings-btn">
					<Button onClick={() => setSettingsOpen(false)}>
						<IoClose />
					</Button>
				</div>
				<div className="theme-picker">
					<h3>Theme:</h3>
					<ThemePicker />
				</div>
			</div>
		</Drawer>
	);
}

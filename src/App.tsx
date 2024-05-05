import { darkTheme, lightTheme } from "./utils/themes";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useState } from "react";
import "./App.css";
import Button from "./components/button/Button";

function App() {
	const [theme, setTheme] = useState(darkTheme);

	return (
		<div className="app">
			<div className="container">
				<div className="header">
					<h1>Absol</h1>
					<div className="header-links">
						<Button onClick={() => {}}>For You</Button>
						<Button onClick={() => {}}>Subscribed</Button>
						<Button onClick={() => {}}>Trending</Button>
						<Button onClick={() => {}}>Profile</Button>
						<Button onClick={() => {}}>Settings</Button>
						<Button
							onClick={() => {
								theme === darkTheme ? setTheme(lightTheme) : setTheme(darkTheme);
							}}
						>
							{theme === darkTheme ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
						</Button>
					</div>
				</div>
				<style>{theme}</style>
			</div>
		</div>
	);
}

export default App;

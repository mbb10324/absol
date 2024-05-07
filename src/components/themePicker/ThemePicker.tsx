import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { darkTheme, lightTheme } from "../../utils/themes";
import Button from "../button/Button";
import { useState } from "react";

export default function ThemePicker() {
	const [theme, setTheme] = useState(darkTheme);

	return (
		<>
			<Button
				onClick={() => {
					theme === darkTheme ? setTheme(lightTheme) : setTheme(darkTheme);
				}}
			>
				{theme === darkTheme ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
			</Button>
			<style>{theme}</style>
		</>
	);
}

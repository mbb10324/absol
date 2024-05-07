type headerButtonsParams = {
	setSettingsOpen: (settingsOpen: boolean) => void;
	setSelected: (selected: string) => void;
};

export function headerButtons({ setSettingsOpen, setSelected }: headerButtonsParams) {
	return [
		{
			title: "For You",
			function: () => setSelected("For You"),
		},
		{
			title: "Subscribed",
			function: () => setSelected("Subscribed"),
		},
		{
			title: "Trending",
			function: () => setSelected("Trending"),
		},
		{
			title: "Profile",
			function: () => setSelected("Profile"),
		},
		{
			title: "Settings",
			function: () => setSettingsOpen(true),
		},
	];
}

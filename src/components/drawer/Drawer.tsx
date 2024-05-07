import "./Drawer.css";

type DrawerProps = {
	children: React.ReactNode;
	drawerOpen: boolean;
	setDrawerOpen: (drawerOpen: boolean) => void;
};

export default function Drawer(props: DrawerProps) {
	const { drawerOpen, setDrawerOpen, children } = props;
	return (
		<>
			<div className={`drawer ${drawerOpen ? "drawer-open" : ""}`}>{children}</div>
			<div className={`drawer-overlay ${drawerOpen ? "drawer-overlay-shown" : ""}`} onClick={() => setDrawerOpen(false)} />
		</>
	);
}
